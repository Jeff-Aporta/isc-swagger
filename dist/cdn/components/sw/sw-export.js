import{crearComponente as m,define as d,html as r,avisar as p}from"./_shared.js";import{buildExportFormats as u,descargarTexto as g}from"../../js/export.js";const n=m(import.meta.url,(s,{spec:a,config:c})=>{const t=u(a,c??{});t.length&&s.append(r`
      <is-dropdown
        class="menu"
        placement="bottom-end"
        onis-select=${o=>{const l=o.detail?.item?.getAttribute("value"),i=t.find(e=>e.id===l);if(i)try{g(i.filename,i.build())}catch(e){p(`No se pudo generar el archivo: ${e?.message??e}`,"danger")}}}
      >
        <is-button slot="trigger" variant="plain" color="neutral" aria-label="Descargar documento">
          <is-icon slot="start" icon="mdi:download-outline"></is-icon>
          Descargar
        </is-button>
        ${t.map(o=>r`
            <is-dropdown-item value="${o.id}">
              <is-icon slot="icon" icon="${o.icon}"></is-icon>
              ${o.label}
            </is-dropdown-item>
          `)}
      </is-dropdown>
    `)},{spec:null,config:{}},"sw-export");d("sw-export",n);export{n as SwExport};
