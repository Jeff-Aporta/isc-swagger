import{crearComponente as e,define as c,html as n,raw as d}from"./_shared.js";import{renderMarkdown as m}from"../../js/markdown.js";const a=e(import.meta.url,(o,{markdown:i,vacio:t})=>{const r=String(i??"").trim();if(!r){o.append(n`
        <is-callout color="neutral" variant="plain" icon="mdi:book-off-outline">${t}</is-callout>
      `);return}o.append(n`<div class="prosa">${d(m(r))}</div>`)},{markdown:"",vacio:"Esta operaci\xF3n no trae documentaci\xF3n en el documento."},"sw-doc");c("sw-doc",a);export{a as SwDoc};
