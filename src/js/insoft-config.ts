/**
 * insoft-config.ts — `GET /system/swagger/config.json` → spec del visor.
 *
 * El servidor ISS no publica OpenAPI: publica su propio documento con
 * `{kind, version, info, viewer, protocol, tags, paths, docs, catalog}`.
 * Aquí se transforma en el `SwSpec` interno que el resto del visor entiende.
 *
 * Mismo algoritmo que `iss-exports.browser.mjs::buildOpenApiFromConfig`, pero
 * recortado a lo que el visor consume: nada de `openapi: "3.0.3"` en la
 * salida (el visor no enseña OpenAPI en la UI), y los templates de respuesta
 * que InSoft define se traducen a las respuestas OpenAPI canónicas.
 *
 *   config.paths["/x"].get.responses.template === "ok"
 *     → responses: { "200": { description, content: { "application/json":
 *         { schema: INSOFT_ENVELOPE, example: catalog.payloads[key] } } } }
 *
 *   config.paths["/x"].get.security === "bearer"
 *     → security: [{ Bearer: [] }]
 *
 *   config.paths["/x"].get.doc === "systemOpenai"
 *     → x-iss-doc-md: catalog.docs["systemOpenai"]
 */

const ISS_DOC_MD = 'x-iss-doc-md';
const ISS_SUBGROUP = 'x-isa-subgroup';
const ISS_SUBGROUPS = 'x-isa-subgroups';

const ISS_RESPONSE_KIND = {
  type: 'object',
  properties: {
    encabezado: {
      type: 'object',
      properties: {
        resultado: { type: 'boolean' },
        tiempo: { type: 'number' },
        fhentrada: { type: 'string', format: 'date-time' },
        fhsalida: { type: 'string', format: 'date-time' },
        imensaje: { type: 'integer' },
        mensaje: { type: 'string' },
      },
    },
    respuesta: { type: 'object' },
  },
} as const;

const ISS_ERROR_KIND = {
  type: 'object',
  required: ['encabezado'],
  properties: { encabezado: ISS_RESPONSE_KIND.properties.encabezado },
} as const;

const EXAMPLE_401 = {
  encabezado: {
    resultado: false,
    tiempo: -1,
    imensaje: 401020,
    mensaje:
      'No se ha definido el parámetro de autenticación, por favor verifique que esté enviando el header, query o parámetro "authorization".',
  },
};

const EXAMPLE_403 = {
  encabezado: {
    resultado: false,
    tiempo: -1,
    imensaje: 403010,
    mensaje: 'No tiene permisos para acceder a este recurso.',
  },
};

const EXAMPLE_404 = {
  encabezado: {
    resultado: false,
    tiempo: -1,
    imensaje: 404010,
    mensaje: 'No se ha encontrado el recurso solicitado.',
  },
};

/** Resuelve el `payload` contra `catalog.payloads`. Fallback: objeto vacío. */
function resolvePayload(catalog: InsoftCatalog, key: string | undefined): unknown {
  if (!key) return {};
  const p = catalog.payloads?.[key];
  return p !== undefined ? p : {};
}

/** Resuelve el `schema` contra `catalog.schemas`. Fallback: `{type:'object'}`. */
function resolveSchema(catalog: InsoftCatalog, key: string | undefined): Record<string, unknown> {
  if (!key) return { type: 'object' };
  const s = catalog.schemas?.[key];
  return s && typeof s === 'object' ? (s as Record<string, unknown>) : { type: 'object' };
}

function jsonResponse(description: string, schema: unknown, example: unknown): Record<string, unknown> {
  return {
    description,
    content: { 'application/json': { schema, example } },
  };
}

