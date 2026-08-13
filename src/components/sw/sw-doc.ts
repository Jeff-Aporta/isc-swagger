/**
 * <sw-doc> — prosa Markdown vía `<is-md-render>` (kit is-webcomponents).
 *
 * El host debe haber cargado el tag `is-md-render`. Si el kit no está listo
 * todavía, el custom element queda inerte hasta el upgrade.
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
    render.setAttribute('value', md);

    root.append(html`<div class="prosa">${render}</div>`);
  },
  { markdown: '', vacio: 'Esta operación no trae documentación en el documento.' },
  'sw-doc',
);

define('sw-doc', SwDoc);
export { SwDoc };
