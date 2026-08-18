/**
 * config.ts — de dónde sale la configuración del visor y cómo se carga la spec.
 *
 * Precedencia (la primera que resuelva gana):
 *   1. `?conn=<base64url>`           — autoconexión ISS (apiBase + paths + marca).
 *   2. `?spec=<url>` / `?api=<base>` — enlace compartido suelto.
 *   3. `window.__SWAGGER_CONFIG__`   — lo inyecta el host que embebe el visor.
 *   4. `<script type="application/json" id="sw-config">` — SPA suelta.
 *
 * `?conn=` gana sobre el resto a propósito: si alguien comparte un enlace ya
 * conectado, el visor debe conectar al mismo host sin importar la config del
 * demo que esté abierta.
 */

import { parseIsDocument } from './is-document.js';
import { joinConnUrl, normalizeConn, resolveConnConfig } from './conn.js';
import type { SwConn } from './conn.js';
import { isInsoftConfig, parseInsoftConfig } from './insoft-config.js';
import { clearJsonCache, fetchJsonCached } from './json-cache.js';

export const DEFAULT_NS = 'ISA';

/** Normaliza a `https://host/…/api` (añade el `/api` si falta, sin query ni hash). */
export function normalizeApiBase(input: unknown): string {
  let s = String(input ?? '').trim();
  if (!s) return '';
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return '';
  }
  let path = u.pathname.replace(/\/+$/, '');
  if (!path.endsWith('/api')) path = path ? `${path}/api` : '/api';
  u.pathname = path;
  u.search = '';
  u.hash = '';
  return `${u.origin}${u.pathname}`;
}

/** Rutas que el visor consulta al conectarse contra una base `/api`. */
export function inferSwaggerUrls(apiBase: unknown): { apiBase: string; spec: string; config: string } {
  const base = normalizeApiBase(apiBase).replace(/\/$/, '');
  if (!base) return { apiBase: '', spec: '', config: '' };
  return {
    apiBase: base,
    spec: `${base}/swagger.json`,
    config: `${base}/system/swagger/config.json`,
  };
}

function leerConfigEmbebida(): SwConfig {
  if (typeof document === 'undefined') return {};
  const node = document.getElementById('sw-config');
  if (!node?.textContent?.trim()) return {};
  try {
    const parsed = JSON.parse(node.textContent) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as SwConfig) : {};
  } catch {
    return {};
  }
}

/**
 * Config base, antes de consultar la red.
 *
 * `connDirecto` es el conn que el anfitrión le pasa a `<sw-app>` como objeto — la vía que usa
 * quien incrusta el visor como componente. Gana sobre `?conn=` porque es una decisión explícita
 * del anfitrión, no algo que el usuario pueda cambiar editando la barra de direcciones.
 */
export function resolveBootConfig(connDirecto?: SwConn | null): SwConfig {
  const conn = normalizeConn(connDirecto) ?? resolveConnConfig(typeof location !== 'undefined' ? location.search : null);

  const host = (typeof window !== 'undefined' ? window.__SWAGGER_CONFIG__ : null) ?? {};
  const config: SwConfig = { ...leerConfigEmbebida(), ...host };

  const sp = typeof location !== 'undefined' ? new URLSearchParams(location.search) : null;
  const spec = sp?.get('spec')?.trim();
  const api = sp?.get('api')?.trim();

  // `?conn=` manda: fija apiBase + marca + rutas del sistema, y anula el
  // `specUrl` embebido: si el visor queda con el demo local, el usuario
  // ve otra API y cree que «no se conecta». La spec del conn vive en
  // `<apiBase><paths.config>`, calculada en `loadViewerDocument`.
  if (conn) {
    config.apiBase = normalizeApiBase(conn.apiBase);
    if (conn.fixedServer) config.serverSelect = false;
    const brand = { ...(config.brand ?? {}) };
    if (conn.brand.title) brand.title = conn.brand.title;
    if (conn.brand.icon) brand.icon = conn.brand.icon;
    config.brand = brand;
    // La spec del conn se fija aquí y no en `loadViewerDocument`: allí se releía `?conn=` de la
    // URL, así que un conn entregado como objeto a `<sw-app>` se quedaba sin `paths.config` y el
    // visor caía al `/swagger.json` inferido. Con la URL ya resuelta, ambas vías se comportan igual.
    config.specUrl = joinConnUrl(config.apiBase, conn.paths.config) || undefined;
  }
  if (spec) config.specUrl = spec;
  if (api) config.apiBase = normalizeApiBase(api);

  config.ns = config.ns || DEFAULT_NS;
  return config;
}

