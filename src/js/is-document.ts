/**
 * is-document.ts — «documento IS»: config del visor + spec en un solo JSON.
 *
 * Es el formato que InSoft publica para que un host arranque el visor con una
 * sola URL: `{ kind, version, viewer, spec }`. Se distingue de un OpenAPI
 * suelto por `kind`, y de una config suelta porque trae `spec` dentro.
 */

export const IS_DOCUMENT_KIND = 'insoft.swagger-viewer';
export const IS_DOCUMENT_VERSION = 1;

/**
 * Claves de arranque que no forman parte de la vista: son URLs de CDN, el
 * spec duplicado y flags del bootstrap. Guardarlas en el documento IS lo
 * ataría al host que lo generó.
 */
const RUNTIME_KEYS = new Set([
  'cssUrl',
  'stackUrl',
  'appUrl',
  'specUrl',
  'url',
  'spec',
  'root',
  'exports',
  'scopes',
]);

export function viewerConfigFromBoot(config: SwConfig = {}): SwConfig {
  const out: SwConfig = {};
  for (const [k, v] of Object.entries(config)) {
    if (RUNTIME_KEYS.has(k) || v === undefined) continue;
    (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

export function buildIsDocument(config: SwConfig, spec: SwSpec): Record<string, unknown> {
  return {
    kind: IS_DOCUMENT_KIND,
    version: IS_DOCUMENT_VERSION,
    viewer: viewerConfigFromBoot(config),
    spec,
  };
}

/** Acepta documento IS, o config con spec embebido. `null` si no es ninguno. */
export function parseIsDocument(doc: unknown): { config: SwConfig; spec: SwSpec } | null {
  if (!doc || typeof doc !== 'object') return null;
  const d = doc as Record<string, unknown>;
  if (d.kind === IS_DOCUMENT_KIND && d.spec && typeof d.spec === 'object') {
    const viewer = (d.viewer && typeof d.viewer === 'object' ? d.viewer : {}) as SwConfig;
    return { config: { ...viewer, spec: d.spec as SwSpec }, spec: d.spec as SwSpec };
  }
  // Config anidada: `{ spec: { kind: …, spec: … } }`. Sin `paths` no es OpenAPI.
  if (d.spec && typeof d.spec === 'object' && !d.paths) return parseIsDocument(d.spec);
  return null;
}

export const isDocumentText = (doc: unknown): string => JSON.stringify(doc, null, 2);
