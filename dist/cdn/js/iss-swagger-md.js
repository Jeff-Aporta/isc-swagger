import{convertIsCodeToFences as v}from"./postman-md.js";import{ISS_SWAGGER_METHODS as L}from"./iss-swagger-doc.js";const S=/<(?:is-flowchart|is-sequence-diagram|is-er-diagram)\b[\s\S]*?<\/(?:is-flowchart|is-sequence-diagram|is-er-diagram)>/gi,b=/<\/?[a-z][\s\S]*?>/gi;function n(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function r(e){return typeof e=="string"?e.trim():""}function A(e){return e.toLowerCase().normalize("NFD").replace(/\p{M}/gu,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}function y(e){let t=v(String(e??""));return t=t.replace(S,`

_(Diagrama: ver el visor HTML \`/is-swagger\`.)_

`),t=t.replace(/<script\b[\s\S]*?<\/script>/gi,""),t=t.replace(b,""),t.replace(/\n{3,}/g,`

`).trim()}function R(e){if(!n(e))return{};if(n(e.meta)||n(e.general)||n(e.config)&&e.config.kind==="config"||n(e.paths)&&e.paths.kind==="paths"){const o=n(e.meta)?e.meta:{},c=n(e.paths)?e.paths:{},g=n(e.config)?e.config:{},s=n(g.catalog)?g.catalog:{},d=n(e.general)?e.general:{},m=n(o.info)?o.info:void 0,p=Array.isArray(d.secciones)?d.secciones:void 0;return{info:m,paths:n(c.paths)?c.paths:void 0,docs:n(s.docs)?s.docs:void 0,general:{titulo:r(d.titulo)||void 0,resumen:r(d.resumen)||void 0,secciones:p}}}const t=n(e.catalog)?e.catalog:{};return{info:n(e.info)?e.info:void 0,paths:n(e.paths)?e.paths:void 0,docs:n(t.docs)?t.docs:n(e.docs)?e.docs:void 0}}function M(e){const t=[];for(const o of L)n(e[o])&&t.push([o,e[o]]);return t}function z(e){const t=R(e),o=r(t.info?.title)||r(t.general?.titulo)||"API",c=r(t.info?.description)||r(t.general?.resumen),g=r(t.info?.version),s=[];s.push(`# ${o}`),s.push(""),c&&(s.push(c),s.push("")),g&&s.push(`Versi\xF3n **${g}**.`),s.push("Documento generado desde IS-Swagger para agentes. El visor humano es `/is-swagger`; esta p\xE1gina es `/LLM.md`."),s.push(""),s.push("## \xCDndice"),s.push("");const d=t.paths??{},m=new Map;for(const[a,f]of Object.entries(d))if(n(f))for(const[i,u]of M(f)){const h=(Array.isArray(u.tags)?u.tags.map($=>r($)).filter(Boolean):[])[0]||"API",k={ruta:a,method:i.toUpperCase(),summary:r(u.summary)||`${i.toUpperCase()} ${a}`,doc:r(u.doc)||void 0,security:r(u.security)||void 0,description:r(u.description)||void 0},w=m.get(h)??[];w.push(k),m.set(h,w)}for(const a of m.keys())s.push(`- [${a}](#${A(a)})`);if(s.push(""),t.general?.secciones?.length){s.push("## Contexto"),s.push("");for(const a of t.general.secciones)r(a.titulo)&&s.push(`### ${a.titulo}`),r(a.markdown)&&(s.push(""),s.push(y(a.markdown)),s.push(""))}const p=t.docs??{};for(const[a,f]of m){s.push(`## ${a}`),s.push("");for(const i of f)s.push(`### \`${i.method}\` \`${i.ruta}\``),s.push(""),s.push(`**${i.summary}**`),i.security==="bearer"&&s.push(""),i.security==="bearer"&&s.push("_Requiere Bearer JWT._"),i.description&&i.description!==i.summary&&(s.push(""),s.push(i.description)),i.doc&&r(p[i.doc])&&(s.push(""),s.push(y(p[i.doc]))),s.push("")}return s.join(`
`).replace(/\n{3,}/g,`

`).trim()+`
`}function C(e){const t=l(e.title||"API \xB7 LLM.md"),o=l(e.llmMdHref||"LLM.md"),c=String(e.kitCdn||"").replace(/\/+$/,""),g=r(e.kitPin),s=l(e.palette||"contapyme"),d=g&&g!=="main"?`L.pin('${l(g)}');`:"";return`<!DOCTYPE html>
<html lang="es" data-theme="dark" data-palette="${s}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${t}</title>
<meta name="robots" content="noindex"/>
<link rel="stylesheet" href="${l(c)}/is-base.min.css"/>
<link rel="stylesheet" href="${l(c)}/palettes.min.css"/>
<style>
  html,body{margin:0;min-height:100%;font-family:var(--is-font-sans,system-ui,sans-serif)}
  .llm-view{max-width:52rem;margin:0 auto;padding:1.25rem 1.5rem 3rem}
  .llm-view__hdr{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1.25rem}
  .llm-view__hdr h1{margin:0;font-size:1.15rem;font-weight:650}
  .llm-view a{color:var(--is-accent,#38bdf8)}
</style>
</head>
<body>
<main class="llm-view">
  <header class="llm-view__hdr">
    <h1>${t}</h1>
    <a href="${o}">LLM.md</a>
  </header>
  <is-callout tone="info">Esto es lo que leen los agentes en <code>${o}</code>. El visor interactivo es <a href="is-swagger">/is-swagger</a>.</is-callout>
  <is-md-render readonly placeholder="Cargando\u2026"></is-md-render>
</main>
<script type="module">
import { ISWebComponentsLoader as L } from '${l(c)}/loader.min.js';
${d}
await L.load('is-md-render','is-callout','is-icon');
const el = document.querySelector('is-md-render');
const r = await fetch('${o}', { headers: { accept: 'text/markdown, text/plain;q=0.9' } });
el.value = r.ok ? await r.text() : '# Error\\nNo se pudo cargar ' + '${o}' + ' (' + r.status + ').';
<\/script>
</body>
</html>`}function l(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}export{C as buildIssSwaggerLlmViewHtml,y as issDocToLlmMarkdown,z as issSwaggerToMarkdown};
