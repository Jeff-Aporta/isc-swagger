import{adoptCss as p,precargarCss as h,define as b,html as s,emitir as v,raw as w}from"./_shared.js";import{ejemploDeParam as g}from"../../js/curl.js";import{jsonPretty as $,operationRequiresBearer as E,resolveParams as f}from"../../js/openapi.js";import{renderMarkdown as q}from"../../js/markdown.js";import"./sw-method.js";import"./sw-path.js";import"./sw-json.js";import"./sw-try.js";const P=[{in:"path",titulo:"Par\xE1metros de ruta"},{in:"query",titulo:"Par\xE1metros de consulta"},{in:"header",titulo:"Cabeceras"},{in:"cookie",titulo:"Cookies"}];class d extends HTMLElement{#e;#s={op:null,spec:null,grupo:"",serverBase:"",authEnabled:!1,docMd:""};constructor(){super(),this.#e=this.attachShadow({mode:"open"})}connectedCallback(){this.#o()}get props(){return this.#s}set props(e){this.#s={...this.#s,...e??{}},this.isConnected&&this.#o()}#t(e){const t=e.schema,r=[t?.type,t?.format].filter(Boolean).join(" \xB7 ")||"string",n=g(e),o=Array.isArray(t?.enum)?t?.enum??[]:[];return s`
      <article class="param">
        <div class="param-cab">
          <code class="param-nombre">${e.name}</code>
          <span class="param-tipo">${r}</span>
          ${e.required?s`<span class="param-req">obligatorio</span>`:null}
        </div>
        ${e.description?s`<p class="param-desc">${e.description}</p>`:null}
        ${o.length?s`<p class="param-enum">Valores: ${o.map(a=>s`<code>${String(a)}</code>`)}</p>`:null}
        ${n&&!n.startsWith("<")?s`<p class="param-ej">Ejemplo: <code>${n}</code></p>`:null}
      </article>
    `}#a(e){return P.flatMap(({in:t,titulo:r})=>{const n=e.filter(o=>o.in===t);return n.length?[s`
          <section class="bloque">
            <h2 class="bloque-titulo">${r}</h2>
            ${n.map(o=>this.#t(o))}
          </section>
        `]:[]})}#n(){const{op:e,spec:t,serverBase:r,authEnabled:n}=this.#s;if(!e)return;const o=document.createElement("sw-try");o.props={op:e,spec:t,serverBase:r,authEnabled:n},o.addEventListener("sw-need-login",i=>v(this,"sw-need-login",i.detail));const a=document.createElement("is-dialog");a.setAttribute("label",`${e.method.toUpperCase()} ${e.path}`),a.append(o),document.body.append(a),a.addEventListener("is-hide",()=>a.remove()),a.open=!0}#o(){const{op:e,spec:t,grupo:r,authEnabled:n,docMd:o}=this.#s;if(this.#e.replaceChildren(),!e){this.#e.append(s`
        <div class="vacio">
          <p>Elige una operación en el índice para ver su documentación.</p>
        </div>
      `),p(this.#e,import.meta.url,"sw-minidoc-view");return}const a=document.createElement("sw-method");a.props={method:e.method};const i=document.createElement("sw-path");i.props={path:e.path};const m=f(e,t),u=n&&E(e,t),c=e.requestBody?.content?.["application/json"]?.schema;let l=null;c&&(l=document.createElement("sw-json"),l.props={value:$(c),maxHeight:"24rem"}),this.#e.append(s`
      ${r?s`<p class="eyebrow">${r}</p>`:null}
      <h1 class="titulo">${e.summary||e.operationId}</h1>
      ${e.description?s`<p class="entradilla">${e.description}</p>`:null}

      <div class="endpoint">
        ${a}
        ${i}
        <is-button class="probar" variant="solid" color="success" onis-click=${()=>this.#n()}>
          Probar
          <is-icon slot="end" icon="mdi:play"></is-icon>
        </is-button>
      </div>

      ${u?s`
            <section class="bloque">
              <h2 class="bloque-titulo">Autorización</h2>
              <article class="param">
                <div class="param-cab">
                  <code class="param-nombre">Authorization</code>
                  <span class="param-tipo">string · header</span>
                  <span class="param-req">obligatorio</span>
                </div>
                <p class="param-desc">Esquema <code>Bearer</code>. Inicia sesión en el visor y la cabecera se envía sola al probar.</p>
                <p class="param-ej">Ejemplo: <code>Authorization: Bearer &lt;token&gt;</code></p>
              </article>
            </section>
          `:null}

      ${this.#a(m)}

      ${l?s`
            <section class="bloque">
              <h2 class="bloque-titulo">Cuerpo de la petición</h2>
              ${l}
            </section>
          `:null}

      ${o?s`
            <section class="bloque">
              <h2 class="bloque-titulo">Notas</h2>
              <div class="doc">${w(q(o))}</div>
            </section>
          `:null}
    `),p(this.#e,import.meta.url,"sw-minidoc-view")}}h(import.meta.url,"sw-minidoc-view"),b("sw-minidoc-view",d);export{d as SwMinidocView};
