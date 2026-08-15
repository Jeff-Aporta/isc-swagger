import{crearComponente as a,define as r,emitir as l,html as c}from"./_shared.js";const o=a(import.meta.url,(e,t,i)=>{e.append(c`
      <is-button
        class="btn"
        variant="plain"
        color="neutral"
        aria-label="Actualizar documentación"
        title="Actualizar desde el servidor (ignora cache local de 24 h)"
        onis-click=${()=>l(i,"sw-doc-reload",null)}
      >
        <is-icon icon="mdi:refresh"></is-icon>
      </is-button>
    `)},{},"sw-doc-reload");r("sw-doc-reload",o);export{o as SwDocReload};
