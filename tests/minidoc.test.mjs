/**
 * minidoc.test.mjs — el segundo driver (`sw-minidoc`) sobre el build.
 *
 * Cubre dos cosas que los guardianes de documentación no miran: que las vistas pinten de verdad
 * lo que dicen pintar, y que los dos drivers **no se pisen**. Lo segundo es el riesgo real de
 * tener dos presentaciones del mismo documento: un tag registrado dos veces, o un componente que
 * escribe estado global del otro, no se nota hasta que alguien monta los dos.
 *
 * El generador de cURL se prueba aparte porque es dominio puro: es lo que se copia a un ticket,
 * y una comilla mal escapada ahí produce un comando que falla en la shell de otro.
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
globalThis.location = dom.window.location;

await import('../dist/cdn/components/sw/sw-minidoc-view.js');
await import('../dist/cdn/components/sw/sw-minidoc-code.js');
await import('../dist/cdn/components/sw/sw-app.js');
await import('../dist/cdn/components/sw/sw-minidoc.js');
const { buildCurl, ejemploDeParam } = await import('../dist/cdn/js/curl.js');

function montar(tag, props) {
  const node = dom.window.document.createElement(tag);
  dom.window.document.body.append(node);
  node.props = props;
  return node.shadowRoot;
}

const op = (over = {}) => ({
  path: '/v2/tareas/{id}',
  method: 'get',
  operationId: 'listarTareas',
  summary: 'Listar tareas',
  description: 'Devuelve las tareas de los últimos 7 días.',
  parameters: [
    { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Id de la tarea.' },
    { name: 'page_num', in: 'query', required: true, schema: { type: 'integer', default: 1 } },
    { name: 'estado', in: 'query', schema: { type: 'string', enum: ['queued', 'succeeded'] } },
  ],
  responses: {
    200: { description: 'OK', content: { 'application/json': { example: { total: 1 } } } },
    429: { description: 'Demasiadas peticiones' },
  },
  ...over,
});

/* ── Vista central ──────────────────────────────────────────── */

test('sw-minidoc-view pinta la operación entera, sin plegar nada', () => {
  const root = montar('sw-minidoc-view', {
    op: op(), spec: null, grupo: 'Tareas', serverBase: 'https://h/api', authEnabled: false, docMd: '',
  });
  const texto = root.textContent;
  assert.match(texto, /Listar tareas/, 'falta el título');
  assert.match(texto, /Tareas/, 'falta el grupo');
  assert.match(texto, /Parámetros de ruta/, 'no agrupa los de ruta');
  assert.match(texto, /Parámetros de consulta/, 'no agrupa los de consulta');
  assert.match(texto, /page_num/, 'falta un parámetro');
  // Sin acordeón: la razón de existir de este driver es que no haya nada que abrir.
  assert.equal(root.querySelectorAll('is-details').length, 0, 'la vista no debe plegar contenido');
});

test('sw-minidoc-view marca los obligatorios y enseña los valores de un enum', () => {
  const root = montar('sw-minidoc-view', {
    op: op(), spec: null, grupo: '', serverBase: '', authEnabled: false, docMd: '',
  });
  assert.equal(root.querySelectorAll('.param-req').length, 2, 'id y page_num son obligatorios');
  assert.match(root.textContent, /queued/, 'no lista los valores del enum');
});

test('sw-minidoc-view sin operación invita a elegir en vez de quedarse en blanco', () => {
  const root = montar('sw-minidoc-view', {
    op: null, spec: null, grupo: '', serverBase: '', authEnabled: false, docMd: '',
  });
  assert.match(root.textContent, /Elige una operación/);
});

/* ── Columna de código ──────────────────────────────────────── */

test('sw-minidoc-code abre en el primer código de estado y ofrece los demás', () => {
  const root = montar('sw-minidoc-code', {
    op: op(), spec: null, serverBase: 'https://h/api', requiereBearer: false,
  });
  const estados = [...root.querySelectorAll('.estado')].map((b) => b.textContent.trim());
  assert.deepEqual(estados, ['200', '429'], 'los estados van ordenados');
  assert.equal(root.querySelector('.estado[data-activo]').textContent.trim(), '200');
});

test('sw-minidoc-code cambia de estado sin tocar la URL', () => {
  const antes = dom.window.location.search;
  const root = montar('sw-minidoc-code', {
    op: op(), spec: null, serverBase: 'https://h/api', requiereBearer: false,
  });
  root.querySelectorAll('.estado')[1].click();
  assert.equal(root.querySelector('.estado[data-activo]').textContent.trim(), '429');
  assert.equal(dom.window.location.search, antes, 'cambiar de código no es navegación');
});

