/**
 * export.ts — descargas del visor: documento JSON, Postman y documento IS.
 *
 * Todo se genera en el navegador desde la spec ya cargada. No hay endpoint de
 * exportación: el visor es 100 % front y una descarga que dependiera del host
 * dejaría de funcionar al abrir el HTML suelto.
 */

import { listOperations, resolveServerUrl, jsonPretty } from './openapi.js';
import { buildIsDocument } from './is-document.js';

export interface SwFormatoExport {
  id: string;
  label: string;
  icon: string;
  filename: string;
  build(): string;
}

const slug = (s: unknown): string =>
  String(s ?? 'documento')
    .toLowerCase()
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-|-$/g, '') || 'documento';

/* ── Postman ────────────────────────────────────────────────── */

/**
 * OpenAPI 3 → Postman Collection v2.1.
 *
 * Los `{param}` de OpenAPI se traducen a `:param` (la sintaxis de Postman) y
 * cada segmento va también en `path[]`, que es lo que Postman usa realmente
 * para construir la petición; `raw` solo se muestra en la barra de la app.
 */
export function toPostmanCollection(spec: SwSpec, nombre?: string): Record<string, unknown> {
  const base = resolveServerUrl(spec) || '{{baseUrl}}';
  const porTag = new Map<string, Record<string, unknown>[]>();

  for (const op of listOperations(spec)) {
    const tag = op.tags?.[0] ?? 'General';
    if (!porTag.has(tag)) porTag.set(tag, []);

    const query = (op.parameters ?? [])
      .filter((p) => p.in === 'query')
      .map((p) => ({
        key: p.name,
        value: p.example != null ? String(p.example) : '',
        description: p.description ?? '',
        disabled: !p.required,
      }));

    const headers = (op.parameters ?? [])
      .filter((p) => p.in === 'header')
      .map((p) => ({ key: p.name, value: p.example != null ? String(p.example) : '', description: p.description ?? '' }));

    const jsonBody = op.requestBody?.content?.['application/json'];
    const ejemplo = jsonBody?.example ?? jsonBody?.schema?.example;
    if (jsonBody) headers.push({ key: 'Content-Type', value: 'application/json', description: '' });

    const segmentos = op.path.split('/').filter(Boolean).map((s) => s.replace(/^\{(.+)\}$/, ':$1'));

    porTag.get(tag)!.push({
      name: op.summary || `${op.method.toUpperCase()} ${op.path}`,
      request: {
        method: op.method.toUpperCase(),
        header: headers,
        url: {
          raw: `${base}${op.path.replace(/\{(\w+)\}/g, ':$1')}`,
          host: [base],
          path: segmentos,
          query,
        },
        description: op.description ?? op.summary ?? '',
        ...(jsonBody
          ? { body: { mode: 'raw', raw: jsonPretty(ejemplo ?? {}), options: { raw: { language: 'json' } } } }
          : {}),
      },
      response: [],
    });
  }

  return {
    info: {
      name: nombre || spec.info?.title || 'API',
      _postman_id: `is-swagger-${Date.now()}`,
      description: spec.info?.description ?? '',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [...porTag.entries()].map(([name, item]) => ({ name, item })),
    variable: [{ key: 'baseUrl', value: base }],
  };
}

/* ── Formatos ofrecidos ─────────────────────────────────────── */

export function buildExportFormats(spec: SwSpec | null, config: SwConfig): SwFormatoExport[] {
  if (!spec) return [];
  const nombre = slug(spec.info?.title);
  return [
    {
      id: 'doc',
      label: 'Documento (JSON)',
      icon: 'mdi:code-json',
      filename: `${nombre}.doc.json`,
      build: () => jsonPretty(spec),
    },
    {
      id: 'postman',
      label: 'Colección Postman',
      icon: 'mdi:send-outline',
      filename: `${nombre}.postman_collection.json`,
      build: () => jsonPretty(toPostmanCollection(spec)),
    },
    {
      id: 'is',
      label: 'Documento IS',
      icon: 'mdi:file-document-outline',
      filename: `${nombre}.is.json`,
      build: () => jsonPretty(buildIsDocument(config, spec)),
    },
  ];
}

/* ── Descarga ───────────────────────────────────────────────── */

export function descargarTexto(filename: string, contenido: string, mime = 'application/json'): void {
  const blob = new Blob([contenido], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Sin revocar, el blob queda retenido hasta recargar la página.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copiarAlPortapapeles(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}
