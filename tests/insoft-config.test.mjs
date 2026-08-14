/**
 * insoft-config.test.mjs — `parseInsoftConfig` y la ruta `?conn=` contra el ISS real.
 *
 * El servidor devuelve `{kind: "config", version, info, viewer, protocol, tags,
 * paths, docs, catalog}`. Lo transformamos en `{config, spec}` para que el resto
 * del visor lo consuma sin saber que el origen no era OpenAPI.
 *
 * El test principal carga el fixture real capturado del staging:
 *   `tests/fixtures/insoft-config.sample.json`
 * para no depender de la red en CI.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SAMPLE = JSON.parse(readFileSync(join(ROOT, 'tests', 'fixtures', 'insoft-config.sample.json'), 'utf8'));

const { parseInsoftConfig, isInsoftConfig } = await import('../dist/cdn/js/insoft-config.js');

test('isInsoftConfig detecta el documento del ISS por kind+paths', () => {
  assert.equal(isInsoftConfig({ kind: 'config', version: 1, paths: {} }), true);
  assert.equal(isInsoftConfig({ openapi: '3.0.3', paths: {} }), false);
  assert.equal(isInsoftConfig(null), false);
  assert.equal(isInsoftConfig({ kind: 'insoft.swagger-viewer', spec: {} }), false);
});

test('parseInsoftConfig arma spec sin el campo openapi (la UI no enseña OpenAPI)', () => {
  const { config, spec } = parseInsoftConfig(SAMPLE, 'https://ayudascp-ia-staging.azurewebsites.net/api');
  assert.equal(spec.openapi, undefined, 'el spec sintetizado no declara OpenAPI');
  assert.equal(spec.info.title, 'API PatyIA');
  assert.equal(spec.info.version, '1.0.0');
  assert.equal(spec.servers[0].url, 'https://ayudascp-ia-staging.azurewebsites.net/api');
});

test('los tags convierten `subgroups` a la extensión x-isa-subgroups', () => {
  const { spec } = parseInsoftConfig(SAMPLE, 'https://h/api');
  const sistema = spec.tags.find((t) => t.name === 'Sistema');
  assert.ok(sistema, 'tag Sistema presente');
  assert.ok(Array.isArray(sistema['x-isa-subgroups']), 'subgroups movido a x-isa-subgroups');
  assert.equal(sistema.subgroups, undefined);
  assert.equal(sistema['x-isa-subgroups'][0].id, 'configuracion');
});

test('las operaciones exponen x-iss-doc-md desde catalog.docs', () => {
  const { spec } = parseInsoftConfig(SAMPLE, 'https://h/api');
  const op = spec.paths['/system/openai']?.get;
  assert.ok(op, 'GET /system/openai debe existir');
  assert.ok(op['x-iss-doc-md'], 'markdown inyectado desde catalog.docs');
  assert.match(op['x-iss-doc-md'], /SYS_VALUES/);
});

test('x-iss-doc-md quita backticks sobre-escapados del catalog IS', () => {
  const raw = structuredClone(SAMPLE);
  raw.catalog.docs.systemOpenai = '## Doc\n\n\\`\\`\\`http\nGET /api/x\n\\`\\`\\`\n';
  const { spec } = parseInsoftConfig(raw, 'https://h/api');
  const md = spec.paths['/system/openai'].get['x-iss-doc-md'];
  assert.match(md, /```http\nGET \/api\/x\n```/);
  assert.equal(md.includes('\\`'), false, 'no debe quedar barra delante del backtick');
});

test('el template "ok" genera respuestas 200 con el envelope InSoft', () => {
  const { spec } = parseInsoftConfig(SAMPLE, 'https://h/api');
  const op = spec.paths['/system/openai'].get;
  const r200 = op.responses['200'];
  assert.ok(r200, 'debe haber respuesta 200');
  assert.match(r200.description, /SYS_VALUES\.openai/);
  assert.ok(r200.content['application/json'].schema, 'schema del envelope');
  assert.ok(r200.content['application/json'].example, 'example resuelto desde catalog.payloads');
});

test('el template "authForbidden" añade 401 y 403 además del 200', () => {
  const { spec } = parseInsoftConfig(SAMPLE, 'https://h/api');
  const put = spec.paths['/system/openai'].put;
  assert.ok(put.security, 'security debe estar declarado');
  assert.deepEqual(put.security, [{ Bearer: [] }]);
  assert.ok(put.responses['200'], '200');
  assert.ok(put.responses['401'], '401');
  assert.ok(put.responses['403'], '403');
});

test('requestBody.bodyKey resuelve el ejemplo desde catalog.requestBodies', () => {
  const { spec } = parseInsoftConfig(SAMPLE, 'https://h/api');
  const put = spec.paths['/system/openai'].put;
  assert.ok(put.requestBody, 'PUT con body');
  assert.ok(put.requestBody.content['application/json'].schema, 'schema inline del body');
});

test('el viewer del ISS se traduce a SwConfig del visor', () => {
  const { config } = parseInsoftConfig(SAMPLE, 'https://h/api');
  assert.equal(config.brand.title, 'ISS PatyIA');
  assert.equal(config.brand.icon, 'mdi:robot-happy-outline');
  assert.equal(config.apiBase, 'https://h/api');
  assert.equal(config.serverSelect, false);
  assert.equal(config.auth.enabled, true);
  assert.equal(config.auth.loginKind, 'portal');
  assert.equal(config.auth.loginPath, '/api/auth/token');
});

test('la spec sintetizada es válida para los módulos puros del visor', async () => {
  const { config, spec } = parseInsoftConfig(SAMPLE, 'https://h/api');
  const { groupOperationsByTag } = await import('../dist/cdn/js/openapi.js');
  const grupos = groupOperationsByTag(spec);
  // El fixture real tiene ~30 paths; el cálculo real varía, pero los grupos
  // deben existir y contener operaciones.
  assert.ok(grupos.length >= 2, `se esperaban ≥2 grupos, hay ${grupos.length}`);
  const totalOps = grupos.reduce((n, g) => n + g.operations.length, 0);
  assert.ok(totalOps > 0, 'al menos una operación agrupada');
  // Cada operación tiene method y path (el visor los necesita sí o sí).
  for (const g of grupos) {
    for (const op of g.operations) {
      assert.ok(op.method, `${op.path} sin method`);
      assert.ok(op.path, 'sin path');
    }
  }
});

test('?conn= contra el ISS real termina con un spec listo (smoke contra la red)', async () => {
  const connMod = await import('../dist/cdn/js/conn.js');
  const cfgMod = await import('../dist/cdn/js/config.js');
  const { encodeConnParam } = connMod;
  const connRaw = encodeConnParam({
    apiBase: 'https://ayudascp-ia-staging.azurewebsites.net/api',
    title: 'ISS PatyIA',
    icon: 'mdi:robot-happy-outline',
    fixedServer: true,
  });

  // Reescribe `location.search` antes de cualquier lectura: `resolveBootConfig`
  // y `loadViewerDocument` leen `location.search` en tiempo de llamada.
  const realFetch = globalThis.fetch;
  const dom = new JSDOM(`<!doctype html><html><body></body></html>`, {
    url: `http://localhost/?conn=${connRaw}`,
  });
  for (const k of ['window', 'document', 'URL', 'URLSearchParams']) globalThis[k] = dom.window[k];
  globalThis.location = dom.window.location;
  globalThis.fetch = realFetch;

  const cfg = cfgMod.resolveBootConfig();
  assert.equal(cfg.apiBase, 'https://ayudascp-ia-staging.azurewebsites.net/api', 'apiBase del conn');

  const { spec, config } = await cfgMod.loadViewerDocument(cfg);
  assert.ok(spec.paths && Object.keys(spec.paths).length > 0, 'spec cargada del ISS real');
  assert.equal(config.brand.title, 'ISS PatyIA');
  assert.equal(spec.openapi, undefined, 'la spec del ISS real no lleva openapi');
});