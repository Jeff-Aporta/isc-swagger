/**
 * <sw-doc-actions> — descarga + recarga en un `<is-button-group pill>`.
 *
 * Une los dos iconos de documento (export y refresh) para que se lean como
 * una sola pastilla. Emite `sw-doc-reload` igual que `<sw-doc-reload>`.
 */

import { crearComponente, define, emitir, html, avisar } from './_shared.js';
import { buildExportFormats, descargarTexto } from '../../js/export.js';

type Props = { spec: SwSpec | null; config: SwConfig; };

const SwDocActions = crearComponente<Props>(
  import.meta.url,
  (root, { spec, config }, host) => {
    const formatos = buildExportFormats(spec, config ?? {});

    root.append(html`
      <is-button-group class="grupo" pill label="Documento" aria-label="Documento">
        ${formatos.length
          ? html`
              <is-dropdown
                class="dl"
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
                <is-button
                  slot="trigger"
                  variant="outlined"
                  color="neutral"
                  aria-label="Descargar documento"
                  title="Descargar documento"
                >
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
            `
          : null}
        <is-button
          class="rl"
          variant="outlined"
          color="neutral"
          aria-label="Actualizar documentación"
          title="Actualizar desde el servidor (ignora cache local de 24 h)"
          onis-click=${() => emitir(host, 'sw-doc-reload', null)}
        >
          <is-icon icon="mdi:refresh"></is-icon>
        </is-button>
      </is-button-group>
    `);
  },
  { spec: null, config: {} },
  'sw-doc-actions',
);

define('sw-doc-actions', SwDocActions);
export { SwDocActions };
