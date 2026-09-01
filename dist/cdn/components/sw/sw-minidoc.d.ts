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
import type { SwConn } from '../../js/conn.js';
import './sw-method.js';
import './sw-auth.js';
import './sw-layout.js';
import './sw-driver-switch.js';
import './sw-doc-actions.js';
import './sw-minidoc-view.js';
import './sw-minidoc-code.js';
import './sw-home.js';
declare class SwMinidoc extends HTMLElement {
    #private;
    constructor();
    get doc(): unknown;
    set doc(v: unknown);
    get conn(): SwConn | null;
    set conn(v: SwConn | null);
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export { SwMinidoc };
