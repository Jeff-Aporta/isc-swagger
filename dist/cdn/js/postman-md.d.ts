/**
 * postman-md.ts — convierte el markdown InSoft (`x-iss-doc-md`) a algo que
 * Postman pueda pintar: diagramas `is-*` → `<img src="data:image/png;base64,…">`
 * con fondo transparente, y `<is-code>` → fences ```lang.
 *
 * La rasterización de diagramas solo corre en el navegador (necesita el kit
 * cargado y un SVG real). Fuera de DOM, los bloques de diagrama se omiten con
 * un aviso en texto.
 */
/** Tags de diagrama del kit que el export sabe rasterizar. */
export declare const POSTMAN_DIAGRAM_TAGS: readonly ["is-flowchart", "is-sequence-diagram", "is-state-diagram", "is-block-diagram", "is-swimlane-diagram", "is-component-diagram", "is-class-diagram", "is-er-diagram", "is-mindmap", "is-gantt", "is-timeline", "is-org-chart", "is-journey-map", "is-sankey-diagram", "is-venn-diagram", "is-use-case-diagram", "is-quadrant-chart"];
/** `<is-code lang="http" value="…">` / hijos → fence markdown. */
export declare function convertIsCodeToFences(md: string): string;
/** SVG del shadow → PNG data-URL con fondo transparente. */
export declare function svgToTransparentPngDataUrl(svg: SVGSVGElement): Promise<string>;
/** Monta un bloque `is-*` offscreen, espera el SVG y lo pasa a PNG. */
export declare function rasterizeDiagramHtml(html: string): Promise<string | null>;
/** Sustituye cada diagrama del MD por `<img src="data:image/png;base64,…">`. */
export declare function convertDiagramsToPngImgs(md: string): Promise<string>;
/** Pipeline completo: diagramas → PNG, `is-code` → fences. */
export declare function issDocMdForPostman(md: string): Promise<string>;
export declare function opDocMd(op: Record<string, unknown> | null | undefined): string;