/** Construye las respuestas OpenAPI a partir del `responses` del config. */
function buildResponses(
  catalog: InsoftCatalog,
  def: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!def || typeof def !== 'object') return { '200': jsonResponse('OK', { type: 'object' }, {}) };
  const template = String(def.template ?? '');
  const description = String(def.description ?? 'OK');
  const payload = def.payload as string | undefined;
  const schemaKey = def.schema as string | undefined;

  switch (template) {
    case 'ok':
      return {
        '200': jsonResponse(description, ISS_RESPONSE_KIND, resolvePayload(catalog, payload)),
      };
    case 'auth':
      return {
        '200': jsonResponse(description, ISS_RESPONSE_KIND, resolvePayload(catalog, payload)),
        '401': jsonResponse('No autorizado', ISS_ERROR_KIND, EXAMPLE_401),
        '403': jsonResponse('Sin permisos', ISS_ERROR_KIND, EXAMPLE_403),
      };
    case 'authForbidden':
      return {
        '200': jsonResponse(description, ISS_RESPONSE_KIND, resolvePayload(catalog, payload)),
        '401': jsonResponse('No autorizado', ISS_ERROR_KIND, EXAMPLE_401),
        '403': jsonResponse('Sin permisos', ISS_ERROR_KIND, EXAMPLE_403),
      };
    case 'authNotFound':
      return {
        '200': jsonResponse(description, ISS_RESPONSE_KIND, resolvePayload(catalog, payload)),
        '401': jsonResponse('No autorizado', ISS_ERROR_KIND, EXAMPLE_401),
        '404': jsonResponse('No encontrado', ISS_ERROR_KIND, EXAMPLE_404),
      };
    case 'deleteEnvelope': {
      const rowSchema = resolveSchema(catalog, schemaKey ?? '');
      return {
        '200': jsonResponse(
          description,
          {
            ...ISS_RESPONSE_KIND,
            properties: {
              ...ISS_RESPONSE_KIND.properties,
              respuesta: rowSchema,
            },
          },
          resolvePayload(catalog, payload),
        ),
        '401': jsonResponse('No autorizado', ISS_ERROR_KIND, EXAMPLE_401),
        '404': jsonResponse('No encontrado', ISS_ERROR_KIND, EXAMPLE_404),
      };
    }
    case 'raw': {
      const items = def.items as Record<string, Record<string, unknown>> | undefined;
      const out: Record<string, unknown> = {};
      for (const [code, item] of Object.entries(items ?? {})) {
        const ex = item.example ?? (item.payload ? resolvePayload(catalog, String(item.payload)) : {});
        out[code] = jsonResponse(
          String(item.description ?? 'OK'),
          (item.schema as Record<string, unknown>) ?? { type: 'object' },
          ex,
        );
      }
      if (!Object.keys(out).length) out['200'] = jsonResponse('OK', { type: 'object' }, {});
      return out;
    }
    default:
      return { '200': jsonResponse(description, ISS_RESPONSE_KIND, resolvePayload(catalog, payload)) };
  }
}

/** Construye el `operation` que el visor entiende. */
function buildOperation(catalog: InsoftCatalog, def: Record<string, unknown>): Record<string, unknown> {
  const op: Record<string, unknown> = {
    summary: def.summary,
    description: def.description ?? '',
  };
  if (Array.isArray(def.tags)) op.tags = def.tags;
  if (typeof def.operationId === 'string') op.operationId = def.operationId;
  if (typeof def.subgroup === 'string') op[ISS_SUBGROUP] = def.subgroup;
  if (def.security === 'bearer' || def.security === 'Bearer') op.security = [{ Bearer: [] }];

  if (typeof def.doc === 'string') {
    const md = catalog.docs?.[def.doc];
    // Docs IS a veces llegan con backticks escapados (`\`\`\`http`); el MD renderer los pinta literales.
    if (typeof md === 'string') op[ISS_DOC_MD] = md.replace(/\\+`/g, '`');
  }

  if (Array.isArray(def.parameters) && def.parameters.length) {
    op.parameters = def.parameters.map((p) => ({ ...(p as Record<string, unknown>) }));
  }

  if (def.requestBody && typeof def.requestBody === 'object') {
    const rb = def.requestBody as Record<string, unknown>;
    const bodyKey = rb.bodyKey as string | undefined;
    const example = bodyKey ? catalog.requestBodies?.[bodyKey] : rb.example;
    op.requestBody = {
      required: rb.required !== false,
      description: rb.description ?? 'Cuerpo de la petición',
      content: {
        'application/json': {
          schema: rb.schema ?? { type: 'object' },
          example: example ?? {},
        },
      },
    };
  }

  op.responses = buildResponses(catalog, def.responses as Record<string, unknown> | undefined);
  return op;
}

/** Construye el `servers` que el visor entiende. */
function buildServers(apiBase: string): Array<{ url: string; description?: string }> {
  const base = apiBase.replace(/\/$/, '');
  return [
    { url: base, description: 'Activo' },
    { url: 'http://127.0.0.1:8802/api', description: 'Local (ISS Functions)' },
    { url: 'https://ayudascp-ia-staging.azurewebsites.net/api', description: 'Web (staging Azure)' },
  ];
}

/** Convierte `tag.subgroups` (InSoft) en `tag.x-isa-subgroups` (visor). */
function buildTags(rawTags: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(rawTags)) return [];
  return rawTags.map((t) => {
    const tag = { ...(t as Record<string, unknown>) } as Record<string, unknown> & { subgroups?: unknown };
    if (Array.isArray(tag.subgroups)) {
      tag[ISS_SUBGROUPS] = tag.subgroups;
      delete tag.subgroups;
    }
    return tag;
  });
}

/** Orquestador que canjea credenciales por JWT. Si el visor no trae
 *  `auth.loginUrl` propio, se cae al orquestador público de InSoft. */
