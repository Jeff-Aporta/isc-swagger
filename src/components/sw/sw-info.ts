/**
 * <sw-info> — cabecera del documento: título y descripción general (`info.description`).
 *
 * En el driver clásico (`sw-app`) es la portada: la descripción va entera vía `sw-doc`,
 * no colapsada, porque es el home al pulsar el logo.
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
          ${info.version ? html`<span class="version">v${info.version}</span>` : null}
        </div>
        ${doc ? html`<div class="descripcion">${doc}</div>` : null}
      </header>
    `);
  },
  { spec: null },
  'sw-info',
);

define('sw-info', SwInfo);
export { SwInfo };
