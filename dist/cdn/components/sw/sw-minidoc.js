import{adoptCss as c,precargarCss as h,define as u,html as n,avisar as l}from"./_shared.js";import{loadViewerDocument as m,resolveBootConfig as f}from"../../js/config.js";import{buildDocIndex as g,groupOperationsByTag as w,operationRequiresBearer as d,sortGroupsBySpecOrder as v}from"../../js/openapi.js";import{filterGroupsByQuery as b}from"../../js/nav.js";import{inferDefaultServerBase as S,readServerFromUrl as E}from"../../js/server-base.js";import{mergeUrlState as y,readUrlState as C,subscribeUrlState as $}from"../../js/url-state.js";import{getStoredJwt as M,resolveAuthConfig as L}from"../../js/auth.js";import"./sw-method.js";import"./sw-auth.js";import"./sw-layout.js";import"./sw-driver-switch.js";import"./sw-export.js";import"./sw-doc-reload.js";import"./sw-minidoc-view.js";import"./sw-minidoc-code.js";class p extends HTMLElement{#s;#o={};#e={};#i=null;#r=[];#b={};#l=null;#d="";#t="";#S="";#a="cargando";#p="";#h=!1;#u=null;#n=null;#c=null;#m=null;#f=null;#E=()=>{this.#g({force:!0})};constructor(){super(),this.#s=this.attachShadow({mode:"open"})}get conn(){return this.#f}set conn(t){this.#f=t&&typeof t=="object"?t:null,this.isConnected&&this.#g()}#$(){const t=this.getAttribute("conn");if(!t?.trim())return null;try{const s=JSON.parse(t);return s&&typeof s=="object"?s:null}catch{return null}}connectedCallback(){this.#t=C().op,this.#m=$(t=>{t.op!==this.#t&&(this.#t=t.op,this.#v())}),this.addEventListener("sw-doc-reload",this.#E),this.#C(),this.#g()}disconnectedCallback(){this.removeEventListener("sw-doc-reload",this.#E),this.#m?.(),this.#m=null}async#g(t={}){if(!(t.force&&this.#h)){t.force&&(this.#h=!0,l("Actualizando documentaci\xF3n\u2026","brand"));try{const s=f(this.#f??this.#$()),{config:e,spec:i}=await m(s,{force:t.force});if(this.#o=e,this.#e=L(e),this.#i=i,this.#r=v(w(i),i),this.#b=g(i),this.#l=this.#e.enabled?M():null,this.#d=E()||S(i,e),!this.#t){const o=String(this.#o.defaultOp??"").trim(),a=o&&this.#w.some(r=>r.operationId===o);this.#t=a?o:this.#w[0]?.operationId??""}this.#a="listo",t.force&&l("Documentaci\xF3n actualizada","success")}catch(s){this.#a="error",this.#p=s?.message??String(s),t.force&&l(this.#p,"danger")}finally{this.#h=!1}this.#C()}}get#w(){return this.#r.flatMap(t=>t.operations)}get#M(){return b(this.#r,this.#S)}get#L(){return this.#w.find(t=>t.operationId===this.#t)??null}get#T(){const t=this.#t;return this.#r.find(s=>s.operations.some(e=>e.operationId===t))?.name??""}#k(t){t!==this.#t&&(this.#t=t,y({op:t}),this.#v())}#v(){for(const e of this.#s.querySelectorAll(".op"))e.toggleAttribute("data-activo",e.dataset.op===this.#t);const t=this.#L,s=this.#e.enabled&&d(t??void 0,this.#i);this.#n&&(this.#n.props={op:t,spec:this.#i,grupo:this.#T,serverBase:this.#d,authEnabled:this.#e.enabled,docMd:t?this.#b[t.operationId]??"":""}),this.#c&&(this.#c.props={op:t,spec:this.#i,serverBase:this.#d,requiereBearer:s}),this.#n?.scrollIntoView({block:"start"})}#I(t){const s=document.createElement("sw-method");s.props={method:t.method};const e=String(t.path||""),o=this.#e.enabled&&d(t,this.#i)?n`<is-icon class="op-lock" icon="mdi:lock" title="Requiere JWT" aria-label="Requiere JWT"></is-icon>`:n`<span class="op-lock op-lock--vacio" aria-hidden="true"></span>`;return n`
      <button
        type="button"
        class="op"
        data-op="${t.operationId}"
        title="${e}"
        ${t.operationId===this.#t?"data-activo":""}
        onclick=${()=>this.#k(t.operationId)}
      >
        ${o}
        ${s}
        <span class="op-texto">
          <span class="op-nombre">${t.summary||t.operationId}</span>
          <span class="op-path">${e}</span>
        </span>
      </button>
    `}#y(){const t=this.#u;if(!t)return;const s=this.#M.map(e=>{const i=e.subgroups.length?e.subgroups.flatMap(o=>o.operations):e.operations;return n`
        <section class="grupo">
          <h3 class="grupo-titulo">${e.name}</h3>
          ${i.map(o=>this.#I(o))}
        </section>
      `});t.replaceChildren(...s.length?s:[n`<p class="sin-resultados">Sin coincidencias.</p>`])}#C(){if(this.#s.replaceChildren(),this.#u=null,this.#n=null,this.#c=null,this.#a==="cargando"){this.#s.append(n`<div class="centrado"><is-spinner></is-spinner></div>`),c(this.#s,import.meta.url,"sw-minidoc");return}if(this.#a==="error"){this.#s.append(n`
        <div class="centrado">
          <is-callout color="danger" variant="outlined">
            <strong>No se pudo cargar la documentación.</strong>
            <p>${this.#p}</p>
          </is-callout>
        </div>
      `),c(this.#s,import.meta.url,"sw-minidoc");return}const t=this.#o.brand?.title||this.#i?.info?.title||"API",s=document.createElement("sw-minidoc-view"),e=document.createElement("sw-minidoc-code"),i=document.createElement("sw-auth");i.props={authEnabled:this.#e.enabled,auth:this.#e,session:this.#l},i.addEventListener("sw-session-change",r=>{this.#l=r.detail?.session??null});const o=document.createElement("sw-export");o.props={spec:this.#i,config:this.#o};const a=this.#o.brand?.icon||"mdi:api";this.#s.append(n`
      <sw-layout>
        <div slot="cabecera" class="cabecera">
          <span class="marca">
            <is-icon class="marca-logo" icon="${a}"></is-icon>
            <span class="marca-texto">${t}</span>
          </span>
          <is-input
            class="buscar"
            type="search"
            placeholder="Buscar endpoint…"
            onis-input=${r=>{this.#S=String(r.target.value??""),this.#y()}}
          ></is-input>
          ${i}
          ${o}
          <sw-doc-reload></sw-doc-reload>
          <sw-driver-switch></sw-driver-switch>
          <is-theme-toggle></is-theme-toggle>
        </div>

        <nav slot="inicio" class="indice" aria-label="Índice de endpoints"></nav>
        <div slot="centro">${s}</div>
        <div slot="fin">${e}</div>
      </sw-layout>
    `),this.#u=this.#s.querySelector(".indice"),this.#n=s,this.#c=e,this.#y(),this.#v(),c(this.#s,import.meta.url,"sw-minidoc")}}h(import.meta.url,"sw-minidoc"),u("sw-minidoc",p);export{p as SwMinidoc};
