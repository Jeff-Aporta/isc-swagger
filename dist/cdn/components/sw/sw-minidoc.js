import{adoptCss as a,precargarCss as c,define as p,html as r}from"./_shared.js";import{loadViewerDocument as d,resolveBootConfig as h}from"../../js/config.js";import{buildDocIndex as u,groupOperationsByTag as m,operationRequiresBearer as g,sortGroupsBySpecOrder as w}from"../../js/openapi.js";import{filterGroupsByQuery as f}from"../../js/nav.js";import{inferDefaultServerBase as v,readServerFromUrl as S}from"../../js/server-base.js";import{mergeUrlState as b,readUrlState as E,subscribeUrlState as y}from"../../js/url-state.js";import{getStoredJwt as C,resolveAuthConfig as M}from"../../js/auth.js";import"./sw-method.js";import"./sw-auth.js";import"./sw-layout.js";import"./sw-driver-switch.js";import"./sw-minidoc-view.js";import"./sw-minidoc-code.js";class l extends HTMLElement{#s;#n={};#i={};#e=null;#r=[];#w={};#c=null;#p="";#t="";#f="";#a="cargando";#v="";#d=null;#o=null;#l=null;#h=null;#u=null;constructor(){super(),this.#s=this.attachShadow({mode:"open"})}get conn(){return this.#u}set conn(t){this.#u=t&&typeof t=="object"?t:null,this.isConnected&&this.#S()}#y(){const t=this.getAttribute("conn");if(!t?.trim())return null;try{const s=JSON.parse(t);return s&&typeof s=="object"?s:null}catch{return null}}connectedCallback(){this.#t=E().op,this.#h=y(t=>{t.op!==this.#t&&(this.#t=t.op,this.#g())}),this.#E(),this.#S()}disconnectedCallback(){this.#h?.(),this.#h=null}async#S(){try{const t=h(this.#u??this.#y()),{config:s,spec:i}=await d(t);if(this.#n=s,this.#i=M(s),this.#e=i,this.#r=w(m(i),i),this.#w=u(i),this.#c=this.#i.enabled?C():null,this.#p=S()||v(i,s),!this.#t){const o=String(this.#n.defaultOp??"").trim(),e=o&&this.#m.some(n=>n.operationId===o);this.#t=e?o:this.#m[0]?.operationId??""}this.#a="listo"}catch(t){this.#a="error",this.#v=t?.message??String(t)}this.#E()}get#m(){return this.#r.flatMap(t=>t.operations)}get#C(){return f(this.#r,this.#f)}get#M(){return this.#m.find(t=>t.operationId===this.#t)??null}get#$(){const t=this.#t;return this.#r.find(s=>s.operations.some(i=>i.operationId===t))?.name??""}#I(t){t!==this.#t&&(this.#t=t,b({op:t}),this.#g())}#g(){for(const i of this.#s.querySelectorAll(".op"))i.toggleAttribute("data-activo",i.dataset.op===this.#t);const t=this.#M,s=this.#i.enabled&&g(t??void 0,this.#e);this.#o&&(this.#o.props={op:t,spec:this.#e,grupo:this.#$,serverBase:this.#p,authEnabled:this.#i.enabled,docMd:t?this.#w[t.operationId]??"":""}),this.#l&&(this.#l.props={op:t,spec:this.#e,serverBase:this.#p,requiereBearer:s}),this.#o?.scrollIntoView({block:"start"})}#b(){const t=this.#d;if(!t)return;const s=this.#C.map(i=>{const o=i.operations.map(e=>{const n=document.createElement("sw-method");return n.props={method:e.method},r`
          <button
            type="button"
            class="op"
            data-op="${e.operationId}"
            ${e.operationId===this.#t?"data-activo":""}
            onclick=${()=>this.#I(e.operationId)}
          >
            ${n}
            <span class="op-nombre">${e.summary||e.operationId}</span>
          </button>
        `});return r`
        <section class="grupo">
          <h3 class="grupo-titulo">${i.name}</h3>
          ${o}
        </section>
      `});t.replaceChildren(...s.length?s:[r`<p class="sin-resultados">Sin coincidencias.</p>`])}#E(){if(this.#s.replaceChildren(),this.#d=null,this.#o=null,this.#l=null,this.#a==="cargando"){this.#s.append(r`<div class="centrado"><is-spinner></is-spinner></div>`),a(this.#s,import.meta.url,"sw-minidoc");return}if(this.#a==="error"){this.#s.append(r`
        <div class="centrado">
          <is-callout color="danger" variant="outlined">
            <strong>No se pudo cargar la documentación.</strong>
            <p>${this.#v}</p>
          </is-callout>
        </div>
      `),a(this.#s,import.meta.url,"sw-minidoc");return}const t=this.#n.brand?.title||this.#e?.info?.title||"API",s=document.createElement("sw-minidoc-view"),i=document.createElement("sw-minidoc-code"),o=document.createElement("sw-auth");o.props={authEnabled:this.#i.enabled,auth:this.#i,session:this.#c},o.addEventListener("sw-session-change",n=>{this.#c=n.detail?.session??null});const e=this.#n.brand?.icon||"mdi:api";this.#s.append(r`
      <sw-layout>
        <div slot="cabecera" class="cabecera">
          <span class="marca">
            <is-icon class="marca-logo" icon="${e}"></is-icon>
            <span class="marca-texto">${t}</span>
          </span>
          <is-input
            class="buscar"
            type="search"
            placeholder="Buscar endpoint…"
            onis-input=${n=>{this.#f=String(n.target.value??""),this.#b()}}
          ></is-input>
          ${o}
          <sw-driver-switch></sw-driver-switch>
          <is-theme-toggle></is-theme-toggle>
        </div>

        <nav slot="inicio" class="indice" aria-label="Índice de endpoints"></nav>
        <div slot="centro">${s}</div>
        <div slot="fin">${i}</div>
      </sw-layout>
    `),this.#d=this.#s.querySelector(".indice"),this.#o=s,this.#l=i,this.#b(),this.#g(),a(this.#s,import.meta.url,"sw-minidoc")}}c(import.meta.url,"sw-minidoc"),p("sw-minidoc",l);export{l as SwMinidoc};
