/**
 * url-state.ts — navegación del visor dentro de `?s=<base64url>`.
 *
 * Un enlace tiene que reabrir exactamente lo mismo: pestaña de nav, operación
 * y sub-pestaña. Eso vive en la bolsa estándar `?s=` junto a tema/paleta/q:
 *
 *   ?s=<base64url({ op, tab, opt, theme, … })>
 *
 * No se escriben `?op=` / `?tab=` / `?opt=` planos (legado: se migran al leer).
 * Las escrituras usan `replaceState` vía `writeSState`.
 */

import { migrateLegacyNavToS, readSState, writeSState } from './search-state.js';

export const PARAM_TAB = 'tab';
export const PARAM_OP = 'op';
export const PARAM_OP_TAB = 'opt';

export const OP_TABS = ['try', 'examples', 'doc'] as const;
export type SwOpTab = (typeof OP_TABS)[number];
export const OP_TAB_DEFAULT: SwOpTab = 'try';

export interface SwUrlState {
  tab: string;
  op: string;
  opTab: SwOpTab;
}

function strField(bag: Record<string, unknown>, key: string): string {
  const v = bag[key];
  return typeof v === 'string' ? v.trim() : '';
}

export function readUrlState(): SwUrlState {
  migrateLegacyNavToS();
  const bag = readSState();
  const opTabRaw = strField(bag, PARAM_OP_TAB) as SwOpTab;
  return {
    tab: strField(bag, PARAM_TAB),
    op: strField(bag, PARAM_OP),
    opTab: OP_TABS.includes(opTabRaw) ? opTabRaw : OP_TAB_DEFAULT,
  };
}

/** Fusiona solo las claves presentes; `''` borra el campo en `?s=`. */
export function mergeUrlState(patch: Partial<SwUrlState>): void {
  if (typeof location === 'undefined') return;
  try {
    migrateLegacyNavToS();
    /** @type {Record<string, unknown>} */
    const next: Record<string, unknown> = {};
    if (patch.tab !== undefined) next[PARAM_TAB] = patch.tab;
    if (patch.op !== undefined) next[PARAM_OP] = patch.op;
    if (patch.opTab !== undefined) {
      next[PARAM_OP_TAB] = patch.opTab === OP_TAB_DEFAULT ? '' : patch.opTab;
    }
    writeSState(next);
    notificar();
  } catch {
    /* URL no manipulable (file://) */
  }
}

/* ── Suscripción ────────────────────────────────────────────── */

const oyentes = new Set<(estado: SwUrlState) => void>();
let cableado = false;

const notificar = (): void => {
  const estado = readUrlState();
  for (const fn of oyentes) fn(estado);
};

/**
 * Avisa de cualquier cambio de estado, venga de `mergeUrlState` o del botón
 * atrás del navegador. Devuelve la función para desuscribirse.
 */
export function subscribeUrlState(fn: (estado: SwUrlState) => void): () => void {
  oyentes.add(fn);
  if (!cableado && typeof window !== 'undefined') {
    cableado = true;
    window.addEventListener('popstate', notificar);
  }
  return () => oyentes.delete(fn);
}
