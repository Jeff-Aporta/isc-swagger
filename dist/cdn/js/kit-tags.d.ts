/**
 * kit-tags.ts — tags `is-*` que el visor carga con el loader del kit.
 *
 * Fuente de verdad para hosts (ISS PatyIA, demos, Pages): se publica en
 * `dist/cdn/js/kit-tags.js` y se importa antes de `L.load(...SW_KIT_TAGS)`.
 *
 * Si un `sw-*` empieza a usar otro tag del kit, añadirlo **aquí** (y en LLM.md).
 * No duplicar la lista en el host: sin el tag el custom element no hace upgrade.
 */
export declare const SW_KIT_TAGS: readonly ["is-button", "is-button-group", "is-copy-button", "is-dropdown", "is-dropdown-item", "is-checkbox", "is-input", "is-option", "is-select", "is-textarea", "is-file-input", "is-spinner", "is-tag", "is-theme-toggle", "is-toast", "is-format-bytes", "is-format-date", "is-format-number", "is-relative-time", "is-callout", "is-details", "is-dialog", "is-divider", "is-drawer", "is-split-panel", "is-icon", "is-code", "is-md-render", "is-flowchart", "is-sequence-diagram", "is-er-diagram", "is-diagram-lightbox"];
export type SwKitTag = (typeof SW_KIT_TAGS)[number];
