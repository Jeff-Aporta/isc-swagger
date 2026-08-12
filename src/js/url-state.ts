/**
 * url-state.ts — estado de navegación del visor en la query string.
 *
 * Un enlace tiene que reabrir exactamente lo mismo: la pestaña de nav, la
 * operación desplegada y su sub-pestaña. Todo eso son tres parámetros planos,
 * no un blob codificado, para que se puedan editar a mano.
 *
 *   ?tab=<nav>&op=<operationId>&opt=<try|examples|doc>
 *
 * Las escrituras usan `replaceState`: desplegar una tarjeta no debe llenar el
 * historial de entradas que el botón «atrás» tenga que deshacer una a una.
 */

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

const leerParams = (): URLSearchParams => {
  try {
    return new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
  } catch {
    return new URLSearchParams();
  }
};

export function readUrlState(): SwUrlState {
  const sp = leerParams();
  const opTab = String(sp.get(PARAM_OP_TAB) ?? '').trim() as SwOpTab;
  return {
    tab: String(sp.get(PARAM_TAB) ?? '').trim(),
    op: String(sp.get(PARAM_OP) ?? '').trim(),
    opTab: OP_TABS.includes(opTab) ? opTab : OP_TAB_DEFAULT,
  };
}

/** Fusiona solo las claves presentes; `''` borra el parámetro. */
export function mergeUrlState(patch: Partial<SwUrlState>): void {
  if (typeof location === 'undefined') return;
  try {
    const url = new URL(location.href);
    const set = (k: string, v: string | undefined): void => {
      if (v === undefined) return;
      if (v) url.searchParams.set(k, v);
      else url.searchParams.delete(k);
    };
    set(PARAM_TAB, patch.tab);
    set(PARAM_OP, patch.op);
    set(PARAM_OP_TAB, patch.opTab === OP_TAB_DEFAULT ? '' : patch.opTab);
    history.replaceState(history.state, '', url);
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
