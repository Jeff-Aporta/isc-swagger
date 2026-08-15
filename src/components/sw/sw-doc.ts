/**
 * <sw-doc> — prosa Markdown vía `<is-md-render>` (kit is-webcomponents).
 *
 * El host debe haber cargado el tag `is-md-render` (y los `is-*` que el MD
 * embute: `is-code`, `is-flowchart`, …). El cuerpo va en un
 * `<script type="text/markdown">` hijo — no en el atributo `value` — para
 * que HTML embebido (`<is-flowchart>`, `<is-code>`) no se rompa por comillas.
 */

import { crearComponente, define, html } from './_shared.js';

interface Props {
  markdown: string;
  /** Texto cuando no hay documentación. */
  vacio: string;
}

const SwDoc = crearComponente<Props>(
  import.meta.url,
  (root, { markdown, vacio }) => {
    const md = String(markdown ?? '').trim();
    if (!md) {
      root.append(html`
        <is-callout color="neutral" variant="plain" icon="mdi:book-off-outline">${vacio}</is-callout>
      `);
      return;
    }

    const render = document.createElement('is-md-render');
    render.className = 'md';
    render.setAttribute('readonly', '');
    const source = document.createElement('script');
    source.type = 'text/markdown';
    source.setAttribute('data-md-source', '');
    source.textContent = md;
    render.append(source);

    root.append(html`<div class="prosa">${render}</div>`);
  },
  { markdown: '', vacio: 'Esta operación no trae documentación en el documento.' },
  'sw-doc',
);

define('sw-doc', SwDoc);
export { SwDoc };
