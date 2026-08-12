import{crearComponente as r,define as c,html as o}from"./_shared.js";import"./sw-doc.js";const s=r(import.meta.url,(t,{spec:l})=>{const n=l?.info;if(!n)return;const i=String(n.description??"").trim();let e=null;i&&(e=document.createElement("sw-doc"),e.props={markdown:i}),t.append(o`
      <header class="info">
        <div class="linea">
          <h1 class="titulo">${n.title??"API"}</h1>
        </div>
        ${e?o`<is-details class="descripcion" variant="plain" summary="Descripción del documento">${e}</is-details>`:null}
      </header>
    `)},{spec:null},"sw-info");c("sw-info",s);export{s as SwInfo};
