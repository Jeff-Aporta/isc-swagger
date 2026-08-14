import{adoptCss as l,precargarCss as h,define as g,html as p,emitir as d}from"./_shared.js";import"./sw-operation.js";class c extends HTMLElement{#e;#t={group:null,spec:null,serverBase:"",authEnabled:!1,docIndex:{},opAbierta:"",opTab:"try"};#s=new Map;constructor(){super(),this.#e=this.attachShadow({mode:"open"})}connectedCallback(){this.#o()}get props(){return this.#t}set props(t){const e={...this.#t};if(this.#t={...this.#t,...t??{}},!this.isConnected)return;e.group===this.#t.group&&e.spec===this.#t.spec&&e.docIndex===this.#t.docIndex?this.#r():this.#o()}#r(){const{opAbierta:t,opTab:e,serverBase:o,authEnabled:s}=this.#t;for(const[a,i]of this.#s)i.props={abierto:a===t,tab:e,serverBase:o,authEnabled:s}}#n(t){const{spec:e,serverBase:o,authEnabled:s,docIndex:a,opAbierta:i,opTab:u}=this.#t,r=document.createElement("sw-operation");return r.props={op:t,spec:e,serverBase:o,authEnabled:s,docMd:a?.[t.operationId]??"",abierto:t.operationId===i,tab:u},r.addEventListener("sw-op-toggle",n=>d(this,"sw-op-toggle",n.detail)),r.addEventListener("sw-op-tab",n=>d(this,"sw-op-tab",n.detail)),r.addEventListener("sw-need-login",n=>d(this,"sw-need-login",n.detail)),this.#s.set(t.operationId,r),r}#o(){const{group:t}=this.#t;if(this.#e.replaceChildren(),this.#s.clear(),!t){l(this.#e,import.meta.url,"sw-tag-group");return}const e=t.subgroups.length?t.subgroups.flatMap(s=>s.operations):t.operations,o=p`<div class="operaciones">${e.map(s=>this.#n(s))}</div>`;this.#e.append(p`
      <section class="grupo">
        <header class="cabecera">
          <h2 class="titulo">
            ${t.name}
            <span class="contador">${t.operations.length}</span>
          </h2>
          ${t.description?p`<p class="descripcion">${t.description}</p>`:null}
        </header>
        ${o}
      </section>
    `),l(this.#e,import.meta.url,"sw-tag-group")}}h(import.meta.url,"sw-tag-group"),g("sw-tag-group",c);export{c as SwTagGroup};
