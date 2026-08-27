/**
 * <sw-viewer> — monta el driver elegido y deja cambiarlo en caliente.
 *
 * El anfitrión ISS quema el documento en el atributo `doc` (JSON completo).
 * `conn` queda solo para demos / `?conn=`; PatyIA no lo usa.
 */

import { adoptCss, precargarCss, define, html } from './_shared.js';
import type { SwConn } from '../../js/conn.js';
import { driverMeta, readDriver, writeDriver, type SwDriver } from '../../js/driver.js';
import './sw-app.js';
import './sw-minidoc.js';

type DriverHost = HTMLElement & { conn?: SwConn | null; doc?: unknown };

function parseAttrJson(raw: string | null): unknown {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

class SwViewer extends HTMLElement {
  #root: ShadowRoot;
  #driver: SwDriver['id'] = readDriver();
  #conn: SwConn | null = null;
  #doc: unknown = null;
  #montajeNodo: HTMLElement | null = null;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
  }

  /** Conn del anfitrión. Se ignora si también hay `doc`. */
  get conn(): SwConn | null { return this.#conn; }
  set conn(v: SwConn | null) {
    this.#conn = v && typeof v === 'object' ? v : null;
    const activo = this.#montajeNodo?.firstElementChild as DriverHost | null;
    if (!activo) return;
    if (this.#doc != null) {
      activo.doc = this.#doc;
      activo.conn = null;
    } else {
      activo.conn = this.#conn;
    }
  }

  /** Documento InSoft/OpenAPI quemado (`doc=`). Si llega, `conn` se ignora. */
  get doc(): unknown { return this.#doc; }
  set doc(v: unknown) {
    this.#doc = v && typeof v === 'object' ? v : null;
    const activo = this.#montajeNodo?.firstElementChild as DriverHost | null;
    if (!activo) return;
    if (this.#doc != null) {
      activo.doc = this.#doc;
      activo.conn = null;
    }
  }

  get driver(): SwDriver['id'] { return this.#driver; }
  set driver(v: SwDriver['id']) {
    if (v === this.#driver) return;
    this.#driver = driverMeta(v).id;
    writeDriver(this.#driver);
    if (this.isConnected) this.#montarDriver();
  }

  connectedCallback(): void {
    this.addEventListener('sw-driver-change', (e) => {
      const elegido = (e as CustomEvent).detail?.driver as SwDriver['id'] | undefined;
      if (elegido) this.driver = elegido;
    });
    this.#render();
  }

  #montarDriver(): void {
    const zona = this.#montajeNodo;
    if (!zona) return;
    const nodo = document.createElement(this.#driver) as DriverHost;
    this.#doc ??= parseAttrJson(this.getAttribute('doc'));
    this.#conn ??= parseAttrJson(this.getAttribute('conn')) as SwConn | null;
    // `doc` gana: si hay documento quemado, no se reenvía `conn` (se ignora por completo).
    if (this.#doc != null) {
      nodo.doc = this.#doc;
    } else if (this.#conn) {
      nodo.conn = this.#conn;
    }
    zona.replaceChildren(nodo);
  }

  #render(): void {
    this.#root.replaceChildren();
    this.#root.append(html`<div class="montaje"></div>`);
    this.#montajeNodo = this.#root.querySelector('.montaje');
    this.#montarDriver();
    adoptCss(this.#root, import.meta.url, 'sw-viewer');
  }
}

precargarCss(import.meta.url, 'sw-viewer');
define('sw-viewer', SwViewer);
export { SwViewer };
