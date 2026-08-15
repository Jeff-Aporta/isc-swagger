import{crearComponente as l,define as p,html as r,avisar as n}from"./_shared.js";import{buildExportFormats as u,descargarTexto as g}from"../../js/export.js";const a=l(import.meta.url,(s,{spec:c,config:d})=>{const i=u(c,d??{});i.length&&s.append(r`
      <is-dropdown
        class="menu"
        placement="bottom-end"
        onis-select=${e=>{const m=e.detail?.item?.getAttribute("value"),t=i.find(o=>o.id===m);t&&(async()=>{try{t.id==="postman"&&n("Generando Postman (diagramas \u2192 PNG)\u2026","brand");const o=await Promise.resolve(t.build());g(t.filename,o),n(`Descargado: ${t.filename}`,"success")}catch(o){n(`No se pudo generar el archivo: ${o?.message??o}`,"danger")}})()}}
      >
        <is-button slot="trigger" variant="plain" color="neutral" aria-label="Descargar documento" title="Descargar documento">
          <is-icon icon="mdi:download-outline"></is-icon>
        </is-button>
        ${i.map(e=>r`
            <is-dropdown-item value="${e.id}">
              <is-icon slot="icon" icon="${e.icon}"></is-icon>
              ${e.label}
            </is-dropdown-item>
          `)}
      </is-dropdown>
    `)},{spec:null,config:{}},"sw-export");p("sw-export",a);export{a as SwExport};
