/**
 * <sw-server> — selector del host contra el que se prueba.
 *
 * Combina las bases del documento con una libre editable: una spec pública
 * casi nunca lista el entorno local, y obligar a editar la URL de cada
 * petición a mano es lo que hace inservible un visor para desarrollo.
 *
 * Evento: sw-server-change  detail: { serverBase }
 */

import { crearComponente, define, html, emitir } from './_shared.js';
import { normalizeServerBase } from '../../js/server-base.js';

interface Props {
  value: string;
  options: string[];
}

const SwServer = crearComponente<Props>(
  import.meta.url,
  (root, { value, options }, host) => {
    const opciones = (options ?? []).filter(Boolean);
    const actual = String(value ?? '');

    const cambiar = (v: string): void => {
      const base = normalizeServerBase(v);
      if (base === actual) return;
      emitir(host, 'sw-server-change', { serverBase: base });
    };

    root.append(html`
      <div class="barra">
        <label class="etiqueta" for="server">Servidor</label>
        <is-input
          id="server"
          class="campo"
          full-width
          spellcheck="false"
          placeholder="https://host/api"
          value="${actual}"
          onis-change=${(e: Event) => cambiar(String((e.target as HTMLInputElement).value ?? ''))}
        ></is-input>
        ${opciones.length > 1
          ? html`
              <is-dropdown
                class="atajos"
                onis-select=${(e: Event) => {
                  const item = (e as CustomEvent<{ item: HTMLElement }>).detail?.item;
                  if (item) cambiar(item.getAttribute('value') ?? '');
                }}
              >
                <is-button slot="trigger" variant="outlined" color="neutral" with-caret>Conocidos</is-button>
                ${opciones.map(
                  (o) => html`
                    <is-dropdown-item type="checkbox" value="${o}" ${o === actual ? 'checked' : ''}>
                      ${o}
                    </is-dropdown-item>
                  `,
                )}
              </is-dropdown>
            `
          : null}
      </div>
    `);
  },
  { value: '', options: [] },
  'sw-server',
);

define('sw-server', SwServer);
export { SwServer };
