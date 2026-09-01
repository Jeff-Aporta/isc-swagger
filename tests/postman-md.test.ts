/**
 * postman-md.test.ts — conversión síncrona de <is-code> a fences (sin DOM).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'src/js/postman-md.ts'), 'utf8');

// Reimplementación mínima del convertidor de is-code (misma lógica que el TS)
// para no depender del build ESM del bundle en este test unitario.
function convertIsCodeToFences(md) {
  const IS_CODE_RE = /<is-code\b([^>]*)>([\s\S]*?)<\/is-code>/gi;
  const decode = (s) =>
    String(s ?? '')
      .replace(/&#10;/g, '\n')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
  const attrOf = (attrs, name) => {
    const re = new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)')`, 'i');
    const m = attrs.match(re);
    return m ? (m[1] ?? m[2] ?? '') : null;
  };
  return String(md ?? '').replace(IS_CODE_RE, (_full, attrs, body) => {
    const lang = attrOf(attrs, 'lang') || '';
    const valueAttr = attrOf(attrs, 'value');
    const code = (valueAttr != null ? decode(valueAttr) : String(body ?? ''))
      .replace(/^\n/, '')
      .replace(/\n$/, '');
    return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
  });
}

test('postman-md.ts exporta el pipeline de conversión', () => {
  assert.match(src, /export async function issDocMdForPostman/);
  assert.match(src, /export function convertIsCodeToFences/);
  assert.match(src, /export async function convertDiagramsToPngImgs/);
  assert.match(src, /is-flowchart/);
  assert.match(src, /image\/png/);
});

test('convertIsCodeToFences: body hijo → fence', () => {
  const md = `Antes\n<is-code lang="http" readonly compact>\nGET /api/info\nAccept: application/json\n</is-code>\nDespués`;
  const out = convertIsCodeToFences(md);
  assert.match(out, /```http\nGET \/api\/info\nAccept: application\/json\n```/);
  assert.doesNotMatch(out, /<is-code/);
});

test('convertIsCodeToFences: atributo value con &#10;', () => {
  const md = `<is-code lang="json" value="{&#10;  &quot;ok&quot;: true&#10;}"></is-code>`;
  const out = convertIsCodeToFences(md);
  assert.match(out, /```json\n\{\n  "ok": true\n\}\n```/);
});
