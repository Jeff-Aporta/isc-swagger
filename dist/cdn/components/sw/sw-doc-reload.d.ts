/**
 * <sw-doc-reload> — actualiza el documento desde la API (invalida cache 24 h).
 *
 * Solo icono. Emite `sw-doc-reload`; `sw-app` / `sw-minidoc` escuchan y
 * vuelven a `loadViewerDocument({ force: true })`.
 */
declare const SwDocReload: CustomElementConstructor;
export { SwDocReload };
