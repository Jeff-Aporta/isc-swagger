import{adoptCss as l,precargarCss as d,define as h,html as n}from"./_shared.js";import{loadViewerDocument as u,resolveBootConfig as m}from"../../js/config.js";import{buildDocIndex as g,groupOperationsByTag as w,operationRequiresBearer as c,sortGroupsBySpecOrder as f}from"../../js/openapi.js";import{filterGroupsByQuery as v}from"../../js/nav.js";import{inferDefaultServerBase as S,readServerFromUrl as b}from"../../js/server-base.js";import{mergeUrlState as E,readUrlState as $,subscribeUrlState as y}from"../../js/url-state.js";import{getStoredJwt as C,resolveAuthConfig as M}from"../../js/auth.js";import"./sw-method.js";import"./sw-auth.js";import"./sw-layout.js";import"./sw-driver-switch.js";import"./sw-export.js";import"./sw-minidoc-view.js";import"./sw-minidoc-code.js";class p extends HTMLElement{#s;#o={};#i={};#e=null;#r=[];#w={};#c=null;#p="";#t="";#f="";#a="cargando";#v="";#d=null;#n=null;#l=null;#h=null;#u=null;constructor(){super(),this.#s=this.attachShadow({mode:"open"})}get conn(){return this.#u}set conn(t){this.#u=t&&typeof t=="object"?t:null,this.isConnected&&this.#S()}#y(){const t=this.getAttribute("conn");if(!t?.trim())return null;try{const i=JSON.parse(t);return i&&typeof i=="object"?i:null}catch{return null}}connectedCallback(){this.#t=$().op,this.#h=y(t=>{t.op!==this.#t&&(this.#t=t.op,this.#g())}),this.#$(),this.#S()}disconnectedCallback(){this.#h?.(),this.#h=null}async#S(){try{const t=m(this.#u??this.#y()),{config:i,spec:s}=await u(t);if(this.#o=i,this.#i=M(i),this.#e=s,this.#r=f(w(s),s),this.#w=g(s),this.#c=this.#i.enabled?C():null,this.#p=b()||S(s,i),!this.#t){const o=String(this.#o.defaultOp??"").trim(),e=o&&this.#m.some(r=>r.operationId===o);this.#t=e?o:this.#m[0]?.operationId??""}this.#a="listo"}catch(t){this.#a="error",this.#v=t?.message??String(t)}this.#$()}get#m(){return this.#r.flatMap(t=>t.operations)}get#C(){return v(this.#r,this.#f)}get#M(){return this.#m.find(t=>t.operationId===this.#t)??null}get#T(){const t=this.#t;return this.#r.find(i=>i.operations.some(s=>s.operationId===t))?.name??""}#k(t){t!==this.#t&&(this.#t=t,E({op:t}),this.#g())}#g(){for(const s of this.#s.querySelectorAll(".op"))s.toggleAttribute("data-activo",s.dataset.op===this.#t);const t=this.#M,i=this.#i.enabled&&c(t??void 0,this.#e);this.#n&&(this.#n.props={op:t,spec:this.#e,grupo:this.#T,serverBase:this.#p,authEnabled:this.#i.enabled,docMd:t?this.#w[t.operationId]??"":""}),this.#l&&(this.#l.props={op:t,spec:this.#e,serverBase:this.#p,requiereBearer:i}),this.#n?.scrollIntoView({block:"start"})}#b(t){const i=document.createElement("sw-method");i.props={method:t.method};const s=String(t.path||""),e=this.#i.enabled&&c(t,this.#e)?n`<is-icon class="op-lock" icon="mdi:lock" title="Requiere JWT" aria-label="Requiere JWT"></is-icon>`:n`<span class="op-lock op-lock--vacio" aria-hidden="true"></span>`;return n`
      <button
        type="button"
        class="op"
        data-op="${t.operationId}"
        title="${s}"
        ${t.operationId===this.#t?"data-activo":""}
        onclick=${()=>this.#k(t.operationId)}
      >
        ${e}
        ${i}
        <span class="op-nombre">${t.summary||t.operationId}</span>
        <span class="op-path" aria-hidden="true">${s}</span>
      </button>
    `}#E(){const t=this.#d;if(!t)return;const i=this.#C.map(s=>{const o=s.subgroups.length?s.subgroups.map(e=>n`
              <section class="entidad">
                <h4 class="entidad-titulo">${e.name||e.id}</h4>
                ${e.operations.map(r=>this.#b(r))}
              </section>
            `):s.operations.map(e=>this.#b(e));return n`
        <section class="grupo">
          <h3 class="grupo-titulo">${s.name}</h3>
          ${o}
        </section>
      `});t.replaceChildren(...i.length?i:[n`<p class="sin-resultados">Sin coincidencias.</p>`])}#$(){if(this.#s.replaceChildren(),this.#d=null,this.#n=null,this.#l=null,this.#a==="cargando"){this.#s.append(n`<div class="centrado"><is-spinner></is-spinner></div>`),l(this.#s,import.meta.url,"sw-minidoc");return}if(this.#a==="error"){this.#s.append(n`
        <div class="centrado">
          <is-callout color="danger" variant="outlined">
            <strong>No se pudo cargar la documentación.</strong>
            <p>${this.#v}</p>
          </is-callout>
        </div>
      `),l(this.#s,import.meta.url,"sw-minidoc");return}const t=this.#o.brand?.title||this.#e?.info?.title||"API",i=document.createElement("sw-minidoc-view"),s=document.createElement("sw-minidoc-code"),o=document.createElement("sw-auth");o.props={authEnabled:this.#i.enabled,auth:this.#i,session:this.#c},o.addEventListener("sw-session-change",a=>{this.#c=a.detail?.session??null});const e=document.createElement("sw-export");e.props={spec:this.#e,config:this.#o};const r=this.#o.brand?.icon||"mdi:api";this.#s.append(n`
      <sw-layout>
        <div slot="cabecera" class="cabecera">
          <span class="marca">
            <is-icon class="marca-logo" icon="${r}"></is-icon>
            <span class="marca-texto">${t}</span>
          </span>
          <is-input
            class="buscar"
            type="search"
            placeholder="Buscar endpoint…"
            onis-input=${a=>{this.#f=String(a.target.value??""),this.#E()}}
          ></is-input>
          ${o}
          ${e}
          <sw-driver-switch></sw-driver-switch>
          <is-theme-toggle></is-theme-toggle>
        </div>

        <nav slot="inicio" class="indice" aria-label="Índice de endpoints"></nav>
        <div slot="centro">${i}</div>
        <div slot="fin">${s}</div>
      </sw-layout>
    `),this.#d=this.#s.querySelector(".indice"),this.#n=i,this.#l=s,this.#E(),this.#g(),l(this.#s,import.meta.url,"sw-minidoc")}}d(import.meta.url,"sw-minidoc"),h("sw-minidoc",p);export{p as SwMinidoc};
