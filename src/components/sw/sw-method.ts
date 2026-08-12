/**
 * <sw-method> — chip del método HTTP.
 *
 * Ancho fijo para que las rutas de una lista queden alineadas por su primer
 * carácter: con el chip ajustado al texto, `GET` y `DELETE` desplazan la ruta
 * y la columna deja de leerse como columna.
 */

import { crearComponente, define, html } from './_shared.js';
import { METHOD_COLOR } from '../../js/openapi.js';

interface Props {
  method: string;
}

const SwMethod = crearComponente<Props>(
  import.meta.url,
  (root, { method }) => {
    const m = String(method ?? '').toLowerCase();
    root.append(html`
      <is-tag class="metodo" color="${METHOD_COLOR[m] ?? 'neutral'}" variant="filled" data-method="${m}">
        ${m.toUpperCase()}
      </is-tag>
    `);
  },
  { method: 'get' },
  'sw-method',
);

define('sw-method', SwMethod);
export { SwMethod };
