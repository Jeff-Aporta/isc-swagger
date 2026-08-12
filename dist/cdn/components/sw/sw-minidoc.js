import{adoptCss as r,precargarCss as c,define as d,html as n}from"./_shared.js";import{loadViewerDocument as p,resolveBootConfig as h}from"../../js/config.js";import{buildDocIndex as u,groupOperationsByTag as m,operationRequiresBearer as g,sortGroupsBySpecOrder as w}from"../../js/openapi.js";import{filterGroupsByQuery as f}from"../../js/nav.js";import{inferDefaultServerBase as S,readServerFromUrl as v}from"../../js/server-base.js";import{mergeUrlState as b,readUrlState as E,subscribeUrlState as C}from"../../js/url-state.js";import{getStoredJwt as y,resolveAuthConfig as M}from"../../js/auth.js";import"./sw-method.js";import"./sw-auth.js";import"./sw-minidoc-view.js";import"./sw-minidoc-code.js";class l extends HTMLElement{#s;#m={};#e={};#i=null;#o=[];#g={};#l=null;#c="";#t="";#w="";#r="cargando";#f="";#d=null;#n=null;#a=null;#p=null;#h=null;constructor(){super(),this.#s=this.attachShadow({mode:"open"})}get conn(){return this.#h}set conn(t){this.#h=t&&typeof t=="object"?t:null,this.isConnected&&this.#S()}#C(){const t=this.getAttribute("conn");if(!t?.trim())return null;try{const s=JSON.parse(t);return s&&typeof s=="object"?s:null}catch{return null}}connectedCallback(){this.#t=E().op,this.#p=C(t=>{t.op!==this.#t&&(this.#t=t.op,this.#u())}),this.#E(),this.#S()}disconnectedCallback(){this.#p?.(),this.#p=null}async#S(){try{const t=h(this.#h??this.#C()),{config:s,spec:e}=await p(t);this.#m=s,this.#e=M(s),this.#i=e,this.#o=w(m(e),e),this.#g=u(e),this.#l=this.#e.enabled?y():null,this.#c=v()||S(e,s),this.#t||(this.#t=this.#v[0]?.operationId??""),this.#r="listo"}catch(t){this.#r="error",this.#f=t?.message??String(t)}this.#E()}get#v(){return this.#o.flatMap(t=>t.operations)}get#y(){return f(this.#o,this.#w)}get#M(){return this.#v.find(t=>t.operationId===this.#t)??null}get#$(){const t=this.#t;return this.#o.find(s=>s.operations.some(e=>e.operationId===t))?.name??""}#I(t){t!==this.#t&&(this.#t=t,b({op:t}),this.#u())}#u(){for(const e of this.#s.querySelectorAll(".op"))e.toggleAttribute("data-activo",e.dataset.op===this.#t);const t=this.#M,s=this.#e.enabled&&g(t??void 0,this.#i);this.#n&&(this.#n.props={op:t,spec:this.#i,grupo:this.#$,serverBase:this.#c,authEnabled:this.#e.enabled,docMd:t?this.#g[t.operationId]??"":""}),this.#a&&(this.#a.props={op:t,spec:this.#i,serverBase:this.#c,requiereBearer:s}),this.#n?.scrollIntoView({block:"start"})}#b(){const t=this.#d;if(!t)return;const s=this.#y.map(e=>{const o=e.operations.map(i=>{const a=document.createElement("sw-method");return a.props={method:i.method},n`
          <button
            type="button"
            class="op"
            data-op="${i.operationId}"
            ${i.operationId===this.#t?"data-activo":""}
            onclick=${()=>this.#I(i.operationId)}
          >
            ${a}
            <span class="op-nombre">${i.summary||i.operationId}</span>
          </button>
        `});return n`
        <section class="grupo">
          <h3 class="grupo-titulo">${e.name}</h3>
          ${o}
        </section>
      `});t.replaceChildren(...s.length?s:[n`<p class="sin-resultados">Sin coincidencias.</p>`])}#E(){if(this.#s.replaceChildren(),this.#d=null,this.#n=null,this.#a=null,this.#r==="cargando"){this.#s.append(n`<div class="centrado"><is-spinner></is-spinner></div>`),r(this.#s,import.meta.url,"sw-minidoc");return}if(this.#r==="error"){this.#s.append(n`
        <div class="centrado">
          <is-callout color="danger" variant="outlined">
            <strong>No se pudo cargar la documentación.</strong>
            <p>${this.#f}</p>
          </is-callout>
        </div>
      `),r(this.#s,import.meta.url,"sw-minidoc");return}const t=this.#m.brand?.title||this.#i?.info?.title||"API",s=document.createElement("sw-minidoc-view"),e=document.createElement("sw-minidoc-code"),o=document.createElement("sw-auth");o.props={authEnabled:this.#e.enabled,auth:this.#e,session:this.#l},o.addEventListener("sw-session-change",i=>{this.#l=i.detail?.session??null}),this.#s.append(n`
      <header class="cabecera">
        <span class="marca">${t}</span>
        <is-input
          class="buscar"
          type="search"
          placeholder="Buscar endpoint…"
          onis-input=${i=>{this.#w=String(i.target.value??""),this.#b()}}
        ></is-input>
        ${o}
        <is-theme-toggle></is-theme-toggle>
      </header>

      <div class="cuerpo">
        <nav class="indice" aria-label="Índice de endpoints"></nav>
        <main class="contenido">${s}</main>
        <aside class="codigo">${e}</aside>
      </div>
    `),this.#d=this.#s.querySelector(".indice"),this.#n=s,this.#a=e,this.#b(),this.#u(),r(this.#s,import.meta.url,"sw-minidoc")}}c(import.meta.url,"sw-minidoc"),d("sw-minidoc",l);export{l as SwMinidoc};
