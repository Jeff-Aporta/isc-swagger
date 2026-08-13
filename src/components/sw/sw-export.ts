/**
 * <sw-export> — descargas: IS-Swagger (config), OpenAPI 3 y Postman.
 *
 * Los formatos se generan al pulsar, no al pintar el menú: serializar la spec
 * tres veces en cada repintado de la barra sería trabajo tirado.
 */

import { crearComponente, define, html, avisar } from './_shared.js';
import { buildExportFormats, descargarTexto } from '../../js/export.js';

interface Props {
  spec: SwSpec | null;
  config: SwConfig;
}

const SwExport = crearComponente<Props>(
  import.meta.url,
  (root, { spec, config }) => {
    const formatos = buildExportFormats(spec, config ?? {});
    if (!formatos.length) return;

    root.append(html`
      <is-dropdown
        class="menu"
        placement="bottom-end"
        onis-select=${(e: Event) => {
          const item = (e as CustomEvent<{ item: HTMLElement }>).detail?.item;
          const id = item?.getAttribute('value');
          const formato = formatos.find((f) => f.id === id);
          if (!formato) return;
          try {
            descargarTexto(formato.filename, formato.build());
          } catch (err) {
            avisar(`No se pudo generar el archivo: ${(err as Error)?.message ?? err}`, 'danger');
          }
        }}
      >
        <is-button slot="trigger" variant="plain" color="neutral" pill aria-label="Descargar documento">
          <is-icon icon="mdi:download-outline"></is-icon>
        </is-button>
        ${formatos.map(
          (f) => html`
            <is-dropdown-item value="${f.id}">
              <is-icon slot="icon" icon="${f.icon}"></is-icon>
              ${f.label}
            </is-dropdown-item>
          `,
        )}
      </is-dropdown>
    `);
  },
  { spec: null, config: {} },
  'sw-export',
);

define('sw-export', SwExport);
export { SwExport };
