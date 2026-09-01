/**
 * <sw-doc> — prosa Markdown vía `<is-md-render>` (kit is-webcomponents).
 *
 * El host debe haber cargado el tag `is-md-render` (y los `is-*` que el MD
 * embute: `is-code`, `is-flowchart`, …). El cuerpo va en un
 * `<script type="text/markdown">` hijo — no en el atributo `value` — para
 * que HTML embebido (`<is-flowchart>`, `<is-code>`) no se rompa por comillas.
 */
declare const SwDoc: CustomElementConstructor;
export { SwDoc };
