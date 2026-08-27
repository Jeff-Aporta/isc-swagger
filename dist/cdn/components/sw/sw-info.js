import{crearComponente as t,define as c,html as o}from"./_shared.js";import"./sw-doc.js";const i=t(import.meta.url,(r,{spec:l})=>{const n=l?.info;if(!n)return;const s=String(n.description??"").trim();let e=null;s&&(e=document.createElement("sw-doc"),e.props={markdown:s}),r.append(o`
      <header class="info">
        <div class="linea">
          <h1 class="titulo">${n.title??"API"}</h1>
          ${n.version?o`<span class="version">v${n.version}</span>`:null}
        </div>
        ${e?o`<div class="descripcion">${e}</div>`:null}
      </header>
    `)},{spec:null},"sw-info");c("sw-info",i);export{i as SwInfo};
