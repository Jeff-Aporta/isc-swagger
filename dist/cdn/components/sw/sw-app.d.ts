/**
 * <sw-app> — shell del visor. Es el único dueño del estado.
 *
 * Todo lo demás (`sw-nav`, `sw-tag-group`, `sw-operation`, `sw-try`) es
 * controlado: recibe `props` y emite eventos. Concentrar el estado aquí es lo
 * que permite que la URL y la vista no puedan desincronizarse — hay una sola
 * escritura de `?tab/op/opt/server` y una sola lectura al arrancar.
 *
 * Ciclo: leer config → cargar spec → agrupar → pintar. Un fallo en cualquiera
 * de los pasos se enseña en pantalla con la URL que falló, no en la consola.
 */
import type { SwConn } from '../../js/conn.js';
import './sw-nav.js';
import './sw-info.js';
import './sw-server.js';
import './sw-tag-group.js';
declare class SwApp extends HTMLElement {
    #private;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    get doc(): unknown;
    set doc(v: unknown);
    get conn(): SwConn | null;
    set conn(v: SwConn | null);
}
export { SwApp };
