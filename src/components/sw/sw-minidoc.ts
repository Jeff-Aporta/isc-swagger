/**
 * <sw-minidoc> — segundo driver del visor: una operación por vista, no acordeones.
 *
 * Es una alternativa completa a `sw-app`, no un modo suyo. Los dos leen el mismo documento con
 * el mismo dominio (`js/config`, `js/openapi`, `js/nav`), pero lo presentan distinto:
 *
 *   - `sw-app`     lista por tags y despliega la operación en su sitio. Bueno para barrer una
 *                  API entera y comparar endpoints vecinos.
 *   - `sw-minidoc` índice a la izquierda, la operación elegida ocupando la página, y la
 *                  petición y la respuesta fijas a la derecha. Bueno para integrar un endpoint
 *                  concreto sin perderlo de vista mientras se escribe el código.
 *
 * No entran en conflicto: son dos custom elements distintos, cada uno con su shadow y su hoja,
 * y ninguno registra el tag del otro. Una página monta el que quiera; montar los dos a la vez
 * funciona, solo que se duplicaría la carga del documento.
 *
 * El estado vive aquí, igual que en `sw-app`: la operación abierta se refleja en `?s=.op` para que
 * un enlace lleve a la página exacta que alguien quiere enseñar.
 */

import { adoptCss, precargarCss, define, html } from './_shared.js';
import { loadViewerDocument, resolveBootConfig } from '../../js/config.js';
import type { SwConn } from '../../js/conn.js';
import { buildDocIndex, groupOperationsByTag, operationRequiresBearer, sortGroupsBySpecOrder } from '../../js/openapi.js';
import { filterGroupsByQuery } from '../../js/nav.js';
import { inferDefaultServerBase, readServerFromUrl } from '../../js/server-base.js';
import { mergeUrlState, readUrlState, subscribeUrlState } from '../../js/url-state.js';
import { getStoredJwt, resolveAuthConfig } from '../../js/auth.js';
import './sw-method.js';
import './sw-auth.js';
import './sw-layout.js';
import './sw-driver-switch.js';
import './sw-export.js';
import './sw-minidoc-view.js';
import './sw-minidoc-code.js';

class SwMinidoc extends HTMLElement {
  #root: ShadowRoot;

  #config: SwConfig = {};
  #auth: SwAuthConfig = {};
  #spec: SwSpec | null = null;
  #grupos: SwGrupo[] = [];
  #docIndex: Record<string, string> = {};
  #session: SwSesion | null = null;
  #serverBase = '';

  #opAbierta = '';
  #query = '';

  #estado: 'cargando' | 'listo' | 'error' = 'cargando';
  #error = '';

  #indiceNodo: HTMLElement | null = null;
  #vistaNodo: HTMLElement | null = null;
  #codigoNodo: HTMLElement | null = null;
  #desuscribir: (() => void) | null = null;

