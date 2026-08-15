/**
 * <sw-export> — descargas: IS-Swagger (config), OpenAPI 3 y Postman.
 *
 * Los formatos se generan al pulsar, no al pintar el menú: serializar la spec
 * tres veces en cada repintado de la barra sería trabajo tirado.
 *
 * Postman es async (rasteriza diagramas a PNG); el resto suele ser sync.
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
          void (async () => {
            try {
              if (formato.id === 'postman') {
                avisar('Generando Postman (diagramas → PNG)…', 'brand');
              }
              const contenido = await Promise.resolve(formato.build());
              descargarTexto(formato.filename, contenido);
              avisar(`Descargado: ${formato.filename}`, 'success');
            } catch (err) {
              avisar(`No se pudo generar el archivo: ${(err as Error)?.message ?? err}`, 'danger');
            }
          })();
        }}
      >
        <is-button slot="trigger" variant="plain" color="neutral" aria-label="Descargar documento">
          <is-icon slot="start" icon="mdi:download-outline"></is-icon>
          Descargar
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
