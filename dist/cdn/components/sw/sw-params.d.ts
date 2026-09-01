/**
 * <sw-params> — campos de los parámetros de una operación.
 *
 * Es un componente controlado: no guarda los valores, los emite en
 * `sw-param-change` y quien lo monta (`sw-try`) es el dueño del estado. Así
 * la URL de previsualización y la petición leen siempre la misma fuente.
 *
 * Props:
 *   params    SwParam[] ya resueltos (sin `$ref`)
 *   values    Record<string,string>
 *   disabled  boolean
 * Evento:
 *   sw-param-change  detail: { name, value }
 */
declare const SwParams: CustomElementConstructor;
export { SwParams };
