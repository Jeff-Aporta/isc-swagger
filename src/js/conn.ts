/**
 * conn.ts — autoconexión ISS vía `?conn=<base64url>`.
 *
 * Un host (PatyIA, Clientes, demos) que quiere abrir el visor ya conectado
 * incrusta en la URL un JSON mínimo con `apiBase`, las rutas del sistema y la
 * marca. El visor lo decodifica, fija `config.apiBase` y pide la spec al host
 * desde el primer pintado.
 *
 *   ?conn=eyJhcGlCYXNlIjoi…IsInRpdGxlIjoiSVNTIFBhdHlJQSJ9
 *
 * Decodificado (referencia, no contrato):
 *   {
 *     apiBase:    "https://host/api",
 *     auto:       true,             // conectar al cargar (default)
 *     embed:      true,             // modo iframe
 *     fixedServer: true,            // no mostrar selector de servidor
 *     paths: {
 *       config:    "/system/swagger/config.json",
 *       meta:      "/system/swagger/meta.json",
 *       paths:     "/system/swagger/paths.json",
 *       docsConfig:"/system/swagger/docs-config.json",
 *       info:      "/info"
 *     },
 *     title:      "ISS PatyIA",
 *     icon:       "mdi:robot-happy-outline"
 *   }
 *
 * Precedencia: `?conn=` gana sobre `<script id="sw-config">` y sobre
 * `window.__SWAGGER_CONFIG__`. Un enlace compartido debe conectar al host sin
 * importar el resto de configuración; lo demás solo rellena lo que `conn` no
 * dice.
 */

/** Rutas por defecto que el ISS expone para swagger, relativas a `apiBase`. */
export const DEFAULT_CONN_PATHS = {
  config: '/system/swagger/config.json',
  meta: '/system/swagger/meta.json',
  paths: '/system/swagger/paths.json',
  docsConfig: '/system/swagger/docs-config.json',
  info: '/info',
} as const;

export type SwConnPaths = Partial<typeof DEFAULT_CONN_PATHS> & Record<string, string>;

export interface SwConn {
  apiBase?: string;
  auto?: boolean;
  embed?: boolean;
  fixedServer?: boolean;
  paths?: SwConnPaths;
  title?: string;
  icon?: string;
  [k: string]: unknown;
}

/** Decodifica base64url tolerante a padding. Devuelve `null` si el JSON falla. */
export function parseConnParam(raw: unknown): SwConn | null {
  const s = String(raw ?? '').trim();
  if (!s) return null;
  let pad = s.replace(/-/g, '+').replace(/_/g, '/');
  while (pad.length % 4) pad += '=';
  let bin: string;
  try {
    bin = atob(pad);
  } catch {
    return null;
  }
  try {
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const obj = JSON.parse(json);
    return obj && typeof obj === 'object' ? (obj as SwConn) : null;
  } catch {
    return null;
  }
}

/** Codifica un objeto a base64url sin padding — para construir `?conn=`. */
export function encodeConnParam(obj: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(obj ?? {}));
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Une `apiBase` con un segmento relativo (con o sin `/` inicial). */
export function joinConnUrl(apiBase: string, segment: string | undefined): string {
  const base = String(apiBase ?? '').replace(/\/+$/, '');
  if (!base || !segment) return '';
  const path = segment.startsWith('/') ? segment : `/${segment}`;
  return `${base}${path}`;
}

/**
 * Resuelve la config del visor a partir de `?conn=<base64url>`.
 *
 * Devuelve `null` si la URL no trae `?conn` o si lo trae corrupto: en ese
 * caso el visor sigue con `window.__SWAGGER_CONFIG__` y el `<script>`.
 */
export function resolveConnConfig(search: string | URLSearchParams | null | undefined): SwConnResuelto | null {
  const sp =
    search instanceof URLSearchParams
      ? search
      : typeof search === 'string'
        ? new URLSearchParams(search)
        : typeof location !== 'undefined'
          ? new URLSearchParams(location.search)
          : null;
  const raw = sp?.get('conn')?.trim();
  if (!raw) return null;
  return normalizeConn(parseConnParam(raw));
}

/** Forma ya resuelta del conn: lo que el visor consume. */
export interface SwConnResuelto {
  apiBase: string;
  paths: SwConnPaths;
  fixedServer: boolean;
  brand: { title?: string; icon?: string };
}

/**
 * Normaliza un `SwConn` ya deserializado.
 *
 * Existe aparte de `resolveConnConfig` porque el conn puede llegar por dos vías y solo una
 * pasa por la URL: `?conn=<base64url>` cuando el visor vive en su propia página, y el objeto
 * plano que le pone el anfitrión a `<sw-app>` cuando el visor se incrusta como componente. La
 * segunda no tiene por qué codificarse en base64 ni ensuciar la barra de direcciones.
 */
export function normalizeConn(conn: SwConn | null | undefined): SwConnResuelto | null {
  if (!conn?.apiBase) return null;
  return {
    apiBase: String(conn.apiBase).replace(/\/+$/, ''),
    paths: { ...DEFAULT_CONN_PATHS, ...(conn.paths ?? {}) },
    fixedServer: conn.fixedServer === true,
    brand: {
      title: conn.title ? String(conn.title) : undefined,
      icon: conn.icon ? String(conn.icon) : undefined,
    },
  };
}