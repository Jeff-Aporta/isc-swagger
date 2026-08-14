/**
 * render.test.mjs — humo de render sobre el build.
 *
 * Monta los componentes en jsdom con los `is-*` **sin registrar** (igual que
 * un navegador antes de que llegue el CDN) y comprueba que el shadow se llena.
 * Caza el fallo más silencioso de este stack: un componente que no hace
 * upgrade o que revienta al pintar deja el tag vacío, sin error en consola.
 *
 * No comprueba estética: para eso está el sitio documental de `docs/`.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

for (const k of ['window', 'document', 'HTMLElement', 'customElements', 'CustomEvent', 'Node', 'Event', 'Blob']) {
  globalThis[k] = dom.window[k];
}
globalThis.performance = dom.window.performance;

const {
  SwMethod: _m,
} = await import('../dist/cdn/components/sw/sw-method.js');
await import('../dist/cdn/components/sw/sw-path.js');
await import('../dist/cdn/components/sw/sw-json.js');
await import('../dist/cdn/components/sw/sw-doc.js');
await import('../dist/cdn/components/sw/sw-params.js');
await import('../dist/cdn/components/sw/sw-responses.js');
await import('../dist/cdn/components/sw/sw-operation.js');
await import('../dist/cdn/components/sw/sw-tag-group.js');
await import('../dist/cdn/components/sw/sw-info.js');

/** Monta un componente con props y devuelve su shadowRoot ya pintado. */
function montar(tag, props) {
  const node = dom.window.document.createElement(tag);
  dom.window.document.body.append(node);
  node.props = props;
  return node.shadowRoot;
}

const op = (over = {}) => ({
  path: '/tercero/{id}',
  method: 'get',
  operationId: 'obtener',
  summary: 'Obtener tercero',
  parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
  responses: { 200: { description: 'OK.' }, 404: { description: 'No existe.' } },
  ...over,
});

test('sw-method pinta el verbo en mayúsculas', () => {
  const root = montar('sw-method', { method: 'delete' });
  assert.match(root.textContent, /DELETE/);
});

test('sw-path marca los {parámetros} en un span aparte', () => {
  const root = montar('sw-path', { path: '/tercero/{id}' });
  assert.equal(root.querySelector('.param')?.textContent, '{id}');
});

test('sw-json monta is-code sin botón de copiar interno', () => {
  const root = montar('sw-json', { value: '{\n  "a": 1,\n  "b": "x"\n}', lang: 'json' });
  const code = root.querySelector('is-code');
  assert.ok(code, 'falta is-code');
  assert.equal(code.getAttribute('lang'), 'json');
  assert.equal(code.getAttribute('readonly'), '');
  assert.equal(root.querySelector('is-copy-button'), null);
  assert.equal(code.value ?? code.getAttribute('value'), '{\n  "a": 1,\n  "b": "x"\n}');
});

test('sw-json no ejecuta HTML que venga en el cuerpo', () => {
  const root = montar('sw-json', { value: '<img src=x onerror=alert(1)>', lang: 'plaintext' });
  assert.equal(root.querySelector('img'), null);
  const code = root.querySelector('is-code');
  assert.equal(code?.value ?? code?.getAttribute('value'), '<img src=x onerror=alert(1)>');
});

test('sw-json acepta lang shell para cURL', () => {
  const curl = 'curl -X PUT \'https://x/api\' \\\n  -H \'Content-Type: application/json\'';
  const root = montar('sw-json', { value: curl, lang: 'shell' });
  assert.equal(root.querySelector('is-code')?.getAttribute('lang'), 'shell');
});

test('sw-doc monta is-md-render con el markdown', () => {
  const root = montar('sw-doc', { markdown: '# Hola\n\nUn **párrafo**.' });
  const md = root.querySelector('is-md-render.md');
  assert.ok(md);
  assert.equal(md.getAttribute('value'), '# Hola\n\nUn **párrafo**.');
  assert.ok(md.hasAttribute('readonly'));
});

test('sw-params pinta un campo por parámetro y ninguno si la lista está vacía', () => {
  const con = montar('sw-params', {
    params: [
      { name: 'a', in: 'query', schema: { type: 'string' } },
      { name: 'b', in: 'query', schema: { type: 'string', enum: ['x', 'y'] } },
    ],
    values: {},
    titulo: 'Query',
  });
  assert.equal(con.querySelectorAll('.fila').length, 2);
  // El enum va a is-select; el resto a is-input.
  assert.ok(con.querySelector('is-select'));
  assert.ok(con.querySelector('is-input'));

  const sin = montar('sw-params', { params: [], values: {}, titulo: 'Query' });
  assert.equal(sin.querySelector('.bloque'), null);
});

