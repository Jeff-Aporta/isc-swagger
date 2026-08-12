/**
 * conn.test.mjs — la autoconexión `?conn=` llega hasta la spec.
 *
 * Cubre el camino que el usuario ve cuando PatyIA / ISS comparte un enlace
 * `?conn=...`: el visor decodifica el base64url, fija `apiBase` + marca +
 * `serverSelect=false`, y al cargar el documento apunta a
 * `<apiBase>/system/swagger/config.json` (o el override de `paths.config`).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { encodeConnParam } from '../dist/cdn/js/conn.js';

const buildUrl = (conn) => {
  const raw = encodeConnParam(conn);
  return `http://localhost:4190/index.html?conn=${raw}`;
};

const mountDom = (url) => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url, pretendToBeVisual: true });
  for (const k of ['window', 'document', 'HTMLElement', 'customElements', 'CustomEvent', 'Node', 'Event', 'URL', 'URLSearchParams']) {
    globalThis[k] = dom.window[k];
  }
  globalThis.location = dom.window.location;
  return dom;
};

const stubFetch = (onFetch) => {
  globalThis.fetch = async (req) => {
    onFetch(String(req));
    return new Response(JSON.stringify({ openapi: '3.0.3', paths: {} }), { status: 200 });
  };
};

test('?conn= fija apiBase, marca y oculta el selector de servidor', () => {
  const url = buildUrl({
    apiBase: 'https://ayudascp-ia-staging.azurewebsites.net/api',
    fixedServer: true,
    title: 'ISS PatyIA',
    icon: 'mdi:robot-happy-outline',
  });
  mountDom(url);

  // Reimporta con el nuevo location para forzar el camino URL.
  return import('../dist/cdn/js/config.js?bust=' + Math.random()).then(({ resolveBootConfig }) => {
    const cfg = resolveBootConfig();
    assert.equal(cfg.apiBase, 'https://ayudascp-ia-staging.azurewebsites.net/api');
    assert.equal(cfg.serverSelect, false);
    assert.equal(cfg.brand.title, 'ISS PatyIA');
    assert.equal(cfg.brand.icon, 'mdi:robot-happy-outline');
  });
});

test('?conn= con override de paths.config se respeta al pedir la spec', async () => {
  const url = buildUrl({
    apiBase: 'https://h/api',
    paths: { config: '/x/custom.json' },
  });
  const dom = mountDom(url);
  let fetched = '';
  stubFetch((u) => { fetched = u; });

  const cfgMod = await import('../dist/cdn/js/config.js?bust=' + Math.random());
  const cfg = cfgMod.resolveBootConfig();
  const { spec } = await cfgMod.loadViewerDocument(cfg);
  assert.equal(spec.openapi, '3.0.3');
  assert.equal(fetched, 'https://h/api/x/custom.json');
});

test('?conn= sin override cae al default ISS /system/swagger/config.json', async () => {
  const url = buildUrl({ apiBase: 'https://h/api' });
  const dom = mountDom(url);
  let fetched = '';
  stubFetch((u) => { fetched = u; });

  const cfgMod = await import('../dist/cdn/js/config.js?bust=' + Math.random());
  const cfg = cfgMod.resolveBootConfig();
  await cfgMod.loadViewerDocument(cfg);
  assert.equal(fetched, 'https://h/api/system/swagger/config.json');
});

test('?conn= gana sobre `<script id="sw-config">` para apiBase y marca', async () => {
  const url = buildUrl({ apiBase: 'https://h/api', title: 'Del Conn', icon: 'mdi:api' });
  const dom = new JSDOM(
    `<!doctype html><html><head>
       <script type="application/json" id="sw-config">${JSON.stringify({
         apiBase: 'https://otro/api',
         specUrl: './demo/openapi.sample.json',
         brand: { title: 'Del Script', icon: 'mdi:x' },
       })}</script>
     </head><body></body></html>`,
    { url, pretendToBeVisual: true },
  );
  for (const k of ['window', 'document', 'HTMLElement', 'URL', 'URLSearchParams']) {
    globalThis[k] = dom.window[k];
  }
  globalThis.location = dom.window.location;

  const cfgMod = await import('../dist/cdn/js/config.js?bust=' + Math.random());
  const cfg = cfgMod.resolveBootConfig();
  assert.equal(cfg.apiBase, 'https://h/api', '?conn= debe ganarle al <script>');
  assert.equal(cfg.brand.title, 'Del Conn');
  // El specUrl del <script> no debe sobrevivir: se sustituye por el del propio conn,
  // que es la spec del server al que se acaba de conectar.
  assert.equal(cfg.specUrl, 'https://h/api/system/swagger/config.json', '?conn= debe imponer su propia spec sobre la del <script>');
});