import{adoptCss as c,precargarCss as h,define as g,html as a,emitir as d}from"./_shared.js";import"./sw-operation.js";class l extends HTMLElement{#e;#s={group:null,spec:null,serverBase:"",authEnabled:!1,docIndex:{},opAbierta:"",opTab:"try"};#o=new Map;constructor(){super(),this.#e=this.attachShadow({mode:"open"})}connectedCallback(){this.#r()}get props(){return this.#s}set props(s){const o={...this.#s};if(this.#s={...this.#s,...s??{}},!this.isConnected)return;o.group===this.#s.group&&o.spec===this.#s.spec&&o.docIndex===this.#s.docIndex?this.#n():this.#r()}#n(){const{opAbierta:s,opTab:o,serverBase:e,authEnabled:r}=this.#s;for(const[i,p]of this.#o)p.props={abierto:i===s,tab:o,serverBase:e,authEnabled:r}}#t(s){const{spec:o,serverBase:e,authEnabled:r,docIndex:i,opAbierta:p,opTab:u}=this.#s,t=document.createElement("sw-operation");return t.props={op:s,spec:o,serverBase:e,authEnabled:r,docMd:i?.[s.operationId]??"",abierto:s.operationId===p,tab:u},t.addEventListener("sw-op-toggle",n=>d(this,"sw-op-toggle",n.detail)),t.addEventListener("sw-op-tab",n=>d(this,"sw-op-tab",n.detail)),t.addEventListener("sw-need-login",n=>d(this,"sw-need-login",n.detail)),this.#o.set(s.operationId,t),t}#r(){const{group:s}=this.#s;if(this.#e.replaceChildren(),this.#o.clear(),!s){c(this.#e,import.meta.url,"sw-tag-group");return}const o=s.subgroups.length?a`
          <div class="subgrupos">
            ${s.subgroups.map(e=>a`
                <section class="subgrupo">
                  <h3 class="subgrupo-titulo">
                    <is-icon icon="${e.icon??"mdi:folder-outline"}"></is-icon>
                    ${e.name??e.id}
                    <span class="contador">${e.operations.length}</span>
                  </h3>
                  <div class="operaciones">${e.operations.map(r=>this.#t(r))}</div>
                </section>
              `)}
          </div>
        `:a`<div class="operaciones">${s.operations.map(e=>this.#t(e))}</div>`;this.#e.append(a`
      <section class="grupo">
        <header class="cabecera">
          <h2 class="titulo">
            ${s.name}
            <span class="contador">${s.operations.length}</span>
          </h2>
          ${s.description?a`<p class="descripcion">${s.description}</p>`:null}
        </header>
        ${o}
      </section>
    `),c(this.#e,import.meta.url,"sw-tag-group")}}h(import.meta.url,"sw-tag-group"),g("sw-tag-group",l);export{l as SwTagGroup};
