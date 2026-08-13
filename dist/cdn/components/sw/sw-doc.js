import{crearComponente as c,define as s,html as n}from"./_shared.js";const r=c(import.meta.url,(t,{markdown:a,vacio:i})=>{const o=String(a??"").trim();if(!o){t.append(n`
        <is-callout color="neutral" variant="plain" icon="mdi:book-off-outline">${i}</is-callout>
      `);return}const e=document.createElement("is-md-render");e.className="md",e.setAttribute("readonly",""),e.setAttribute("value",o),t.append(n`<div class="prosa">${e}</div>`)},{markdown:"",vacio:"Esta operaci\xF3n no trae documentaci\xF3n en el documento."},"sw-doc");s("sw-doc",r);export{r as SwDoc};