  /** Conn entregado por el anfitrión. Mismo contrato que `sw-app`. */
  #conn: SwConn | null = null;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
  }

  get conn(): SwConn | null { return this.#conn; }
  set conn(v: SwConn | null) {
    this.#conn = v && typeof v === 'object' ? v : null;
    if (this.isConnected) void this.#cargar();
  }

  #connDesdeAtributo(): SwConn | null {
    const rawAttr = this.getAttribute('conn');
    if (!rawAttr?.trim()) return null;
    try {
      const parsed = JSON.parse(rawAttr) as unknown;
      return parsed && typeof parsed === 'object' ? (parsed as SwConn) : null;
    } catch {
      return null;
    }
  }

  connectedCallback(): void {
    this.#opAbierta = readUrlState().op;

    this.#desuscribir = subscribeUrlState((estado) => {
      // Solo el «atrás» del navegador: si ya coincide, el aviso viene de nuestra escritura.
      if (estado.op === this.#opAbierta) return;
      this.#opAbierta = estado.op;
      this.#sincronizarSeleccion();
    });

    this.#render();
    void this.#cargar();
  }

  disconnectedCallback(): void {
    this.#desuscribir?.();
    this.#desuscribir = null;
  }

  async #cargar(): Promise<void> {
    try {
      const boot = resolveBootConfig(this.#conn ?? this.#connDesdeAtributo());
      const { config, spec } = await loadViewerDocument(boot);

      this.#config = config;
      this.#auth = resolveAuthConfig(config);
      this.#spec = spec;
      this.#grupos = sortGroupsBySpecOrder(groupOperationsByTag(spec), spec);
      this.#docIndex = buildDocIndex(spec);
      this.#session = this.#auth.enabled ? getStoredJwt() : null;
      this.#serverBase = readServerFromUrl() || inferDefaultServerBase(spec, config);
      // Sin operación en la URL se abre la que declare el documento y, si no declara ninguna,
      // la primera: una página en blanco no dice qué es esto.
      if (!this.#opAbierta) {
        const preferida = String(this.#config.defaultOp ?? '').trim();
        const existe = preferida && this.#todas.some((o) => o.operationId === preferida);
        this.#opAbierta = existe ? preferida : (this.#todas[0]?.operationId ?? '');
      }
      this.#estado = 'listo';
    } catch (e) {
      this.#estado = 'error';
      this.#error = (e as Error)?.message ?? String(e);
    }
    this.#render();
  }

  get #todas(): SwOp[] {
    return this.#grupos.flatMap((g) => g.operations);
  }

  get #gruposVisibles(): SwGrupo[] {
    return filterGroupsByQuery(this.#grupos, this.#query);
  }

  get #op(): SwOp | null {
    return this.#todas.find((o) => o.operationId === this.#opAbierta) ?? null;
  }

  get #grupoDeOp(): string {
    const id = this.#opAbierta;
    return this.#grupos.find((g) => g.operations.some((o) => o.operationId === id))?.name ?? '';
  }

  #seleccionar(operationId: string): void {
    if (operationId === this.#opAbierta) return;
    this.#opAbierta = operationId;
    mergeUrlState({ op: operationId });
    this.#sincronizarSeleccion();
  }

  /** Repinta solo lo que depende de la operación: el shell y el índice se quedan. */
  #sincronizarSeleccion(): void {
    for (const b of this.#root.querySelectorAll('.op')) {
      b.toggleAttribute('data-activo', (b as HTMLElement).dataset.op === this.#opAbierta);
    }
    const op = this.#op;
    const requiereBearer = this.#auth.enabled && operationRequiresBearer(op ?? undefined, this.#spec);

    if (this.#vistaNodo) {
      (this.#vistaNodo as HTMLElement & { props: unknown }).props = {
        op,
        spec: this.#spec,
        grupo: this.#grupoDeOp,
        serverBase: this.#serverBase,
        authEnabled: this.#auth.enabled,
        docMd: op ? (this.#docIndex[op.operationId] ?? '') : '',
      };
    }
    if (this.#codigoNodo) {
      (this.#codigoNodo as HTMLElement & { props: unknown }).props = {
        op,
        spec: this.#spec,
        serverBase: this.#serverBase,
        requiereBearer,
      };
    }
    // La columna central cambió entera: seguir a media página del endpoint anterior desorienta.
    this.#vistaNodo?.scrollIntoView({ block: 'start' });
  }

  #filaOp(o: SwOp): HTMLElement {
    const metodo = document.createElement('sw-method');
    (metodo as HTMLElement & { props: unknown }).props = { method: o.method };
    const ruta = String(o.path || '');
    const requiereJwt = this.#auth.enabled && operationRequiresBearer(o, this.#spec);
    const candado = requiereJwt
      ? html`<is-icon class="op-lock" icon="mdi:lock" title="Requiere JWT" aria-label="Requiere JWT"></is-icon>`
      : html`<span class="op-lock op-lock--vacio" aria-hidden="true"></span>`;
    return html`
      <button
        type="button"
        class="op"
        data-op="${o.operationId}"
        title="${ruta}"
        ${o.operationId === this.#opAbierta ? 'data-activo' : ''}
        onclick=${() => this.#seleccionar(o.operationId)}
      >
        ${candado}
        ${metodo}
        <span class="op-texto">
          <span class="op-nombre">${o.summary || o.operationId}</span>
          <span class="op-path">${ruta}</span>
        </span>
      </button>
    `;
  }

  #pintarIndice(): void {
    const zona = this.#indiceNodo;
    if (!zona) return;

    const grupos = this.#gruposVisibles.map((g) => {
      const bloques = g.subgroups.length
        ? g.subgroups.map(
            (sub) => html`
              <section class="entidad">
                <h4 class="entidad-titulo">${sub.name || sub.id}</h4>
                ${sub.operations.map((o) => this.#filaOp(o))}
              </section>
            `,
          )
        : g.operations.map((o) => this.#filaOp(o));

      return html`
        <section class="grupo">
          <h3 class="grupo-titulo">${g.name}</h3>
          ${bloques}
        </section>
      `;
    });

    zona.replaceChildren(...(grupos.length ? grupos : [html`<p class="sin-resultados">Sin coincidencias.</p>`]));
  }

  #render(): void {
    this.#root.replaceChildren();
    this.#indiceNodo = null;
    this.#vistaNodo = null;
    this.#codigoNodo = null;

    if (this.#estado === 'cargando') {
      this.#root.append(html`<div class="centrado"><is-spinner></is-spinner></div>`);
      adoptCss(this.#root, import.meta.url, 'sw-minidoc');
      return;
    }

    if (this.#estado === 'error') {
      this.#root.append(html`
        <div class="centrado">
          <is-callout color="danger" variant="outlined">
            <strong>No se pudo cargar la documentación.</strong>
            <p>${this.#error}</p>
          </is-callout>
        </div>
      `);
      adoptCss(this.#root, import.meta.url, 'sw-minidoc');
      return;
    }

    const titulo = this.#config.brand?.title || this.#spec?.info?.title || 'API';

    const vista = document.createElement('sw-minidoc-view');
    const codigo = document.createElement('sw-minidoc-code');

    const autenticacion = document.createElement('sw-auth');
    (autenticacion as HTMLElement & { props: unknown }).props = { authEnabled: this.#auth.enabled, auth: this.#auth, session: this.#session };
    autenticacion.addEventListener('sw-session-change', (e) => {
      this.#session = ((e as CustomEvent).detail as { session: SwSesion | null })?.session ?? null;
    });

    const exportar = document.createElement('sw-export');
    (exportar as HTMLElement & { props: unknown }).props = { spec: this.#spec, config: this.#config };

    const iconoMarca = this.#config.brand?.icon || 'mdi:api';

    this.#root.append(html`
      <sw-layout>
        <div slot="cabecera" class="cabecera">
          <span class="marca">
            <is-icon class="marca-logo" icon="${iconoMarca}"></is-icon>
            <span class="marca-texto">${titulo}</span>
          </span>
          <is-input
            class="buscar"
            type="search"
            placeholder="Buscar endpoint…"
            onis-input=${(e: Event) => {
              this.#query = String((e.target as HTMLInputElement).value ?? '');
              this.#pintarIndice();
            }}
          ></is-input>
          ${autenticacion}
          ${exportar}
          <sw-driver-switch></sw-driver-switch>
          <is-theme-toggle></is-theme-toggle>
        </div>

        <nav slot="inicio" class="indice" aria-label="Índice de endpoints"></nav>
        <div slot="centro">${vista}</div>
        <div slot="fin">${codigo}</div>
      </sw-layout>
    `);

    this.#indiceNodo = this.#root.querySelector('.indice');
    this.#vistaNodo = vista;
    this.#codigoNodo = codigo;

    this.#pintarIndice();
    this.#sincronizarSeleccion();
    adoptCss(this.#root, import.meta.url, 'sw-minidoc');
  }
}

precargarCss(import.meta.url, 'sw-minidoc');
define('sw-minidoc', SwMinidoc);
export { SwMinidoc };
