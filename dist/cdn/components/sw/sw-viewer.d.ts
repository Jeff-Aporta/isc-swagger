/**
 * <sw-viewer> — monta el driver elegido y deja cambiarlo en caliente.
 *
 * El anfitrión ISS quema el documento en el atributo `doc` (JSON completo).
 * `conn` queda solo para demos / `?conn=`; PatyIA no lo usa.
 */
import type { SwConn } from '../../js/conn.js';
import { type SwDriver } from '../../js/driver.js';
import './sw-app.js';
import './sw-minidoc.js';
declare class SwViewer extends HTMLElement {
    #private;
    constructor();
    /** Conn del anfitrión. Se ignora si también hay `doc`. */
    get conn(): SwConn | null;
    set conn(v: SwConn | null);
    /** Documento InSoft/OpenAPI quemado (`doc=`). Si llega, `conn` se ignora. */
    get doc(): unknown;
    set doc(v: unknown);
    get driver(): SwDriver['id'];
    set driver(v: SwDriver['id']);
    connectedCallback(): void;
}
export { SwViewer };
