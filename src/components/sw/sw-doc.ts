/**
 * <sw-doc> — prosa Markdown (descripción de la operación o `x-iss-doc-md`).
 *
 * El markdown se convierte en `js/markdown.ts`, que escapa todo antes de
 * componer; aquí solo se inyecta el resultado y se le da forma de lectura.
 */

import { crearComponente, define, html, raw } from './_shared.js';
import { renderMarkdown } from '../../js/markdown.js';

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
    root.append(html`<div class="prosa">${raw(renderMarkdown(md))}</div>`);
  },
  { markdown: '', vacio: 'Esta operación no trae documentación en el documento.' },
  'sw-doc',
);

define('sw-doc', SwDoc);
export { SwDoc };
