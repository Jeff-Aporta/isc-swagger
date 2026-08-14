import{adoptCss as l,precargarCss as p,define as d,html as a}from"./_shared.js";import{loadViewerDocument as h,resolveBootConfig as u}from"../../js/config.js";import{buildDocIndex as m,groupOperationsByTag as g,operationRequiresBearer as w,sortGroupsBySpecOrder as f}from"../../js/openapi.js";import{filterGroupsByQuery as v}from"../../js/nav.js";import{inferDefaultServerBase as S,readServerFromUrl as b}from"../../js/server-base.js";import{mergeUrlState as E,readUrlState as y,subscribeUrlState as C}from"../../js/url-state.js";import{getStoredJwt as $,resolveAuthConfig as M}from"../../js/auth.js";import"./sw-method.js";import"./sw-auth.js";import"./sw-layout.js";import"./sw-driver-switch.js";import"./sw-export.js";import"./sw-minidoc-view.js";import"./sw-minidoc-code.js";class c extends HTMLElement{#s;#o={};#i={};#e=null;#r=[];#w={};#c=null;#p="";#t="";#f="";#a="cargando";#v="";#d=null;#n=null;#l=null;#h=null;#u=null;constructor(){super(),this.#s=this.attachShadow({mode:"open"})}get conn(){return this.#u}set conn(t){this.#u=t&&typeof t=="object"?t:null,this.isConnected&&this.#S()}#y(){const t=this.getAttribute("conn");if(!t?.trim())return null;try{const s=JSON.parse(t);return s&&typeof s=="object"?s:null}catch{return null}}connectedCallback(){this.#t=y().op,this.#h=C(t=>{t.op!==this.#t&&(this.#t=t.op,this.#g())}),this.#E(),this.#S()}disconnectedCallback(){this.#h?.(),this.#h=null}async#S(){try{const t=u(this.#u??this.#y()),{config:s,spec:i}=await h(t);if(this.#o=s,this.#i=M(s),this.#e=i,this.#r=f(g(i),i),this.#w=m(i),this.#c=this.#i.enabled?$():null,this.#p=b()||S(i,s),!this.#t){const o=String(this.#o.defaultOp??"").trim(),e=o&&this.#m.some(n=>n.operationId===o);this.#t=e?o:this.#m[0]?.operationId??""}this.#a="listo"}catch(t){this.#a="error",this.#v=t?.message??String(t)}this.#E()}get#m(){return this.#r.flatMap(t=>t.operations)}get#C(){return v(this.#r,this.#f)}get#$(){return this.#m.find(t=>t.operationId===this.#t)??null}get#M(){const t=this.#t;return this.#r.find(s=>s.operations.some(i=>i.operationId===t))?.name??""}#I(t){t!==this.#t&&(this.#t=t,E({op:t}),this.#g())}#g(){for(const i of this.#s.querySelectorAll(".op"))i.toggleAttribute("data-activo",i.dataset.op===this.#t);const t=this.#$,s=this.#i.enabled&&w(t??void 0,this.#e);this.#n&&(this.#n.props={op:t,spec:this.#e,grupo:this.#M,serverBase:this.#p,authEnabled:this.#i.enabled,docMd:t?this.#w[t.operationId]??"":""}),this.#l&&(this.#l.props={op:t,spec:this.#e,serverBase:this.#p,requiereBearer:s}),this.#n?.scrollIntoView({block:"start"})}#b(){const t=this.#d;if(!t)return;const s=this.#C.map(i=>{const o=i.operations.map(e=>{const n=document.createElement("sw-method");n.props={method:e.method};const r=String(e.path||"");return a`
          <button
            type="button"
            class="op"
            data-op="${e.operationId}"
            title="${r}"
            ${e.operationId===this.#t?"data-activo":""}
            onclick=${()=>this.#I(e.operationId)}
          >
            ${n}
            <span class="op-nombre">${e.summary||e.operationId}</span>
            <span class="op-path" aria-hidden="true">${r}</span>
          </button>
        `});return a`
        <section class="grupo">
          <h3 class="grupo-titulo">${i.name}</h3>
          ${o}
        </section>
      `});t.replaceChildren(...s.length?s:[a`<p class="sin-resultados">Sin coincidencias.</p>`])}#E(){if(this.#s.replaceChildren(),this.#d=null,this.#n=null,this.#l=null,this.#a==="cargando"){this.#s.append(a`<div class="centrado"><is-spinner></is-spinner></div>`),l(this.#s,import.meta.url,"sw-minidoc");return}if(this.#a==="error"){this.#s.append(a`
        <div class="centrado">
          <is-callout color="danger" variant="outlined">
            <strong>No se pudo cargar la documentación.</strong>
            <p>${this.#v}</p>
          </is-callout>
        </div>
      `),l(this.#s,import.meta.url,"sw-minidoc");return}const t=this.#o.brand?.title||this.#e?.info?.title||"API",s=document.createElement("sw-minidoc-view"),i=document.createElement("sw-minidoc-code"),o=document.createElement("sw-auth");o.props={authEnabled:this.#i.enabled,auth:this.#i,session:this.#c},o.addEventListener("sw-session-change",r=>{this.#c=r.detail?.session??null});const e=document.createElement("sw-export");e.props={spec:this.#e,config:this.#o};const n=this.#o.brand?.icon||"mdi:api";this.#s.append(a`
      <sw-layout>
        <div slot="cabecera" class="cabecera">
          <span class="marca">
            <is-icon class="marca-logo" icon="${n}"></is-icon>
            <span class="marca-texto">${t}</span>
          </span>
          <is-input
            class="buscar"
            type="search"
            placeholder="Buscar endpoint…"
            onis-input=${r=>{this.#f=String(r.target.value??""),this.#b()}}
          ></is-input>
          ${o}
          ${e}
          <sw-driver-switch></sw-driver-switch>
          <is-theme-toggle></is-theme-toggle>
        </div>

        <nav slot="inicio" class="indice" aria-label="Índice de endpoints"></nav>
        <div slot="centro">${s}</div>
        <div slot="fin">${i}</div>
      </sw-layout>
    `),this.#d=this.#s.querySelector(".indice"),this.#n=s,this.#l=i,this.#b(),this.#g(),l(this.#s,import.meta.url,"sw-minidoc")}}p(import.meta.url,"sw-minidoc"),d("sw-minidoc",c);export{c as SwMinidoc};
