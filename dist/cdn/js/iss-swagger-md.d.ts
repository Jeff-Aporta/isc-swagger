/** Prosa para el modelo: sin web components, fences de is-code. */
export declare function issDocToLlmMarkdown(md: string): string;
/** Markdown canónico para GET /LLM.md. */
export declare function issSwaggerToMarkdown(input: unknown): string;
export type IssSwaggerLlmViewOpts = {
    title?: string;
    /** Href same-origin del markdown (p. ej. `/api/LLM.md`). */
    llmMdHref?: string;
    /** Raíz CDN del kit, con `/dist/cdn`. */
    kitCdn: string;
    kitPin?: string;
    palette?: string;
};
/** Página HTML: `<is-md-render>` pinta el GET /LLM.md. */
export declare function buildIssSwaggerLlmViewHtml(opts: IssSwaggerLlmViewOpts): string;
