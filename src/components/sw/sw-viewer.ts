/**
 * <sw-viewer> — monta el driver elegido y deja cambiarlo en caliente.
 *
 * Es la envoltura que usa la página: en vez de decidir a mano si pone `<sw-app>` o
 * `<sw-minidoc>`, pone `<sw-viewer>` y el selector aparece solo.
 *
 * El selector ya no vive aquí: está en la cabecera de cada driver, junto al conmutador de tema,
 * que es donde el lector lo busca. Lo monta `<sw-driver-switch>`, que solo escribe la
 * preferencia y emite `sw-driver-change`; esta envoltura lo escucha y hace el cambio, porque es
 * la única que sabe dónde está montado el driver actual.
 *
 * Cambiar de driver **destruye y recrea** el componente. No hay estado que migrar: cada driver
 * carga el documento en su `connectedCallback`, y lo compartido (operación abierta, servidor,
 * sesión) ya viaja por la URL y por el almacenamiento, así que la vista nueva aterriza donde
 * estaba la anterior.
 */

import { adoptCss, precargarCss, define, html } from './_shared.js';
import type { SwConn } from '../../js/conn.js';
import { driverMeta, readDriver, writeDriver, type SwDriver } from '../../js/driver.js';
import './sw-app.js';
import './sw-minidoc.js';

class SwViewer extends HTMLElement {
  #root: ShadowRoot;
  #driver: SwDriver['id'] = readDriver();
  #conn: SwConn | null = null;
  #montajeNodo: HTMLElement | null = null;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
  }

  /** Conn del anfitrión. Se reenvía al driver activo y a los que vengan después. */
  get conn(): SwConn | null { return this.#conn; }
  set conn(v: SwConn | null) {
    this.#conn = v && typeof v === 'object' ? v : null;
    const activo = this.#montajeNodo?.firstElementChild as (HTMLElement & { conn?: SwConn | null }) | null;
    if (activo) activo.conn = this.#conn;
  }

  /** Driver activo. Escribible para poder fijarlo desde el anfitrión o desde una prueba. */
  get driver(): SwDriver['id'] { return this.#driver; }
  set driver(v: SwDriver['id']) {
    if (v === this.#driver) return;
    this.#driver = driverMeta(v).id;
    writeDriver(this.#driver);
    if (this.isConnected) this.#montarDriver();
  }

  connectedCallback(): void {
    // El evento sube desde la cabecera del driver montado, atravesando su shadow.
    this.addEventListener('sw-driver-change', (e) => {
      const elegido = (e as CustomEvent).detail?.driver as SwDriver['id'] | undefined;
      if (elegido) this.driver = elegido;
    });
    this.#render();
  }

  #montarDriver(): void {
    const zona = this.#montajeNodo;
    if (!zona) return;
    const nodo = document.createElement(this.#driver) as HTMLElement & { conn?: SwConn | null };
    // El conn se asigna antes de insertarlo: si se hiciera después, el driver ya habría
    // arrancado su carga con la configuración de la URL y pediría el documento dos veces.
    if (this.#conn) nodo.conn = this.#conn;
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
