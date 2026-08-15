import{crearComponente as i,define as a,emitir as c,html as l}from"./_shared.js";const o=i(import.meta.url,(e,n,r)=>{e.append(l`
      <is-button
        class="btn"
        variant="plain"
        color="neutral"
        aria-label="Actualizar documentación"
        title="Actualizar desde el servidor (ignora cache local de 24 h)"
        onis-click=${()=>c(r,"sw-doc-reload",null)}
      >
        <is-icon icon="mdi:refresh"></is-icon>
      </is-button>
    `)},{},"sw-doc-reload");a("sw-doc-reload",o);export{o as SwDocReload};
