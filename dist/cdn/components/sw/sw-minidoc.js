import{adoptCss as a,precargarCss as p,define as h,html as n,avisar as c}from"./_shared.js";import{loadViewerDocument as m,resolveBootConfig as f}from"../../js/config.js";import{buildDocIndex as g,groupOperationsByTag as w,operationRequiresBearer as l,sortGroupsBySpecOrder as v}from"../../js/openapi.js";import{filterGroupsByQuery as b}from"../../js/nav.js";import{inferDefaultServerBase as S,readServerFromUrl as E}from"../../js/server-base.js";import{mergeUrlState as y,readUrlState as k,subscribeUrlState as C}from"../../js/url-state.js";import{getStoredJwt as $,resolveAuthConfig as M}from"../../js/auth.js";import"./sw-method.js";import"./sw-auth.js";import"./sw-layout.js";import"./sw-driver-switch.js";import"./sw-doc-actions.js";import"./sw-minidoc-view.js";import"./sw-minidoc-code.js";class d extends HTMLElement{#s;#n={};#e={};#i=null;#r=[];#S={};#d=null;#u="";#t="";#E="";#a="cargando";#p="";#h=!1;#m=null;#o=null;#c=null;#f=null;#g=null;#w=null;#y=()=>{this.#l({force:!0})};constructor(){super(),this.#s=this.attachShadow({mode:"open"})}get doc(){return this.#w}set doc(t){this.#w=t&&typeof t=="object"?t:null,this.isConnected&&this.#l()}#M(){const t=this.getAttribute("doc");if(!t?.trim())return null;try{const s=JSON.parse(t);return s&&typeof s=="object"?s:null}catch{return null}}get conn(){return this.#g}set conn(t){this.#g=t&&typeof t=="object"?t:null,this.isConnected&&this.#l()}#L(){const t=this.getAttribute("conn");if(!t?.trim())return null;try{const s=JSON.parse(t);return s&&typeof s=="object"?s:null}catch{return null}}connectedCallback(){this.#t=k().op,this.#f=C(t=>{const s=this.#k(t.op);s!==this.#t&&(this.#t=s,this.#b())}),this.addEventListener("sw-doc-reload",this.#y),this.#$(),this.#l()}disconnectedCallback(){this.removeEventListener("sw-doc-reload",this.#y),this.#f?.(),this.#f=null}async#l(t={}){if(!(t.force&&this.#h)){t.force&&(this.#h=!0,c("Actualizando documentaci\xF3n\u2026","brand"));try{const s=this.#w??this.#M(),e=f(s!=null?null:this.#g??this.#L(),s),{config:o,spec:i}=await m(e,{force:t.force});this.#n=o,this.#e=M(o),this.#i=i,this.#r=v(w(i),i),this.#S=g(i),this.#d=this.#e.enabled?$():null,this.#u=E()||S(i,o),this.#t=this.#k(this.#t),this.#a="listo",t.force&&c("Documentaci\xF3n actualizada","success")}catch(s){this.#a="error",this.#p=s?.message??String(s),t.force&&c(this.#p,"danger")}finally{this.#h=!1}this.#$()}}get#v(){return this.#r.flatMap(t=>t.operations)}#k(t){return t&&this.#v.some(s=>s.operationId===t)?t:this.#v[0]?.operationId??""}get#T(){return b(this.#r,this.#E)}get#A(){return this.#v.find(t=>t.operationId===this.#t)??null}get#I(){const t=this.#t;return this.#r.find(s=>s.operations.some(e=>e.operationId===t))?.name??""}#H(t){t!==this.#t&&(this.#t=t,y({op:t}),this.#b())}#b(){for(const e of this.#s.querySelectorAll(".op"))e.toggleAttribute("data-activo",e.dataset.op===this.#t);const t=this.#A,s=this.#e.enabled&&l(t??void 0,this.#i);this.#o&&(this.#o.props={op:t,spec:this.#i,grupo:this.#I,serverBase:this.#u,authEnabled:this.#e.enabled,docMd:t?this.#S[t.operationId]??"":""}),this.#c&&(this.#c.props={op:t,spec:this.#i,serverBase:this.#u,requiereBearer:s}),this.#o?.scrollIntoView({block:"start"})}#B(t){const s=document.createElement("sw-method");s.props={method:t.method};const e=String(t.path||""),i=this.#e.enabled&&l(t,this.#i)?n`<is-icon class="op-lock" icon="mdi:lock" title="Requiere JWT" aria-label="Requiere JWT"></is-icon>`:n`<span class="op-lock op-lock--vacio" aria-hidden="true"></span>`;return n`
      <button
        type="button"
        class="op"
        data-op="${t.operationId}"
        title="${e}"
        ${t.operationId===this.#t?"data-activo":""}
        onclick=${()=>this.#H(t.operationId)}
      >
        ${i}
        ${s}
        <span class="op-texto">
          <span class="op-nombre">${t.summary||t.operationId}</span>
          <span class="op-path">${e}</span>
        </span>
      </button>
    `}#C(){const t=this.#m;if(!t)return;const s=this.#T.map(e=>{const o=e.subgroups.length?e.subgroups.flatMap(i=>i.operations):e.operations;return n`
        <section class="grupo">
          <h3 class="grupo-titulo">${e.name}</h3>
          ${o.map(i=>this.#B(i))}
        </section>
      `});t.replaceChildren(...s.length?s:[n`<p class="sin-resultados">Sin coincidencias.</p>`])}#$(){if(this.#s.replaceChildren(),this.#m=null,this.#o=null,this.#c=null,this.#a==="cargando"){this.#s.append(n`<div class="centrado"><is-spinner></is-spinner></div>`),a(this.#s,import.meta.url,"sw-minidoc");return}if(this.#a==="error"){this.#s.append(n`
        <div class="centrado">
          <is-callout color="danger" variant="outlined">
            <strong>No se pudo cargar la documentación.</strong>
            <p>${this.#p}</p>
          </is-callout>
        </div>
      `),a(this.#s,import.meta.url,"sw-minidoc");return}const t=this.#n.brand?.title||this.#i?.info?.title||"API",s=document.createElement("sw-minidoc-view"),e=document.createElement("sw-minidoc-code"),o=document.createElement("sw-auth");o.props={authEnabled:this.#e.enabled,auth:this.#e,session:this.#d},o.addEventListener("sw-session-change",r=>{this.#d=r.detail?.session??null});const i=document.createElement("sw-doc-actions");i.props={spec:this.#i,config:this.#n};const u=this.#n.brand?.icon||"mdi:api";this.#s.append(n`
      <sw-layout>
        <div slot="cabecera" class="cabecera">
          <span class="marca">
            <is-icon class="marca-logo" icon="${u}"></is-icon>
            <span class="marca-texto">${t}</span>
          </span>
          <is-input
            class="buscar"
            type="search"
            placeholder="Buscar endpoint…"
            onis-input=${r=>{this.#E=String(r.target.value??""),this.#C()}}
          ></is-input>
          ${o}
          ${i}
          <sw-driver-switch></sw-driver-switch>
          <is-theme-toggle></is-theme-toggle>
        </div>

        <nav slot="inicio" class="indice" aria-label="Índice de endpoints"></nav>
        <div slot="centro">${s}</div>
        <div slot="fin">${e}</div>
      </sw-layout>
    `),this.#m=this.#s.querySelector(".indice"),this.#o=s,this.#c=e,this.#C(),this.#b(),a(this.#s,import.meta.url,"sw-minidoc")}}p(import.meta.url,"sw-minidoc"),h("sw-minidoc",d);export{d as SwMinidoc};
