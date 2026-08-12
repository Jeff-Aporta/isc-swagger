/**
 * <sw-minidoc-code> — columna derecha del driver `sw-minidoc`.
 *
 * Dos paneles apilados y pegajosos: la muestra de la petición (cURL) y la respuesta, esta con
 * una pestaña por código de estado. Es la mitad «máquina» de la lectura: mientras la columna
 * central explica los parámetros en prosa, aquí se ve la llamada tal cual se copia.
 *
 * No comparte estado con el driver de acordeones: recibe la operación por `props` y no escribe
 * nada en la URL. La pestaña de estado activa es estado local — cambiar de código de respuesta
 * no es navegación y no debe entrar en el historial.
 */

import { adoptCss, precargarCss, define, html } from './_shared.js';
import { buildCurl } from '../../js/curl.js';
import { jsonPretty, extractJsonExample, responseTone, toneToIsColor } from '../../js/openapi.js';
import './sw-json.js';

interface Props {
  op: SwOp | null;
  spec: SwSpec | null;
  serverBase: string;
  requiereBearer: boolean;
}

class SwMinidocCode extends HTMLElement {
  #root: ShadowRoot;
  #props: Props = { op: null, spec: null, serverBase: '', requiereBearer: false };
  /** Código de estado visible. Se reinicia al cambiar de operación, no al repintar. */
  #estado = '';
  #cuerpoNodo: HTMLElement | null = null;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.#render();
  }

  get props(): Props {
    return this.#props;
  }

  set props(v: Partial<Props> | null | undefined) {
    const antes = this.#props.op?.operationId;
    this.#props = { ...this.#props, ...(v ?? {}) };
    if (this.#props.op?.operationId !== antes) this.#estado = '';
    if (this.isConnected) this.#render();
  }

  /** Códigos de respuesta declarados, con los 2xx primero: es lo que se mira primero. */
  get #codigos(): string[] {
    const todos = Object.keys(this.#props.op?.responses ?? {});
    return todos.sort((a, b) => {
      const na = Number(a) || 999;
      const nb = Number(b) || 999;
      return na - nb;
    });
  }

  #cuerpoDeEstado(code: string): string {
    const resp = this.#props.op?.responses?.[code];
    const ejemplo = extractJsonExample(resp?.content?.['application/json']);
    if (ejemplo !== undefined && ejemplo !== null) return jsonPretty(ejemplo);
    const schema = resp?.content?.['application/json']?.schema;
    if (schema) return jsonPretty(schema);
    return resp?.description ? `// ${resp.description}` : '// Sin cuerpo documentado';
  }

  #pintarCuerpo(): void {
    const zona = this.#cuerpoNodo;
    if (!zona) return;
    for (const t of this.#root.querySelectorAll('.estado')) {
      t.toggleAttribute('data-activo', (t as HTMLElement).dataset.code === this.#estado);
    }
    const json = document.createElement('sw-json');
    (json as HTMLElement & { props: unknown }).props = { value: this.#cuerpoDeEstado(this.#estado), maxHeight: '26rem' };
    zona.replaceChildren(json);
  }

  #render(): void {
    const { op, spec, serverBase, requiereBearer } = this.#props;
    this.#root.replaceChildren();
    this.#cuerpoNodo = null;

    if (!op) {
      adoptCss(this.#root, import.meta.url, 'sw-minidoc-code');
      return;
    }

    const curl = buildCurl(op, spec, serverBase, requiereBearer);
    const muestra = document.createElement('sw-json');
    (muestra as HTMLElement & { props: unknown }).props = { value: curl.texto, maxHeight: '18rem' };

    const codigos = this.#codigos;
    if (!this.#estado || !codigos.includes(this.#estado)) this.#estado = codigos[0] ?? '';

    const pestanas = codigos.map((code) =>
      html`
        <button
          type="button"
          class="estado"
          data-code="${code}"
          data-tono="${responseTone(code)}"
          onclick=${() => {
            this.#estado = code;
            this.#pintarCuerpo();
          }}
        >${code}</button>
      `,
    );

    this.#root.append(html`
      <section class="panel">
        <header class="panel-cab">
          <span class="panel-titulo">cURL</span>
          <is-copy-button value="${curl.texto}" copy-label="Copiar petición"></is-copy-button>
        </header>
        ${muestra}
      </section>

      <section class="panel">
        <header class="panel-cab estados" role="tablist">
          ${pestanas}
          <is-copy-button class="al-final" value="${this.#cuerpoDeEstado(this.#estado)}" copy-label="Copiar respuesta"></is-copy-button>
        </header>
        <div class="cuerpo"></div>
      </section>
    `);

    this.#cuerpoNodo = this.#root.querySelector('.cuerpo');
    this.#pintarCuerpo();
    adoptCss(this.#root, import.meta.url, 'sw-minidoc-code');
  }
}

precargarCss(import.meta.url, 'sw-minidoc-code');
define('sw-minidoc-code', SwMinidocCode);
export { SwMinidocCode, toneToIsColor };
