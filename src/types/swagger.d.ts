/**
 * swagger.d.ts — tipos ambiente del visor.
 *
 * Declaración global (sin `import`/`export` en el archivo) para que todo
 * `src/**` los vea sin ceremonia, igual que `types/tk.d.ts` en is-tkts.
 */

/* ── OpenAPI (subconjunto que el visor realmente lee) ───────── */

/** `query` incluido: es método HTTP estándar (RFC 9110 + draft QUERY) y el API lo usa para
 *  filtrar con cuerpo JSON donde una query string no da abasto. */
type SwMetodo = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'query' | 'options' | 'head';

interface SwSchema {
  type?: string;
  format?: string;
  enum?: unknown[];
  items?: SwSchema;
  properties?: Record<string, SwSchema>;
  required?: string[];
  example?: unknown;
  description?: string;
  default?: unknown;
  [k: string]: unknown;
}

interface SwMediaType {
  schema?: SwSchema;
  example?: unknown;
  examples?: Record<string, { value?: unknown; summary?: string }>;
}

interface SwParam {
  name?: string;
  in?: 'path' | 'query' | 'header' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  example?: unknown;
  schema?: SwSchema;
  $ref?: string;
  [k: string]: unknown;
}

interface SwRequestBody {
  description?: string;
  required?: boolean;
  content?: Record<string, SwMediaType>;
}

interface SwResponse {
  description?: string;
  content?: Record<string, SwMediaType>;
}

interface SwOperation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  deprecated?: boolean;
  parameters?: SwParam[];
  requestBody?: SwRequestBody;
  responses?: Record<string, SwResponse>;
  security?: unknown;
  [k: string]: unknown;
}

/** Operación ya aplanada: el visor siempre trabaja con `path` y `method`. */
interface SwOp extends SwOperation {
  path: string;
  method: SwMetodo;
  operationId: string;
}

interface SwTag {
  name: string;
  description?: string;
  /** `x-isa-subgroups` — subcarpetas declaradas por el tag. */
  'x-isa-subgroups'?: SwSubgrupoDef[];
  [k: string]: unknown;
}

interface SwServer {
  url: string;
  description?: string;
  variables?: Record<string, { default?: string; enum?: string[] }>;
}

interface SwSpec {
  openapi?: string;
  info?: { title?: string; version?: string; description?: string };
  servers?: SwServer[];
  tags?: SwTag[];
  paths?: Record<string, Record<string, SwOperation>>;
  components?: {
    parameters?: Record<string, SwParam>;
    schemas?: Record<string, SwSchema>;
    securitySchemes?: Record<string, { type?: string; scheme?: string; bearerFormat?: string }>;
  };
  [k: string]: unknown;
}

/* ── Agrupación ─────────────────────────────────────────────── */

interface SwSubgrupoDef {
  id: string;
  name?: string;
  icon?: string;
}

interface SwSubgrupo extends SwSubgrupoDef {
  operations: SwOp[];
}

interface SwGrupo {
  name: string;
  description: string;
  meta: SwTag | Record<string, never>;
  operations: SwOp[];
  /** Vacío cuando el tag no declara subgrupos con nombre. */
  subgroups: SwSubgrupo[];
}

/* ── Configuración del visor ────────────────────────────────── */

interface SwAuthConfig {
  enabled?: boolean;
  /** Base del main-orchestrator / system-login. */
  loginUrl?: string;
  loginPath?: string;
  loginKind?: 'portal' | 'lab' | string;
  app?: string;
}

interface SwBrand {
  title?: string;
  icon?: string;
  subtitle?: string;
}

interface SwNavTab {
  id: string;
  label: string;
  icon?: string;
  /** Tags que quedan visibles al activar la pestaña. Vacío = todos. */
  tags?: string[];
  /** Solo visible con sesión iniciada. */
  requiresSession?: boolean;
}

interface SwConfig {
  ns?: string;
  /** Base `/api` del host con el que se prueba (Try it out). */
  apiBase?: string;
  specUrl?: string;
  spec?: SwSpec;
  brand?: SwBrand;
  auth?: SwAuthConfig;
  nav?: SwNavTab[];
  /** `false` oculta el selector de servidor. */
  serverSelect?: boolean;
  exports?: Record<string, string>;
  /** operationId con el que abre el driver de vistas cuando la URL no trae `op` en `?s=`. */
  defaultOp?: string;
  [k: string]: unknown;
}

/* ── Sesión ─────────────────────────────────────────────────── */

interface SwSesion {
  token: string;
  username?: string;
  nombre?: string;
  expiresAt?: string;
  [k: string]: unknown;
}

/* ── Resultado de Try it out ────────────────────────────────── */

interface SwResultado {
  status: number;
  statusText: string;
  elapsed: number;
  body: string;
  ok: boolean;
}

/* ── Plantillas (`_shared.ts`) ──────────────────────────────── */

type SwAtributos = Record<string, unknown>;
type SwHijos = Array<Node | string | null | undefined> | Node | string | null | undefined;
interface SwHtmlCrudo {
  readonly __crudo: unique symbol;
}

/**
 * Caché de hojas construidas que `js/hojas.js` monta en `<head>`. Lo comparten
 * los shadow roots del kit `is-*` (vía el parche de `ShadowRoot.prototype.
 * prepend`) y el `adoptCss` de `_shared.ts`: una sola descarga por hoja.
 */
interface SwCacheHojas {
  hojas: Map<string, CSSStyleSheet>;
  cargas: Map<string, Promise<CSSStyleSheet | null>>;
}

/* ── Globales inyectadas por el host ────────────────────────── */

interface Window {
  __SWAGGER_CONFIG__?: SwConfig;
  __swHojas?: SwCacheHojas;
  IsToast?: {
    host(): { create(msg: string, opts?: Record<string, unknown>): Promise<unknown> } | null;
    error(msg: string, duration?: number): unknown;
    success(msg: string, duration?: number): unknown;
  };
}
