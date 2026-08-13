/**
 * tryit-body.ts — cuerpo JSON editable de «Probar».
 *
 * El texto inicial sale, por orden, del ejemplo de la spec, de la extensión
 * `x-iss-request-body` o de un esqueleto derivado del `schema`. Un editor en
 * blanco obliga a leer el schema entero antes de poder disparar la petición.
 */

import { extractJsonExample, jsonPretty } from './openapi.js';

/* QUERY lleva cuerpo por definición: es su razón de ser frente a GET —filtrar con un JSON que no
   cabe en la query string—, así que «Probar» tiene que ofrecer el editor. */
export const BODY_HTTP_METHODS = new Set(['post', 'put', 'patch', 'query']);
export const EXT_REQUEST_BODY = 'x-iss-request-body';
export const EXT_REQUEST_BODY_EXAMPLES = 'x-iss-request-body-examples';

export interface SwBodyEjemplo {
  id: string;
  label: string;
  icon?: string;
  example: unknown;
}

export const opUsesRequestBody = (method: unknown): boolean =>
  BODY_HTTP_METHODS.has(String(method ?? '').toLowerCase());

export const shouldShowTryItBody = (op: SwOp | undefined): boolean => opUsesRequestBody(op?.method);

const jsonMedia = (op: SwOp | undefined): SwMediaType | undefined =>
  op?.requestBody?.content?.['application/json'];

/**
 * Esqueleto a partir del `schema`: un objeto con las claves declaradas y un
 * valor representativo por tipo. Solo baja dos niveles porque más profundidad
 * produce un muro de JSON que nadie edita, y el schema completo ya está en la
 * pestaña de ejemplos.
 */
function skeletonFromSchema(schema: SwSchema | undefined, profundidad = 0): unknown {
  if (!schema || profundidad > 2) return null;
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;

  switch (schema.type) {
    case 'object': {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(schema.properties ?? {})) {
        out[k] = skeletonFromSchema(v, profundidad + 1);
      }
      return out;
    }
    case 'array':
      return [skeletonFromSchema(schema.items, profundidad + 1)];
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'string':
      return Array.isArray(schema.enum) && schema.enum.length ? String(schema.enum[0]) : '';
    default:
      return null;
  }
}

export function resolveTryItBodyExample(op: SwOp | undefined): unknown {
  const fromSpec = extractJsonExample(jsonMedia(op));
  if (fromSpec !== undefined) return fromSpec;

  const ext = (op?.[EXT_REQUEST_BODY] as Record<string, unknown> | undefined)?.example;
  if (ext !== undefined) return ext;

  const schema = jsonMedia(op)?.schema;
  if (schema) return skeletonFromSchema(schema);
  return undefined;
}

/** Ejemplos con nombre: `x-iss-request-body-examples`, o los `examples` de la spec. */
export function resolveTryItBodyExamples(op: SwOp | undefined): SwBodyEjemplo[] {
  const ext = op?.[EXT_REQUEST_BODY_EXAMPLES];
  if (Array.isArray(ext) && ext.length) {
    return (ext as SwBodyEjemplo[]).filter((i) => i && typeof i === 'object' && i.example !== undefined);
  }

  const examples = jsonMedia(op)?.examples;
  if (examples && typeof examples === 'object') {
    return Object.entries(examples)
      .filter(([, v]) => v && v.value !== undefined)
      .map(([id, v]) => ({ id, label: v.summary || id, example: v.value }));
  }
  return [];
}

export const formatBodyExample = (example: unknown): string =>
  example !== undefined ? jsonPretty(example) : '{\n  \n}';

export const defaultTryItBodyText = (op: SwOp | undefined): string =>
  formatBodyExample(resolveTryItBodyExample(op));

/** Valida el JSON del editor. `null` = correcto. */
export function validateBodyJson(text: string): string | null {
  const s = String(text ?? '').trim();
  if (!s) return null;
  try {
    JSON.parse(s);
    return null;
  } catch (e) {
    return `JSON inválido: ${(e as Error)?.message ?? e}`;
  }
}
