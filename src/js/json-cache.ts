/**
 * json-cache.ts — cache local de los JSON del documento (config/spec).
 *
 * TTL mínimo 24 h: mientras la entrada sea fresca se sirve del almacén y no
 * se golpea la API. Al caducar se pide actualización; si la red falla, se
 * conserva lo cacheado (aunque esté caducado) para que el visor no quede en
 * blanco.
 */

export const JSON_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
export const JSON_CACHE_PREFIX = 'sw:json-cache:v1:';

export type JsonCacheSource = 'cache' | 'network' | 'stale-cache';

export interface JsonCacheEntry {
  /** Epoch ms del último GET exitoso. */
  fetchedAt: number;
  data: unknown;
}

export interface FetchJsonCachedResult {
  data: unknown;
  source: JsonCacheSource;
}

function clave(url: string): string {
  return `${JSON_CACHE_PREFIX}${String(url ?? '').trim()}`;
}

function leer(url: string): JsonCacheEntry | null {
  try {
    const crudo = globalThis.localStorage?.getItem(clave(url));
    if (!crudo) return null;
    const parsed = JSON.parse(crudo) as Partial<JsonCacheEntry>;
    if (typeof parsed?.fetchedAt !== 'number' || !('data' in parsed)) return null;
    return { fetchedAt: parsed.fetchedAt, data: parsed.data };
  } catch {
    return null;
  }
}

function escribir(url: string, data: unknown, fetchedAt: number): void {
  try {
    const entry: JsonCacheEntry = { fetchedAt, data };
    globalThis.localStorage?.setItem(clave(url), JSON.stringify(entry));
  } catch {
    /* cuota / modo privado: el visor sigue con la respuesta en memoria */
  }
}

export function readJsonCache(url: string): JsonCacheEntry | null {
  return leer(url);
}

export function writeJsonCache(url: string, data: unknown, fetchedAt = Date.now()): void {
  if (!String(url ?? '').trim()) return;
  escribir(url, data, fetchedAt);
}

export function isJsonCacheFresh(
  entry: JsonCacheEntry | null | undefined,
  now = Date.now(),
  ttlMs = JSON_CACHE_TTL_MS,
): boolean {
  if (!entry) return false;
  return now - entry.fetchedAt < ttlMs;
}

/**
 * Sirve JSON con cache de 24 h y fallback a entrada caducada si la API falla.
 *
 * @param fetchNetwork GET real (sin cache HTTP del navegador); lanza si falla.
 */
export async function fetchJsonCached(
  url: string,
  fetchNetwork: (url: string) => Promise<unknown>,
  opts: { now?: number; ttlMs?: number } = {},
): Promise<FetchJsonCachedResult> {
  const now = opts.now ?? Date.now();
  const ttlMs = opts.ttlMs ?? JSON_CACHE_TTL_MS;
  const entry = leer(url);

  if (isJsonCacheFresh(entry, now, ttlMs) && entry) {
    return { data: entry.data, source: 'cache' };
  }

  try {
    const data = await fetchNetwork(url);
    escribir(url, data, now);
    return { data, source: 'network' };
  } catch (err) {
    if (entry && 'data' in entry) {
      return { data: entry.data, source: 'stale-cache' };
    }
    throw err;
  }
}