test('sw-params emite sw-param-change al escribir', () => {
  const node = dom.window.document.createElement('sw-params');
  dom.window.document.body.append(node);
  node.props = { params: [{ name: 'a', in: 'query', schema: { type: 'string' } }], values: {}, titulo: '' };

  const visto = [];
  node.addEventListener('sw-param-change', (e) => visto.push(e.detail));

  const input = node.shadowRoot.querySelector('is-input');
  input.value = 'hola';
  input.dispatchEvent(new dom.window.Event('is-input', { bubbles: true }));

  assert.deepEqual(visto, [{ name: 'a', value: 'hola' }]);
});

test('sw-responses lista un desplegable por código', () => {
  const root = montar('sw-responses', { responses: op().responses });
  assert.equal(root.querySelectorAll('.respuesta').length, 2);
  assert.equal(root.querySelector('[data-code="404"]')?.getAttribute('data-code'), '404');
});

test('sw-operation cerrada no monta el cuerpo (coste diferido)', () => {
  const root = montar('sw-operation', { op: op(), spec: {}, abierto: false, tab: 'try' });
  assert.ok(root.querySelector('sw-method'), 'falta el chip de método');
  assert.equal(root.querySelector('.cuerpo'), null, 'el cuerpo no debe existir cerrado');
});

test('sw-operation abierta monta pestañas y contenido', () => {
  const root = montar('sw-operation', { op: op(), spec: {}, abierto: true, tab: 'try' });
  assert.equal(root.querySelectorAll('.pestana').length, 3);
  assert.ok(root.querySelector('sw-try'), 'la pestaña Probar no montó sw-try');
});

test('sw-operation marca con candado lo que exige JWT', () => {
  const spec = { components: { securitySchemes: { Bearer: { type: 'http', scheme: 'bearer' } } } };
  const conAuth = montar('sw-operation', {
    op: op({ security: [{ Bearer: [] }] }), spec, authEnabled: true, abierto: false, tab: 'try',
  });
  assert.ok(conAuth.querySelector('.candado'));

  const sinAuth = montar('sw-operation', { op: op(), spec, authEnabled: true, abierto: false, tab: 'try' });
  assert.equal(sinAuth.querySelector('.candado'), null);
});

test('sw-tag-group pinta subgrupos cuando el tag los declara', () => {
  const a = op({ operationId: 'a' });
  const b = op({ operationId: 'b', method: 'post' });
  const root = montar('sw-tag-group', {
    spec: {},
    group: {
      name: 'Terceros',
      description: 'Maestro.',
      meta: {},
      operations: [a, b],
      subgroups: [
        { id: 'c', name: 'Consulta', operations: [a] },
        { id: 'm', name: 'Mantenimiento', operations: [b] },
      ],
    },
  });
  assert.equal(root.querySelectorAll('.subgrupo').length, 2);
  assert.equal(root.querySelectorAll('sw-operation').length, 2);
  assert.match(root.querySelector('.titulo').textContent, /Terceros/);
});

test('sw-tag-group sin subgrupos lista plano', () => {
  const root = montar('sw-tag-group', {
    spec: {},
    group: { name: 'Sistema', description: '', meta: {}, operations: [op()], subgroups: [] },
  });
  assert.equal(root.querySelectorAll('.subgrupo').length, 0);
  assert.equal(root.querySelectorAll('sw-operation').length, 1);
});

test('sw-info sin `info` no pinta cabecera vacía', () => {
  assert.equal(montar('sw-info', { spec: {} }).querySelector('.info'), null);
  assert.match(montar('sw-info', { spec: { info: { title: 'X', version: '1' } } }).textContent, /X/);
});

test('todo componente pintado enlaza su .css hermano', () => {
  // El link se pone después de rellenar el shadow; si alguien lo pusiera antes,
  // el vaciado se lo llevaría y el componente saldría sin estilos.
  const root = montar('sw-method', { method: 'get' });
  const link = root.querySelector('link[rel="stylesheet"]');
  assert.ok(link, 'sin <link> de CSS');
  assert.match(link.getAttribute('href'), /sw-method\.css$/);
});
