/**
 * <sw-driver-switch> — selector de presentación, para la cabecera.
 *
 * Vive suelto y no dentro de un driver porque los dos lo montan: `sw-minidoc` en su cabecera y
 * `sw-nav` en la de `sw-app`, en ambos casos a la izquierda del conmutador de tema. Si lo
 * tuviera uno de los dos, el otro tendría que importar a su hermano para no quedarse sin él.
 *
 * No monta nada: escribe la preferencia y emite `sw-driver-change`. Quien decide qué hacer con
 * eso es `sw-viewer`, que es el único que sabe dónde está montado el driver actual.
 */
declare const SwDriverSwitch: CustomElementConstructor;
export { SwDriverSwitch };
