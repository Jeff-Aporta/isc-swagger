import{adoptCss as m,precargarCss as w,define as b,html as o,emitir as g}from"./_shared.js";import{ejemploDeParam as v}from"../../js/curl.js";import{openHostDialog as $}from"../../js/dialog-host.js";import{jsonPretty as E,operationRequiresBearer as f,resolveParams as q}from"../../js/openapi.js";import"./sw-method.js";import"./sw-path.js";import"./sw-json.js";import"./sw-try.js";import"./sw-doc.js";const P=[{in:"path",titulo:"Par\xE1metros de ruta"},{in:"query",titulo:"Par\xE1metros de consulta"},{in:"header",titulo:"Cabeceras"},{in:"cookie",titulo:"Cookies"}];class u extends HTMLElement{#e;#o={op:null,spec:null,grupo:"",serverBase:"",authEnabled:!1,docMd:""};constructor(){super(),this.#e=this.attachShadow({mode:"open"})}connectedCallback(){this.#s()}get props(){return this.#o}set props(e){this.#o={...this.#o,...e??{}},this.isConnected&&this.#s()}#t(e){const t=e.schema,n=[t?.type,t?.format].filter(Boolean).join(" \xB7 ")||"string",a=v(e),s=Array.isArray(t?.enum)?t?.enum??[]:[];return o`
      <article class="param">
        <div class="param-cab">
          <code class="param-nombre">${e.name}</code>
          <span class="param-tipo">${n}</span>
          ${e.required?o`<span class="param-req">obligatorio</span>`:null}
        </div>
        ${e.description?o`<p class="param-desc">${e.description}</p>`:null}
        ${s.length?o`<p class="param-enum">Valores: ${s.map(r=>o`<code>${String(r)}</code>`)}</p>`:null}
        ${a&&!a.startsWith("<")?o`<p class="param-ej">Ejemplo: <code>${a}</code></p>`:null}
      </article>
    `}#a(e){return P.flatMap(({in:t,titulo:n})=>{const a=e.filter(s=>s.in===t);return a.length?[o`
          <section class="bloque">
            <h2 class="bloque-titulo">${n}</h2>
            ${a.map(s=>this.#t(s))}
          </section>
        `]:[]})}#n(){const{op:e,spec:t,serverBase:n,authEnabled:a}=this.#o;if(!e)return;const s=document.createElement("sw-try");s.props={op:e,spec:t,serverBase:n,authEnabled:a},s.addEventListener("sw-need-login",r=>g(this,"sw-need-login",r.detail)),$({label:`${e.method.toUpperCase()} ${e.path}`,className:"sw-dialog-try",width:"min(56rem, calc(100vw - 2rem))",content:s})}#s(){const{op:e,spec:t,grupo:n,authEnabled:a,docMd:s}=this.#o;if(this.#e.replaceChildren(),!e){this.#e.append(o`
        <div class="vacio">
          <p>Elige una operación en el índice para ver su documentación.</p>
        </div>
      `),m(this.#e,import.meta.url,"sw-minidoc-view");return}const r=document.createElement("sw-method");r.props={method:e.method};const c=document.createElement("sw-path");c.props={path:e.path};const d=q(e,t),h=a&&f(e,t),p=e.requestBody?.content?.["application/json"]?.schema;let i=null;p&&(i=document.createElement("sw-json"),i.props={value:E(p),maxHeight:"24rem"});let l=null;s&&(l=document.createElement("sw-doc"),l.props={markdown:s}),this.#e.append(o`
      ${n?o`<p class="eyebrow">${n}</p>`:null}
      <h1 class="titulo">${e.summary||e.operationId}</h1>
      ${e.description?o`<p class="entradilla">${e.description}</p>`:null}

      <div class="endpoint">
        ${r}
        ${c}
        <is-button class="probar" variant="solid" color="success" onis-click=${()=>this.#n()}>
          Probar
          <is-icon slot="end" icon="mdi:play"></is-icon>
        </is-button>
      </div>

      ${h?o`
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

      ${this.#a(d)}

      ${i?o`
            <section class="bloque">
              <h2 class="bloque-titulo">Cuerpo de la petición</h2>
              ${i}
            </section>
          `:null}

      ${l?o`
            <section class="bloque">
              <h2 class="bloque-titulo">Notas</h2>
              ${l}
            </section>
          `:null}
    `),m(this.#e,import.meta.url,"sw-minidoc-view")}}w(import.meta.url,"sw-minidoc-view"),b("sw-minidoc-view",u);export{u as SwMinidocView};