/* ── cURL ───────────────────────────────────────────────────── */

test('buildCurl sustituye los {parámetros} y añade solo la query obligatoria', () => {
  const { texto } = buildCurl(op(), null, 'https://h/api', false);
  assert.match(texto, /--request GET/);
  assert.match(texto, /\/v2\/tareas\/0/, 'no sustituyó el parámetro de ruta');
  assert.match(texto, /page_num=1/, 'falta la query obligatoria');
  assert.doesNotMatch(texto, /estado=/, 'no debe inventar los parámetros opcionales');
});

test('buildCurl deja el token como placeholder, nunca uno real', () => {
  const { texto } = buildCurl(op(), null, 'https://h/api', true);
  assert.match(texto, /Authorization: Bearer <token>/);
});

test('buildCurl no deja la barra de continuación en la última línea', () => {
  const { lineas } = buildCurl(op(), null, 'https://h/api', true);
  assert.ok(!lineas.at(-1).endsWith('\\'), 'pegado en una shell dejaría el prompt esperando');
});

test('buildCurl escapa las comillas simples para la shell', () => {
  // `encodeURIComponent` no toca el apóstrofo, así que llega crudo a la URL. Quien tiene que
  // protegerlo es el comillado de shell: sin esto, la comilla cierra el argumento y el comando
  // que alguien pega en su terminal se parte por la mitad.
  const conComilla = op({
    parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string', default: "o'brien" } }],
  });
  const { texto } = buildCurl(conComilla, null, 'https://h/api', false);
  assert.ok(texto.includes("o'\\''brien"), 'la comilla simple debe salir cerrada, escapada y reabierta');
  // Las comillas que abren y cierran deben quedar pares. La escapada (`\'`) no cuenta: en el
  // idiom `'A'\''B'` va fuera del entrecomillado y es un carácter literal, no un delimitador.
  const urlLinea = texto.split('\n').find((l) => l.includes('--url'));
  const delimitadoras = (urlLinea.replace(/\\'/g, '').match(/'/g) ?? []).length;
  assert.equal(delimitadoras % 2, 0, `comillas desparejadas en --url: ${urlLinea}`);
});

test('ejemploDeParam cae al tipo cuando no hay ejemplo ni default', () => {
  assert.equal(ejemploDeParam({ name: 'n', in: 'query', schema: { type: 'integer' } }), '0');
  assert.equal(ejemploDeParam({ name: 'b', in: 'query', schema: { type: 'boolean' } }), 'false');
  assert.equal(ejemploDeParam({ name: 'x', in: 'query', schema: { type: 'string' } }), '<x>');
});

/* ── Los dos drivers conviven ───────────────────────────────── */

test('sw-app y sw-minidoc son tags distintos y ninguno registra el del otro', () => {
  assert.ok(dom.window.customElements.get('sw-app'), 'sw-app sin registrar');
  assert.ok(dom.window.customElements.get('sw-minidoc'), 'sw-minidoc sin registrar');
  assert.notEqual(
    dom.window.customElements.get('sw-app'),
    dom.window.customElements.get('sw-minidoc'),
    'los dos drivers no pueden ser la misma clase',
  );
});

test('los dos drivers pueden montarse en la misma página sin romperse', () => {
  const a = dom.window.document.createElement('sw-app');
  const b = dom.window.document.createElement('sw-minidoc');
  dom.window.document.body.append(a, b);
  // Sin red no cargan documento, pero deben tener shadow propio y no compartirlo.
  assert.ok(a.shadowRoot, 'sw-app sin shadow');
  assert.ok(b.shadowRoot, 'sw-minidoc sin shadow');
  assert.notEqual(a.shadowRoot, b.shadowRoot);
  a.remove();
  b.remove();
});

test('sw-minidoc acepta el conn como objeto y como atributo JSON', () => {
  const node = dom.window.document.createElement('sw-minidoc');
  node.setAttribute('conn', '{"apiBase":"https://h/api"}');
  dom.window.document.body.append(node);
  assert.ok(node.shadowRoot, 'no montó con conn en atributo');

  node.conn = { apiBase: 'https://otro/api' };
  assert.deepEqual(node.conn, { apiBase: 'https://otro/api' }, 'la propiedad debe leerse de vuelta');
  node.remove();
});

test('sw-minidoc no revienta con un conn de JSON roto en el atributo', () => {
  const node = dom.window.document.createElement('sw-minidoc');
  node.setAttribute('conn', '{esto no es json');
  dom.window.document.body.append(node);
  assert.ok(node.shadowRoot, 'un atributo corrupto no debe dejar la página en blanco');
  node.remove();
});
