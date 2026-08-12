import{crearComponente as v,define as d,html as s,emitir as m}from"./_shared.js";import{normalizeServerBase as u}from"../../js/server-base.js";const n=v(import.meta.url,(a,{value:l,options:c},p)=>{const i=(c??[]).filter(Boolean),r=String(l??""),o=e=>{const t=u(e);t!==r&&m(p,"sw-server-change",{serverBase:t})};a.append(s`
      <div class="barra">
        <label class="etiqueta" for="server">Servidor</label>
        <is-input
          id="server"
          class="campo"
          full-width
          spellcheck="false"
          placeholder="https://host/api"
          value="${r}"
          onis-change=${e=>o(String(e.target.value??""))}
        ></is-input>
        ${i.length>1?s`
              <is-dropdown
                class="atajos"
                onis-select=${e=>{const t=e.detail?.item;t&&o(t.getAttribute("value")??"")}}
              >
                <is-button slot="trigger" variant="outlined" color="neutral" with-caret>Conocidos</is-button>
                ${i.map(e=>s`
                    <is-dropdown-item type="checkbox" value="${e}" ${e===r?"checked":""}>
                      ${e}
                    </is-dropdown-item>
                  `)}
              </is-dropdown>
            `:null}
      </div>
    `)},{value:"",options:[]},"sw-server");d("sw-server",n);export{n as SwServer};
