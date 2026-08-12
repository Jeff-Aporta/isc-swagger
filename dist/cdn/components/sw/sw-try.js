import{adoptCss as w,precargarCss as T,define as $,html as p,emitir as C}from"./_shared.js";import{jsonPretty as L,operationRequiresBearer as q,resolveParams as b}from"../../js/openapi.js";import{defaultTryItBodyText as P,shouldShowTryItBody as y}from"../../js/tryit-body.js";import{paramInitialValue as R}from"../../js/param-schema.js";import{joinApiUrl as x}from"../../js/server-base.js";import{fetchApiRaw as j,extractEnvelopeError as H}from"../../js/api-fetch.js";import{formatHttpError as M,extractApiError as k}from"../../js/http-error.js";import{getStoredJwt as A}from"../../js/auth.js";import"./sw-params.js";import"./sw-body.js";import"./sw-json.js";const E=new Set(["delete","put","patch"]),B=(g,t)=>g.replace(/\{(\w+)\}/g,(e,s)=>encodeURIComponent(t[s]??`{${s}}`));class S extends HTMLElement{#e;#t={op:null,spec:null,serverBase:"",authEnabled:!1};#s={};#n="";#l=null;#i=!1;#r=null;#o="";#a=null;#g=null;#c=null;#u=null;#d=null;constructor(){super(),this.#e=this.attachShadow({mode:"open"})}connectedCallback(){this.#E()}get props(){return this.#t}set props(t){const e=this.#t.op;this.#t={...this.#t,...t??{}},this.#t.op!==e&&this.#S(),this.isConnected&&this.#E()}#S(){const{op:t,spec:e}=this.#t;if(this.#s={},t)for(const s of b(t,e)){const o=R(s);o&&(this.#s[String(s.name)]=o)}this.#n=t?P(t):"",this.#l=null,this.#r=null,this.#o="",this.#i=!1}get#p(){const{op:t,spec:e}=this.#t;return t?b(t,e):[]}#h(){const{op:t,serverBase:e}=this.#t;if(!t)return"";let s=x(e,B(t.path,this.#s));const o=new URLSearchParams;for(const i of this.#p){if(i.in!=="query")continue;const r=this.#s[String(i.name)];r!=null&&String(r).length&&o.set(String(i.name),r)}const c=o.toString();return c&&(s+=(s.includes("?")?"&":"?")+c),s}#w(){const{op:t,spec:e,authEnabled:s}=this.#t;return!!s&&q(t??void 0,e)}#T(){const{op:t}=this.#t;if(t){if(this.#w()&&!A()?.token){C(this,"sw-need-login",{hint:"Este endpoint requiere JWT. Inicia sesi\xF3n para ejecutarlo."});return}if(E.has(t.method)){this.#$();return}this.#b()}}#$(){const{op:t}=this.#t;if(!t)return;const e=document.createElement("is-dialog");e.setAttribute("label","Confirmar operaci\xF3n"),e.append(p`
        <p class="sw-confirmar-texto">
          Vas a ejecutar <strong>${t.method.toUpperCase()}</strong> sobre un endpoint que modifica datos.
        </p>
        <code class="sw-confirmar-url">${this.#h()}</code>
        <div slot="footer" class="sw-confirmar-acciones">
          <is-button variant="plain" color="neutral" onis-click=${()=>e.remove()}>Cancelar</is-button>
          <is-button
            color="danger"
            onis-click=${()=>{e.remove(),this.#b()}}
          >
            Ejecutar de todos modos
          </is-button>
        </div>
      `),e.addEventListener("is-after-hide",()=>e.remove()),document.body.appendChild(e),e.show()}async#b(){const{op:t}=this.#t;if(!t)return;this.#i=!0,this.#o="",this.#r=null,this.#m(),this.#v(),this.#f();const e=this.#h();try{const s={};for(const d of this.#p){if(d.in!=="header")continue;const f=this.#s[String(d.name)];f&&(s[String(d.name)]=f)}const o={method:t.method.toUpperCase(),headers:s};y(t)&&(s["Content-Type"]="application/json",o.body=this.#n.trim()||"{}");const c=performance.now(),{data:i,res:r,text:h,ok:u}=await j(e,o),m=Math.round(performance.now()-c);let v=h;i!==null&&typeof i=="object"&&(v=L(i)),u?this.#o=H(i):this.#o=M(r.status,{statusText:r.statusText,data:typeof i=="object"?i:void 0,detail:k(i)||(typeof i=="string"?i:""),endpoint:e}),this.#r={status:r.status,statusText:r.statusText,elapsed:m,body:v,ok:u}}catch(s){this.#o=s?.message??String(s)}finally{this.#i=!1,this.#m(),this.#v(),this.#f()}}#y(){const t=this.#h();this.#a&&(this.#a.textContent=t),this.#g?.setAttribute("value",t)}#m(){const t=this.#d;t&&(t.toggleAttribute("loading",this.#i),t.toggleAttribute("disabled",this.#i))}#v(){const t=this.#c;if(!t||(t.replaceChildren(),!this.#o))return;const e=this.#r?.ok?"warning":"danger";t.append(p`
      <is-callout color="${e}" variant="filled-outlined" icon="mdi:alert-outline">
        <pre class="aviso-texto">${this.#o}</pre>
      </is-callout>
    `)}#f(){const t=this.#u;if(!t)return;t.replaceChildren();const e=this.#r;if(!e)return;const s=document.createElement("sw-json");s.props={value:e.body,maxHeight:"32rem"},t.append(p`
      <div class="resultado">
        <div class="resultado-meta">
          <is-tag color="${e.ok?"success":"danger"}" variant="filled" class="resultado-status">
            ${e.status} ${e.statusText}
          </is-tag>
          <span class="resultado-dato">${e.elapsed} ms</span>
          <span class="resultado-dato">
            <is-format-bytes value="${new Blob([e.body]).size}"></is-format-bytes>
          </span>
        </div>
        ${s}
      </div>
    `)}#E(){const{op:t,spec:e}=this.#t;if(this.#e.replaceChildren(),this.#a=this.#c=this.#u=this.#d=null,!t){w(this.#e,import.meta.url,"sw-try");return}const s=this.#p,o=s.filter(n=>n.in==="path"),c=s.filter(n=>n.in==="query"||n.in==="header"),i=(n,a)=>{const l=document.createElement(n);return l.props=a,l},r=o.length?i("sw-params",{params:o,values:this.#s,disabled:this.#i,titulo:"Ruta"}):null,h=c.length?i("sw-params",{params:c,values:this.#s,disabled:this.#i,titulo:"Query y cabeceras"}):null,u=y(t)?i("sw-body",{op:t,value:this.#n,disabled:this.#i}):null,m=n=>{const{name:a,value:l}=n.detail;this.#s[a]=l,this.#y()};r?.addEventListener("sw-param-change",m),h?.addEventListener("sw-param-change",m),u?.addEventListener("sw-body-change",n=>{const a=n.detail;this.#n=a.value,this.#l=a.error;const l=u.shadowRoot?.querySelector("is-textarea")??null;l&&l.value!==a.value&&(l.value=a.value)});const v=!!this.#l,d=this.#w(),f=E.has(t.method);this.#e.append(p`
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
    `),this.#a=this.#e.querySelector(".preview-url"),this.#g=this.#e.querySelector(".preview-copiar"),this.#c=this.#e.querySelector(".zona-aviso"),this.#u=this.#e.querySelector(".zona-resultado"),this.#d=this.#e.querySelector(".ejecutar"),this.#y(),this.#v(),this.#f(),this.#m(),w(this.#e,import.meta.url,"sw-try")}}T(import.meta.url,"sw-try"),$("sw-try",S);export{S as SwTry};
