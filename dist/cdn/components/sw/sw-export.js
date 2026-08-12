import{crearComponente as m,define as d,html as n,avisar as p}from"./_shared.js";import{buildExportFormats as u,descargarTexto as g}from"../../js/export.js";const r=m(import.meta.url,(s,{spec:a,config:l})=>{const t=u(a,l??{});t.length&&s.append(n`
      <is-dropdown
        class="menu"
        placement="bottom-end"
        onis-select=${o=>{const c=o.detail?.item?.getAttribute("value"),i=t.find(e=>e.id===c);if(i)try{g(i.filename,i.build())}catch(e){p(`No se pudo generar el archivo: ${e?.message??e}`,"danger")}}}
      >
        <is-button slot="trigger" variant="plain" color="neutral" pill aria-label="Descargar documento">
          <is-icon icon="mdi:download-outline"></is-icon>
        </is-button>
        ${t.map(o=>n`
            <is-dropdown-item value="${o.id}">
              <is-icon slot="icon" icon="${o.icon}"></is-icon>
              ${o.label}
            </is-dropdown-item>
          `)}
      </is-dropdown>
    `)},{spec:null,config:{}},"sw-export");d("sw-export",r);export{r as SwExport};
