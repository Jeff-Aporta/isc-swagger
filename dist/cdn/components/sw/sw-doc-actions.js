import{crearComponente as u,define as p,emitir as g,html as n,avisar as a}from"./_shared.js";import{buildExportFormats as b,descargarTexto as f}from"../../js/export.js";const r=u(import.meta.url,(s,{spec:c,config:l},d)=>{const t=b(c,l??{});s.append(n`
      <is-button-group class="grupo" pill label="Documento" aria-label="Documento">
        ${t.length?n`
              <is-dropdown
                class="dl"
                placement="bottom-end"
                onis-select=${i=>{const m=i.detail?.item?.getAttribute("value"),e=t.find(o=>o.id===m);e&&(async()=>{try{e.id==="postman"&&a("Generando Postman (diagramas \u2192 PNG)\u2026","brand");const o=await Promise.resolve(e.build());f(e.filename,o),a(`Descargado: ${e.filename}`,"success")}catch(o){a(`No se pudo generar el archivo: ${o?.message??o}`,"danger")}})()}}
              >
                <is-button
                  slot="trigger"
                  variant="plain"
                  color="neutral"
                  aria-label="Descargar documento"
                  title="Descargar documento"
                >
                  <is-icon icon="mdi:download-outline"></is-icon>
                </is-button>
                ${t.map(i=>n`
                    <is-dropdown-item value="${i.id}">
                      <is-icon slot="icon" icon="${i.icon}"></is-icon>
                      ${i.label}
                    </is-dropdown-item>
                  `)}
              </is-dropdown>
            `:null}
        <is-button
          class="rl"
          variant="plain"
          color="neutral"
          aria-label="Actualizar documentación"
          title="Actualizar desde el servidor (ignora cache local de 24 h)"
          onis-click=${()=>g(d,"sw-doc-reload",null)}
        >
          <is-icon icon="mdi:refresh"></is-icon>
        </is-button>
      </is-button-group>
    `)},{spec:null,config:{}},"sw-doc-actions");p("sw-doc-actions",r);export{r as SwDocActions};
