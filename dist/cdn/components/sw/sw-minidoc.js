import{adoptCss as a,precargarCss as h,define as u,html as n,avisar as c}from"./_shared.js";import{loadViewerDocument as m,resolveBootConfig as g}from"../../js/config.js";import{buildDocIndex as f,groupOperationsByTag as w,operationRequiresBearer as l,sortGroupsBySpecOrder as v}from"../../js/openapi.js";import{filterGroupsByQuery as b}from"../../js/nav.js";import{inferDefaultServerBase as S,readServerFromUrl as E}from"../../js/server-base.js";import{mergeUrlState as y,readUrlState as C,subscribeUrlState as $}from"../../js/url-state.js";import{getStoredJwt as M,resolveAuthConfig as L}from"../../js/auth.js";import"./sw-method.js";import"./sw-auth.js";import"./sw-layout.js";import"./sw-driver-switch.js";import"./sw-doc-actions.js";import"./sw-minidoc-view.js";import"./sw-minidoc-code.js";class d extends HTMLElement{#s;#n={};#i={};#e=null;#r=[];#b={};#l=null;#d="";#t="";#S="";#a="cargando";#p="";#h=!1;#u=null;#o=null;#c=null;#m=null;#g=null;#E=()=>{this.#f({force:!0})};constructor(){super(),this.#s=this.attachShadow({mode:"open"})}get conn(){return this.#g}set conn(t){this.#g=t&&typeof t=="object"?t:null,this.isConnected&&this.#f()}#M(){const t=this.getAttribute("conn");if(!t?.trim())return null;try{const s=JSON.parse(t);return s&&typeof s=="object"?s:null}catch{return null}}connectedCallback(){this.#t=C().op,this.#m=$(t=>{const s=this.#y(t.op);s!==this.#t&&(this.#t=s,this.#v())}),this.addEventListener("sw-doc-reload",this.#E),this.#$(),this.#f()}disconnectedCallback(){this.removeEventListener("sw-doc-reload",this.#E),this.#m?.(),this.#m=null}async#f(t={}){if(!(t.force&&this.#h)){t.force&&(this.#h=!0,c("Actualizando documentaci\xF3n\u2026","brand"));try{const s=g(this.#g??this.#M()),{config:i,spec:e}=await m(s,{force:t.force});this.#n=i,this.#i=L(i),this.#e=e,this.#r=v(w(e),e),this.#b=f(e),this.#l=this.#i.enabled?M():null,this.#d=E()||S(e,i),this.#t=this.#y(this.#t),this.#a="listo",t.force&&c("Documentaci\xF3n actualizada","success")}catch(s){this.#a="error",this.#p=s?.message??String(s),t.force&&c(this.#p,"danger")}finally{this.#h=!1}this.#$()}}get#w(){return this.#r.flatMap(t=>t.operations)}#y(t){return t&&this.#w.some(s=>s.operationId===t)?t:this.#w[0]?.operationId??""}get#L(){return b(this.#r,this.#S)}get#T(){return this.#w.find(t=>t.operationId===this.#t)??null}get#k(){const t=this.#t;return this.#r.find(s=>s.operations.some(i=>i.operationId===t))?.name??""}#I(t){t!==this.#t&&(this.#t=t,y({op:t}),this.#v())}#v(){for(const i of this.#s.querySelectorAll(".op"))i.toggleAttribute("data-activo",i.dataset.op===this.#t);const t=this.#T,s=this.#i.enabled&&l(t??void 0,this.#e);this.#o&&(this.#o.props={op:t,spec:this.#e,grupo:this.#k,serverBase:this.#d,authEnabled:this.#i.enabled,docMd:t?this.#b[t.operationId]??"":""}),this.#c&&(this.#c.props={op:t,spec:this.#e,serverBase:this.#d,requiereBearer:s}),this.#o?.scrollIntoView({block:"start"})}#H(t){const s=document.createElement("sw-method");s.props={method:t.method};const i=String(t.path||""),o=this.#i.enabled&&l(t,this.#e)?n`<is-icon class="op-lock" icon="mdi:lock" title="Requiere JWT" aria-label="Requiere JWT"></is-icon>`:n`<span class="op-lock op-lock--vacio" aria-hidden="true"></span>`;return n`
      <button
        type="button"
        class="op"
        data-op="${t.operationId}"
        title="${i}"
        ${t.operationId===this.#t?"data-activo":""}
        onclick=${()=>this.#I(t.operationId)}
      >
        ${o}
        ${s}
        <span class="op-texto">
          <span class="op-nombre">${t.summary||t.operationId}</span>
          <span class="op-path">${i}</span>
        </span>
      </button>
    `}#C(){const t=this.#u;if(!t)return;const s=this.#L.map(i=>{const e=i.subgroups.length?i.subgroups.flatMap(o=>o.operations):i.operations;return n`
        <section class="grupo">
          <h3 class="grupo-titulo">${i.name}</h3>
          ${e.map(o=>this.#H(o))}
        </section>
      `});t.replaceChildren(...s.length?s:[n`<p class="sin-resultados">Sin coincidencias.</p>`])}#$(){if(this.#s.replaceChildren(),this.#u=null,this.#o=null,this.#c=null,this.#a==="cargando"){this.#s.append(n`<div class="centrado"><is-spinner></is-spinner></div>`),a(this.#s,import.meta.url,"sw-minidoc");return}if(this.#a==="error"){this.#s.append(n`
        <div class="centrado">
          <is-callout color="danger" variant="outlined">
            <strong>No se pudo cargar la documentación.</strong>
            <p>${this.#p}</p>
          </is-callout>
        </div>
      `),a(this.#s,import.meta.url,"sw-minidoc");return}const t=this.#n.brand?.title||this.#e?.info?.title||"API",s=document.createElement("sw-minidoc-view"),i=document.createElement("sw-minidoc-code"),e=document.createElement("sw-auth");e.props={authEnabled:this.#i.enabled,auth:this.#i,session:this.#l},e.addEventListener("sw-session-change",r=>{this.#l=r.detail?.session??null});const o=document.createElement("sw-doc-actions");o.props={spec:this.#e,config:this.#n};const p=this.#n.brand?.icon||"mdi:api";this.#s.append(n`
      <sw-layout>
        <div slot="cabecera" class="cabecera">
          <span class="marca">
            <is-icon class="marca-logo" icon="${p}"></is-icon>
            <span class="marca-texto">${t}</span>
          </span>
          <is-input
            class="buscar"
            type="search"
            placeholder="Buscar endpoint…"
            onis-input=${r=>{this.#S=String(r.target.value??""),this.#C()}}
          ></is-input>
          ${e}
          ${o}
          <sw-driver-switch></sw-driver-switch>
          <is-theme-toggle></is-theme-toggle>
        </div>

        <nav slot="inicio" class="indice" aria-label="Índice de endpoints"></nav>
        <div slot="centro">${s}</div>
        <div slot="fin">${i}</div>
      </sw-layout>
    `),this.#u=this.#s.querySelector(".indice"),this.#o=s,this.#c=i,this.#C(),this.#v(),a(this.#s,import.meta.url,"sw-minidoc")}}h(import.meta.url,"sw-minidoc"),u("sw-minidoc",d);export{d as SwMinidoc};
