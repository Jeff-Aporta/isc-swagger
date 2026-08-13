import{adoptCss as w,precargarCss as T,define as $,html as p,emitir as C}from"./_shared.js";import{jsonPretty as L,operationRequiresBearer as q,resolveParams as b}from"../../js/openapi.js";import{defaultTryItBodyText as P,shouldShowTryItBody as y}from"../../js/tryit-body.js";import{paramInitialValue as R}from"../../js/param-schema.js";import{joinApiUrl as x}from"../../js/server-base.js";import{fetchApiRaw as j,extractEnvelopeError as H}from"../../js/api-fetch.js";import{formatHttpError as M,extractApiError as k}from"../../js/http-error.js";import{getStoredJwt as A}from"../../js/auth.js";import{openHostDialog as B}from"../../js/dialog-host.js";import"./sw-params.js";import"./sw-body.js";import"./sw-json.js";const E=new Set(["delete","put","patch"]),z=(g,t)=>g.replace(/\{(\w+)\}/g,(s,e)=>encodeURIComponent(t[e]??`{${e}}`));class S extends HTMLElement{#s;#t={op:null,spec:null,serverBase:"",authEnabled:!1};#e={};#n="";#l=null;#o=!1;#r=null;#i="";#a=null;#g=null;#c=null;#u=null;#d=null;constructor(){super(),this.#s=this.attachShadow({mode:"open"})}connectedCallback(){this.#E()}get props(){return this.#t}set props(t){const s=this.#t.op;this.#t={...this.#t,...t??{}},this.#t.op!==s&&this.#S(),this.isConnected&&this.#E()}#S(){const{op:t,spec:s}=this.#t;if(this.#e={},t)for(const e of b(t,s)){const i=R(e);i&&(this.#e[String(e.name)]=i)}this.#n=t?P(t):"",this.#l=null,this.#r=null,this.#i="",this.#o=!1}get#p(){const{op:t,spec:s}=this.#t;return t?b(t,s):[]}#h(){const{op:t,serverBase:s}=this.#t;if(!t)return"";let e=x(s,z(t.path,this.#e));const i=new URLSearchParams;for(const o of this.#p){if(o.in!=="query")continue;const r=this.#e[String(o.name)];r!=null&&String(r).length&&i.set(String(o.name),r)}const c=i.toString();return c&&(e+=(e.includes("?")?"&":"?")+c),e}#w(){const{op:t,spec:s,authEnabled:e}=this.#t;return!!e&&q(t??void 0,s)}#T(){const{op:t}=this.#t;if(t){if(this.#w()&&!A()?.token){C(this,"sw-need-login",{hint:"Este endpoint requiere JWT. Inicia sesi\xF3n para ejecutarlo."});return}if(E.has(t.method)){this.#$();return}this.#b()}}#$(){const{op:t}=this.#t;t&&B({label:"Confirmar operaci\xF3n",className:"sw-dialog-confirm",width:"min(32rem, calc(100vw - 2rem))",content:p`
        <p class="sw-confirmar-texto">
          Vas a ejecutar <strong>${t.method.toUpperCase()}</strong> sobre un endpoint que modifica datos.
        </p>
        <code class="sw-confirmar-url">${this.#h()}</code>
        <div slot="footer" class="sw-confirmar-acciones">
          <is-button variant="plain" color="neutral" onis-click=${s=>{s.currentTarget.closest("is-dialog")?.remove()}}>Cancelar</is-button>
          <is-button
            color="danger"
            onis-click=${s=>{s.currentTarget.closest("is-dialog")?.remove(),this.#b()}}
          >
            Ejecutar de todos modos
          </is-button>
        </div>
      `})}async#b(){const{op:t}=this.#t;if(!t)return;this.#o=!0,this.#i="",this.#r=null,this.#m(),this.#v(),this.#f();const s=this.#h();try{const e={};for(const d of this.#p){if(d.in!=="header")continue;const f=this.#e[String(d.name)];f&&(e[String(d.name)]=f)}const i={method:t.method.toUpperCase(),headers:e};y(t)&&(e["Content-Type"]="application/json",i.body=this.#n.trim()||"{}");const c=performance.now(),{data:o,res:r,text:h,ok:u}=await j(s,i),m=Math.round(performance.now()-c);let v=h;o!==null&&typeof o=="object"&&(v=L(o)),u?this.#i=H(o):this.#i=M(r.status,{statusText:r.statusText,data:typeof o=="object"?o:void 0,detail:k(o)||(typeof o=="string"?o:""),endpoint:s}),this.#r={status:r.status,statusText:r.statusText,elapsed:m,body:v,ok:u}}catch(e){this.#i=e?.message??String(e)}finally{this.#o=!1,this.#m(),this.#v(),this.#f()}}#y(){const t=this.#h();this.#a&&(this.#a.textContent=t),this.#g?.setAttribute("value",t)}#m(){const t=this.#d;t&&(t.toggleAttribute("loading",this.#o),t.toggleAttribute("disabled",this.#o))}#v(){const t=this.#c;if(!t||(t.replaceChildren(),!this.#i))return;const s=this.#r?.ok?"warning":"danger";t.append(p`
      <is-callout color="${s}" variant="filled-outlined" icon="mdi:alert-outline">
        <pre class="aviso-texto">${this.#i}</pre>
      </is-callout>
    `)}#f(){const t=this.#u;if(!t)return;t.replaceChildren();const s=this.#r;if(!s)return;const e=document.createElement("sw-json");e.props={value:s.body,maxHeight:"32rem"},t.append(p`
      <div class="resultado">
        <div class="resultado-meta">
          <is-tag color="${s.ok?"success":"danger"}" variant="filled" class="resultado-status">
            ${s.status} ${s.statusText}
          </is-tag>
          <span class="resultado-dato">${s.elapsed} ms</span>
          <span class="resultado-dato">
            <is-format-bytes value="${new Blob([s.body]).size}"></is-format-bytes>
          </span>
        </div>
        ${e}
      </div>
    `)}#E(){const{op:t,spec:s}=this.#t;if(this.#s.replaceChildren(),this.#a=this.#c=this.#u=this.#d=null,!t){w(this.#s,import.meta.url,"sw-try");return}const e=this.#p,i=e.filter(n=>n.in==="path"),c=e.filter(n=>n.in==="query"||n.in==="header"),o=(n,a)=>{const l=document.createElement(n);return l.props=a,l},r=i.length?o("sw-params",{params:i,values:this.#e,disabled:this.#o,titulo:"Ruta"}):null,h=c.length?o("sw-params",{params:c,values:this.#e,disabled:this.#o,titulo:"Query y cabeceras"}):null,u=y(t)?o("sw-body",{op:t,value:this.#n,disabled:this.#o}):null,m=n=>{const{name:a,value:l}=n.detail;this.#e[a]=l,this.#y()};r?.addEventListener("sw-param-change",m),h?.addEventListener("sw-param-change",m),u?.addEventListener("sw-body-change",n=>{const a=n.detail;this.#n=a.value,this.#l=a.error;const l=u.shadowRoot?.querySelector("is-textarea")??null;l&&l.value!==a.value&&(l.value=a.value)});const v=!!this.#l,d=this.#w(),f=E.has(t.method);this.#s.append(p`
      <div class="panel">
        <div class="preview">
          <span class="preview-metodo">${t.method.toUpperCase()}</span>
          <code class="preview-url"></code>
          <is-copy-button class="preview-copiar" copy-label="Copiar URL"></is-copy-button>
        </div>

        ${r}
        ${h}
        ${u}

        <div class="acciones">
          <is-button
            class="ejecutar"
            color="${f?"danger":"brand"}"
            ${v?"disabled":""}
            onis-click=${()=>this.#T()}
          >
            <is-icon slot="start" icon="mdi:play-circle-outline"></is-icon>
            Ejecutar
          </is-button>
          ${d?p`
                <span class="candado" title="Requiere Authorization: Bearer &lt;JWT&gt;">
                  <is-icon icon="mdi:lock-outline"></is-icon>
                  Requiere sesión
                </span>
              `:null}
        </div>

        <div class="zona-aviso"></div>
        <div class="zona-resultado"></div>
      </div>
    `),this.#a=this.#s.querySelector(".preview-url"),this.#g=this.#s.querySelector(".preview-copiar"),this.#c=this.#s.querySelector(".zona-aviso"),this.#u=this.#s.querySelector(".zona-resultado"),this.#d=this.#s.querySelector(".ejecutar"),this.#y(),this.#v(),this.#f(),this.#m(),w(this.#s,import.meta.url,"sw-try")}}T(import.meta.url,"sw-try"),$("sw-try",S);export{S as SwTry};
