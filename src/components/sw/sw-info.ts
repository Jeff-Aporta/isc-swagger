/**
 * <sw-info> — cabecera del documento: título, versión y descripción.
 *
 * La descripción de `info` suele venir en Markdown y suele ser larga, así que
 * va colapsada tras las dos primeras líneas: lo que importa arriba del todo
 * es saber qué API es y qué versión, no leer su manual.
 */

import { crearComponente, define, html } from './_shared.js';
import './sw-doc.js';

interface Props {
  spec: SwSpec | null;
}

const SwInfo = crearComponente<Props>(
  import.meta.url,
  (root, { spec }) => {
    const info = spec?.info;
    if (!info) return;

    const descripcion = String(info.description ?? '').trim();
    let doc: HTMLElement | null = null;
    if (descripcion) {
      doc = document.createElement('sw-doc');
      (doc as HTMLElement & { props: unknown }).props = { markdown: descripcion };
    }

    root.append(html`
      <header class="info">
        <div class="linea">
          <h1 class="titulo">${info.title ?? 'API'}</h1>
        </div>
        ${doc ? html`<is-details class="descripcion" variant="plain" summary="Descripción del documento">${doc}</is-details>` : null}
      </header>
    `);
  },
  { spec: null },
  'sw-info',
);

define('sw-info', SwInfo);
export { SwInfo };
