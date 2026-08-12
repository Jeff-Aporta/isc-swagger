import{adoptCss as r,precargarCss as c,define as u,html as o}from"./_shared.js";import{loadViewerDocument as d,resolveBootConfig as m}from"../../js/config.js";import{buildDocIndex as v,groupOperationsByTag as b,sortGroupsBySpecOrder as g}from"../../js/openapi.js";import{contarOperaciones as w,filterGroupsByNavTab as f,filterGroupsByQuery as S,resolveActiveNavTab as a,resolveVisibleNavTabs as l}from"../../js/nav.js";import{inferDefaultServerBase as E,readServerFromUrl as T,serverOptions as C,writeServerToUrl as L}from"../../js/server-base.js";import{mergeUrlState as n,readUrlState as y,subscribeUrlState as M,OP_TAB_DEFAULT as h}from"../../js/url-state.js";import{getQuery as H,setQuery as N,clearSState as B}from"../../js/search-state.js";import{getStoredJwt as O,resolveAuthConfig as A}from"../../js/auth.js";import"./sw-nav.js";import"./sw-info.js";import"./sw-server.js";import"./sw-tag-group.js";class p extends HTMLElement{#s;#n={};#r={};#h=null;#w=[];#T={};#a=null;#p="";#t="";#i="";#o="try";#e="";#d="cargando";#C="";#c=null;#f=null;#m=null;#v=new Map;#S=null;constructor(){super(),this.#s=this.attachShadow({mode:"open"})}connectedCallback(){const t=y();this.#t=t.tab,this.#i=t.op,this.#o=t.opTab,this.#e=H(),this.#S=M(s=>{if(s.tab===this.#t&&s.op===this.#i&&s.opTab===this.#o)return;const i=s.tab!==this.#t;this.#t=s.tab,this.#i=s.op,this.#o=s.opTab,i&&(this.#b(),this.#l()),this.#g()}),this.#y(),this.#L()}disconnectedCallback(){this.#S?.(),this.#S=null}#E=null;get conn(){return this.#E}set conn(t){this.#E=t&&typeof t=="object"?t:null,this.isConnected&&this.#L()}#M(){const t=this.getAttribute("conn");if(!t?.trim())return null;try{const s=JSON.parse(t);return s&&typeof s=="object"?s:null}catch{return null}}async#L(){try{const t=m(this.#E??this.#M()),{config:s,spec:i}=await d(t);this.#n=s,this.#r=A(s),this.#h=i,this.#w=g(b(i),i),this.#T=v(i),this.#a=this.#r.enabled?O():null,this.#p=T()||E(i,s),this.#t=a(l(s,this.#a),this.#t),this.#d="listo"}catch(t){this.#d="error",this.#C=t?.message??String(t)}this.#y()}get#u(){return l(this.#n,this.#a)}get#H(){const t=this.#e.trim()?this.#w:f(this.#w,this.#u,this.#t);return S(t,this.#e)}#N(t){t!==this.#t&&(this.#t=t,this.#i="",n({tab:t,op:""}),this.#b(),this.#l())}#B(t){this.#e=t,N(t),this.#l()}#O(t,s){const i=s?t:"";i!==this.#i&&(this.#i=i,n({op:i}),this.#g())}#A(t,s){this.#i=t,this.#o=s,n({op:t,opTab:s}),this.#g()}#k(t){this.#p=t,L(t),this.#g()}#$(t){this.#a=t,this.#t=a(this.#u,this.#t),this.#b(),this.#l()}#x(){this.#e="",this.#i="",this.#o=h,this.#t=a(this.#u,""),B(),n({tab:"",op:"",opTab:h}),this.#b(),this.#l()}#b(){this.#c&&(this.#c.props={activeTab:this.#t,tabs:this.#u,session:this.#a,query:this.#e})}#g(){for(const t of this.#v.values())t.props={serverBase:this.#p,authEnabled:this.#r.enabled===!0,opAbierta:this.#i,opTab:this.#o}}#G(t){const s=document.createElement("sw-tag-group");return s.props={group:t,spec:this.#h,serverBase:this.#p,authEnabled:this.#r.enabled===!0,docIndex:this.#T,opAbierta:this.#i,opTab:this.#o},s.addEventListener("sw-op-toggle",i=>{const e=i.detail;this.#O(e.operationId,e.abierto)}),s.addEventListener("sw-op-tab",i=>{const e=i.detail;this.#A(e.operationId,e.tab)}),s.addEventListener("sw-need-login",i=>{const e=i.detail;this.#c?.abrirLogin(e?.hint)}),this.#v.set(t.name,s),s}#l(){const t=this.#f;if(!t)return;t.replaceChildren(),this.#v.clear();const s=this.#H,i=w(s);if(this.#m&&(this.#m.textContent=`${i} ${i===1?"operaci\xF3n":"operaciones"}`),!s.length){t.append(o`
        <is-callout color="neutral" variant="filled-outlined" icon="mdi:magnify-close">
          ${this.#e?`Ninguna operaci\xF3n coincide con \xAB${this.#e}\xBB.`:"Esta secci\xF3n no tiene operaciones."}
        </is-callout>
      `);return}for(const e of s)t.append(this.#G(e))}#y(){if(this.#s.replaceChildren(),this.#c=null,this.#f=null,this.#m=null,this.#v.clear(),this.#d==="cargando"){this.#s.append(o`
        <div class="cargando" role="status">
          <is-spinner></is-spinner>
          <p>Cargando documentación…</p>
        </div>
      `),r(this.#s,import.meta.url,"sw-app");return}if(this.#d==="error"){this.#s.append(o`
        <div class="fallo">
          <is-callout color="danger" variant="filled-outlined" icon="mdi:alert-octagon-outline">
            <h2 class="fallo-titulo">No se pudo cargar el documento</h2>
            <pre class="fallo-texto">${this.#C}</pre>
            <p class="fallo-pista">
              Comprueba <code>specUrl</code> o <code>apiBase</code> en la configuración, o abre el
              visor con <code>?spec=&lt;url&gt;</code>.
            </p>
          </is-callout>
        </div>
      `),r(this.#s,import.meta.url,"sw-app");return}const t=document.createElement("sw-nav");t.props={brand:this.#n.brand??{},tabs:this.#u,activeTab:this.#t,query:this.#e,spec:this.#h,config:this.#n,authEnabled:this.#r.enabled===!0,auth:this.#r,session:this.#a},t.addEventListener("sw-nav-tab",e=>this.#N(e.detail.tab)),t.addEventListener("sw-search",e=>this.#B(e.detail.query)),t.addEventListener("sw-session-change",e=>this.#$(e.detail.session)),t.addEventListener("sw-reset",()=>this.#x()),this.#c=t;const s=document.createElement("sw-info");s.props={spec:this.#h};let i=null;this.#n.serverSelect!==!1&&(i=document.createElement("sw-server"),i.props={value:this.#p,options:C(this.#h,this.#n)},i.addEventListener("sw-server-change",e=>this.#k(e.detail.serverBase))),this.#s.append(o`
      ${t}
      <main class="lienzo">
        <div class="ancho">
          ${s}
          ${i}
          <p class="resumen-total"></p>
          <div class="grupos"></div>
        </div>
      </main>
    `),this.#m=this.#s.querySelector(".resumen-total"),this.#f=this.#s.querySelector(".grupos"),this.#l(),r(this.#s,import.meta.url,"sw-app")}}c(import.meta.url,"sw-app"),u("sw-app",p);export{p as SwApp};
