import{adoptCss as a,precargarCss as d,define as u,html as o,avisar as l}from"./_shared.js";import{loadViewerDocument as m,resolveBootConfig as v}from"../../js/config.js";import{buildDocIndex as b,groupOperationsByTag as f,sortGroupsBySpecOrder as g}from"../../js/openapi.js";import{contarOperaciones as w,filterGroupsByNavTab as S,filterGroupsByQuery as E,resolveActiveNavTab as n,resolveVisibleNavTabs as h}from"../../js/nav.js";import{inferDefaultServerBase as T,readServerFromUrl as C,serverOptions as L,writeServerToUrl as y}from"../../js/server-base.js";import{mergeUrlState as r,readUrlState as M,subscribeUrlState as H,OP_TAB_DEFAULT as c}from"../../js/url-state.js";import{getQuery as N,setQuery as A,clearSState as B}from"../../js/search-state.js";import{getStoredJwt as O,resolveAuthConfig as k}from"../../js/auth.js";import"./sw-nav.js";import"./sw-info.js";import"./sw-server.js";import"./sw-tag-group.js";class p extends HTMLElement{#s;#n={};#r={};#c=null;#g=[];#y={};#a=null;#p="";#t="";#e="";#o="try";#i="";#u="cargando";#w="";#S=!1;#d=null;#E=null;#m=null;#v=new Map;#T=null;#M=()=>{this.#L({force:!0})};constructor(){super(),this.#s=this.attachShadow({mode:"open"})}connectedCallback(){const t=M();this.#t=t.tab,this.#e=t.op,this.#o=t.opTab,this.#i=N(),this.#T=H(s=>{const e=n(this.#l,s.tab);if(e===this.#t&&s.op===this.#e&&s.opTab===this.#o)return;const i=e!==this.#t;this.#t=e,this.#e=s.op,this.#o=s.opTab,i&&(this.#b(),this.#h()),this.#f()}),this.addEventListener("sw-doc-reload",this.#M),this.#H(),this.#L()}disconnectedCallback(){this.removeEventListener("sw-doc-reload",this.#M),this.#T?.(),this.#T=null}#C=null;get conn(){return this.#C}set conn(t){this.#C=t&&typeof t=="object"?t:null,this.isConnected&&this.#L()}#N(){const t=this.getAttribute("conn");if(!t?.trim())return null;try{const s=JSON.parse(t);return s&&typeof s=="object"?s:null}catch{return null}}async#L(t={}){if(!(t.force&&this.#S)){t.force&&(this.#S=!0,l("Actualizando documentaci\xF3n\u2026","brand"));try{const s=v(this.#C??this.#N()),{config:e,spec:i}=await m(s,{force:t.force});this.#n=e,this.#r=k(e),this.#c=i,this.#g=g(f(i),i),this.#y=b(i),this.#a=this.#r.enabled?O():null,this.#p=C()||T(i,e),this.#t=n(h(e,this.#a),this.#t),this.#u="listo",t.force&&l("Documentaci\xF3n actualizada","success")}catch(s){this.#u="error",this.#w=s?.message??String(s),t.force&&l(this.#w,"danger")}finally{this.#S=!1}this.#H()}}get#l(){return h(this.#n,this.#a)}get#A(){const t=this.#i.trim()?this.#g:S(this.#g,this.#l,this.#t);return E(t,this.#i)}#B(t){t!==this.#t&&(this.#t=t,this.#e="",r({tab:t,op:""}),this.#b(),this.#h())}#O(t){this.#i=t,A(t),this.#h()}#k(t,s){const e=s?t:"";e!==this.#e&&(this.#e=e,r({op:e}),this.#f())}#$(t,s){this.#e=t,this.#o=s,r({op:t,opTab:s}),this.#f()}#x(t){this.#p=t,y(t),this.#f()}#D(t){this.#a=t,this.#t=n(this.#l,this.#t),this.#b(),this.#h()}#G(){this.#i="",this.#e="",this.#o=c,this.#t=n(this.#l,""),B(),r({tab:"",op:"",opTab:c},{push:!1}),this.#b(),this.#h()}#b(){this.#d&&(this.#d.props={activeTab:this.#t,tabs:this.#l,session:this.#a,query:this.#i})}#f(){for(const t of this.#v.values())t.props={serverBase:this.#p,authEnabled:this.#r.enabled===!0,opAbierta:this.#e,opTab:this.#o}}#U(t){const s=document.createElement("sw-tag-group");return s.props={group:t,spec:this.#c,serverBase:this.#p,authEnabled:this.#r.enabled===!0,docIndex:this.#y,opAbierta:this.#e,opTab:this.#o},s.addEventListener("sw-op-toggle",e=>{const i=e.detail;this.#k(i.operationId,i.abierto)}),s.addEventListener("sw-op-tab",e=>{const i=e.detail;this.#$(i.operationId,i.tab)}),s.addEventListener("sw-need-login",e=>{const i=e.detail;this.#d?.abrirLogin(i?.hint)}),this.#v.set(t.name,s),s}#h(){const t=this.#E;if(!t)return;t.replaceChildren(),this.#v.clear();const s=this.#A,e=w(s);if(this.#m&&(this.#m.textContent=`${e} ${e===1?"operaci\xF3n":"operaciones"}`),!s.length){t.append(o`
        <is-callout color="neutral" variant="filled-outlined" icon="mdi:magnify-close">
          ${this.#i?`Ninguna operaci\xF3n coincide con \xAB${this.#i}\xBB.`:"Esta secci\xF3n no tiene operaciones."}
        </is-callout>
      `);return}for(const i of s)t.append(this.#U(i))}#H(){if(this.#s.replaceChildren(),this.#d=null,this.#E=null,this.#m=null,this.#v.clear(),this.#u==="cargando"){this.#s.append(o`
        <div class="cargando" role="status">
          <is-spinner></is-spinner>
          <p>Cargando documentación…</p>
        </div>
      `),a(this.#s,import.meta.url,"sw-app");return}if(this.#u==="error"){this.#s.append(o`
        <div class="fallo">
          <is-callout color="danger" variant="filled-outlined" icon="mdi:alert-octagon-outline">
            <h2 class="fallo-titulo">No se pudo cargar el documento</h2>
            <pre class="fallo-texto">${this.#w}</pre>
            <p class="fallo-pista">
              Comprueba <code>specUrl</code> o <code>apiBase</code> en la configuración, o abre el
              visor con <code>?spec=&lt;url&gt;</code>.
            </p>
          </is-callout>
        </div>
      `),a(this.#s,import.meta.url,"sw-app");return}const t=document.createElement("sw-nav");t.props={brand:this.#n.brand??{},tabs:this.#l,activeTab:this.#t,query:this.#i,spec:this.#c,config:this.#n,authEnabled:this.#r.enabled===!0,auth:this.#r,session:this.#a},t.addEventListener("sw-nav-tab",i=>this.#B(i.detail.tab)),t.addEventListener("sw-search",i=>this.#O(i.detail.query)),t.addEventListener("sw-session-change",i=>this.#D(i.detail.session)),t.addEventListener("sw-reset",()=>this.#G()),this.#d=t;const s=document.createElement("sw-info");s.props={spec:this.#c};let e=null;this.#n.serverSelect!==!1&&(e=document.createElement("sw-server"),e.props={value:this.#p,options:L(this.#c,this.#n)},e.addEventListener("sw-server-change",i=>this.#x(i.detail.serverBase))),this.#s.append(o`
      ${t}
      <main class="lienzo">
        <div class="ancho">
          ${s}
          ${e}
          <p class="resumen-total"></p>
          <div class="grupos"></div>
        </div>
      </main>
    `),this.#m=this.#s.querySelector(".resumen-total"),this.#E=this.#s.querySelector(".grupos"),this.#h(),a(this.#s,import.meta.url,"sw-app")}}d(import.meta.url,"sw-app"),u("sw-app",p);export{p as SwApp};