async function fetchJsonNetwork(url: string): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } });
  } catch (e) {
    throw new Error(`No se pudo conectar con ${url}: ${(e as Error)?.message ?? e}`);
  }
  if (!res.ok) throw new Error(`GET ${url} → ${res.status} ${res.statusText || ''}`.trim());
  const text = await res.text();
  if (!text.trim()) throw new Error(`GET ${url} → respuesta vacía (${res.status})`);
  try {
    return JSON.parse(text) as unknown;
  } catch {
    // Un HTML de error devuelto con 200 es el caso real más frecuente: mostrar
    // el principio del cuerpo ahorra abrir DevTools para entender qué pasó.
    const preview = text.slice(0, 120).replace(/\s+/g, ' ');
    throw new Error(`GET ${url} → JSON inválido (${res.status}): ${preview}`);
  }
}

/** GET JSON con cache ≥24 h; si la API falla tras caducar, reutiliza el cache. */
async function fetchJson(url: string, opts: { force?: boolean } = {}): Promise<unknown> {
  const { data } = await fetchJsonCached(url, fetchJsonNetwork, { force: opts.force });
  return data;
}

/**
 * Carga la spec y la parte de config que venga con ella.
 *
 * Devuelve siempre el par completo: un documento IS puede traer marca, nav y
 * auth propios, y la vista tiene que usarlos sin que la llamada sepa de antemano
 * si el JSON era OpenAPI suelto o documento IS.
 *
 * @param opts.force  Bypass cache 24 h (botón actualizar de la cabecera).
 */
export async function loadViewerDocument(
  config: SwConfig,
  opts: { force?: boolean } = {},
): Promise<{ config: SwConfig; spec: SwSpec }> {
  const embebido = parseIsDocument(config);
  if (embebido) {
    const { spec: _omit, ...viewer } = embebido.config;
    return { config: { ...config, ...viewer }, spec: embebido.spec };
  }

  if (config.spec && typeof config.spec === 'object') {
    const { spec, ...viewer } = config;
    return { config: viewer, spec: spec as SwSpec };
  }

  // `?conn=` fija `apiBase` pero no `specUrl`: la spec vive en
  // `<apiBase>/system/swagger/config.json`. Si la `conn` del visor trae un
  // override de `paths.config`, se respeta; si no, default ISS.
  const connPaths = resolveConnConfig(typeof location !== 'undefined' ? location.search : null)?.paths;
  const connSpecUrl =
    config.apiBase && connPaths?.config ? joinConnUrl(config.apiBase, connPaths.config) : '';

  const url = config.specUrl || connSpecUrl || (config.apiBase ? inferSwaggerUrls(config.apiBase).spec : '');
  if (!url) throw new Error('IS-Swagger: falta `specUrl` o `apiBase`.');

  if (opts.force) clearJsonCache(url);

  const data = await fetchJson(url, { force: opts.force });
  const desdeIs = parseIsDocument(data);
  if (desdeIs) {
    const { spec: _omit, ...viewer } = desdeIs.config;
    return { config: { ...config, ...viewer, specUrl: url }, spec: desdeIs.spec };
  }

  // Documento InSoft (`/system/swagger/config.json`): no es OpenAPI aunque
  // lo parezca. Se transforma al `SwSpec` interno; nada de "OpenAPI" sale a UI.
  if (isInsoftConfig(data)) {
    const built = parseInsoftConfig(data, config.apiBase ?? '');
    return {
      config: { ...config, ...built.config, specUrl: url, insoftSource: data },
      spec: built.spec,
    };
  }

  const d = data as SwSpec;
  if (d?.paths || d?.openapi) return { config: { ...config, specUrl: url }, spec: d };
  throw new Error(`El JSON de ${url} no es documento InSoft, ni OpenAPI 3, ni documento IS (sin \`paths\` ni \`openapi\`).`);
}

/** Solo la spec, para quien no necesita la config que venga con ella. */
export async function loadSpec(config: SwConfig): Promise<SwSpec> {
  return (await loadViewerDocument(config)).spec;
}