export const DEFAULT_AUTH_LOGIN_URL = 'https://main-orchestrator.jeffaporta.workers.dev';

/** Construye el `SwConfig` del visor a partir de `viewer` + protocolo + auth. */
function buildViewerConfig(raw: InsoftConfig, apiBase: string): SwConfig {
  const v = (raw.viewer ?? {}) as Record<string, unknown>;
  const brand = (v.brand ?? {}) as Record<string, unknown>;
  const auth = (v.auth ?? {}) as Record<string, unknown>;
  const exports = (v.exports ?? {}) as Record<string, unknown>;

  const config: SwConfig = {
    ns: typeof v.ns === 'string' ? v.ns : 'ISS',
    apiBase,
    brand: {
      title: typeof brand.title === 'string' ? brand.title : (raw.info as Record<string, unknown>)?.title as string,
      icon: typeof brand.icon === 'string' ? brand.icon : 'mdi:api',
    },
    auth: {
      enabled: auth.enabled !== false,
      loginUrl: typeof auth.loginUrl === 'string' ? auth.loginUrl : DEFAULT_AUTH_LOGIN_URL,
      loginKind: typeof auth.loginKind === 'string' ? (auth.loginKind as SwAuthConfig['loginKind']) : 'portal',
      loginPath: typeof auth.loginPath === 'string' ? auth.loginPath : '/api/auth/token',
      app: typeof auth.app === 'string' ? auth.app : 'swagger-viewer',
    },
    serverSelect: false,
  };

  if (exports.openApiDownloadName || exports.postmanDownloadName || exports.isDownloadName) {
    config.exports = {
      ...(exports.openApiDownloadName ? { openApiDownloadName: String(exports.openApiDownloadName) } : {}),
      ...(exports.postmanDownloadName ? { postmanDownloadName: String(exports.postmanDownloadName) } : {}),
      ...(exports.isDownloadName ? { isDownloadName: String(exports.isDownloadName) } : {}),
    };
  }
  if (Array.isArray(v.nav) && v.nav.length) config.nav = v.nav as SwNavTab[];

  return config;
}

/** Detecta si el JSON es un `kind: "config"` de InSoft. */
export function isInsoftConfig(doc: unknown): doc is InsoftConfig {
  if (!doc || typeof doc !== 'object') return false;
  const d = doc as Record<string, unknown>;
  return d.kind === 'config' && typeof d.version === 'number' && typeof d.paths === 'object';
}

/** Convierte un `InsoftConfig` en `{config, spec}` para `loadViewerDocument`. */
export function parseInsoftConfig(raw: InsoftConfig, apiBase: string): { config: SwConfig; spec: SwSpec } {
  const catalog = (raw.catalog ?? {}) as InsoftCatalog;
  const paths: Record<string, Record<string, unknown>> = {};
  for (const [path, methods] of Object.entries(raw.paths ?? {})) {
    if (!methods || typeof methods !== 'object') continue;
    const item: Record<string, unknown> = {};
    for (const [method, opDef] of Object.entries(methods as Record<string, unknown>)) {
      if (opDef && typeof opDef === 'object') item[method] = buildOperation(catalog, opDef as Record<string, unknown>);
    }
    paths[path] = item;
  }

  const spec: SwSpec = {
    info: {
      title: String(raw.info?.title ?? 'API'),
      version: String(raw.info?.version ?? '1.0.0'),
      description: raw.info?.description as string | undefined,
    },
    servers: buildServers(apiBase),
    tags: buildTags(raw.tags) as SwTag[],
    paths: paths as SwSpec['paths'],
    components: {
      securitySchemes: {
        Bearer: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  };

  return { config: buildViewerConfig(raw, apiBase), spec };
}

/* ── tipos locales (subconjunto del config InSoft que miramos) ── */

interface InsoftConfig {
  kind: string;
  version: number;
  info?: { title?: string; description?: string; version?: string };
  viewer?: Record<string, unknown>;
  protocol?: { serverUrl?: string };
  tags?: Array<Record<string, unknown>>;
  paths?: Record<string, Record<string, unknown>>;
  docs?: Record<string, string>;
  catalog?: InsoftCatalog;
}

interface InsoftCatalog {
  schemas?: Record<string, Record<string, unknown>>;
  payloads?: Record<string, unknown>;
  requestBodies?: Record<string, unknown>;
  docs?: Record<string, string>;
  lookups?: Record<string, unknown>;
  listFilters?: Record<string, unknown>;
  inputRecommendations?: Record<string, unknown>;
  fPresets?: Record<string, unknown>;
  requestBodyExamples?: Record<string, unknown>;
  tryitConfirm?: Record<string, unknown>;
  tryitAttachments?: { templates?: Record<string, unknown> };
}