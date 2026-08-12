/**
 * search-state.ts — `?s=<base64url>` como bolsa compartida de estado visual.
 *
 * El visor ya usa `?s=` para tema y paleta (lo escribe `boot.js` antes del
 * primer pintado, sin parpadeo). El query de búsqueda se suma a esa misma
 * bolsa: `?s=<base64url(JSON)>` con `{theme, palette, q}`. Así, un F5 deja
 * al visor exactamente como estaba: tema, paleta y query.
 *
 * ¿Por qué no un `?q=` aparte? Porque la `?s=` ya existe con un contrato
 * estable (la entiende `boot.js` y el preview kit del visor); multiplicar
 * parámetros para el mismo fin separa lo que el usuario ve como «un estado».
 */

const S_KEY = 's';

const b64 = {
  encode(s: string): string {
    let bin = '';
    for (const b of new TextEncoder().encode(s)) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  decode(s: string): string {
    let pad = s.replace(/-/g, '+').replace(/_/g, '/');
    while (pad.length % 4) pad += '=';
    const bin = atob(pad);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  },
};

/** Lee la bolsa completa desde la URL. Vacía si no hay `?s=` o está corrupto. */
export function readSState(): Record<string, unknown> {
  if (typeof location === 'undefined') return {};
  const raw = new URLSearchParams(location.search).get(S_KEY);
  if (!raw) return {};
  try {
    const obj = JSON.parse(b64.decode(raw));
    return obj && typeof obj === 'object' ? (obj as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/** Escribe la bolsa en la URL, fusionando con lo que ya estuviera. */
export function writeSState(patch: Record<string, unknown>): void {
  if (typeof location === 'undefined') return;
  const actual = readSState();
  const limpio: Record<string, unknown> = {};
  for (const [k, v] of Object.entries({ ...actual, ...patch })) {
    if (v === undefined) continue;
    if (typeof v === 'string' && !v.trim()) continue;
    limpio[k] = v;
  }
  const url = new URL(location.href);
  if (Object.keys(limpio).length) {
    url.searchParams.set(S_KEY, b64.encode(JSON.stringify(limpio)));
  } else {
    url.searchParams.delete(S_KEY);
  }
  history.replaceState(history.state, '', url);
}

/** Query actual: lee de la URL. Cadena vacía si no hay. */
export function getQuery(): string {
  const q = readSState().q;
  return typeof q === 'string' ? q : '';
}

/** Persiste el query sin tocar tema ni paleta. Cadena vacía lo borra. */
export function setQuery(q: string): void {
  writeSState({ q });
}

/** Borra toda la bolsa `?s=` (tema, paleta y query). El visor arranca «limpio». */
export function clearSState(): void {
  if (typeof location === 'undefined') return;
  const url = new URL(location.href);
  url.searchParams.delete(S_KEY);
  history.replaceState(history.state, '', url);
}