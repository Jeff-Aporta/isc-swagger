import{adoptCss as l,precargarCss as g,define as b,html as a,emitir as w,avisar as r}from"./_shared.js";import{clearJwt as f,fetchTestJwt as k,getStoredJwt as E,normalizeJwt as S,readCredentials as T,saveCredentials as L,sessionLabel as $,storeJwt as d}from"../../js/auth.js";class u extends HTMLElement{#e;#a={authEnabled:!1,auth:{},session:null};#s=null;#i=!1;#t="";constructor(){super(),this.#e=this.attachShadow({mode:"open"})}connectedCallback(){this.#o()}get props(){return this.#a}set props(e){this.#a={...this.#a,...e??{}},this.isConnected&&this.#o()}abrirLogin(e){e&&(this.#t=e),this.#o(),this.#s?.show()}#n(){w(this,"sw-session-change",{session:E()})}async#r(e,s,o){const{auth:t}=this.#a;this.#i=!0,this.#t="",this.#o(),this.#s?.show();try{const i=await k(t.loginUrl,e,s,{loginPath:t.loginPath,loginKind:t.loginKind,appId:t.app});d(i.token,{username:e,nombre:i.nombre,expiresAt:i.expiresAt}),L(e,s,o),this.#i=!1,this.#n(),r("Sesi\xF3n iniciada.","success"),this.#s?.hide()}catch(i){this.#i=!1,this.#t=i?.message??String(i),this.#o(),this.#s?.show()}}#l(e){const s=S(e);if(!s){this.#t="Pega un JWT v\xE1lido (con o sin el prefijo \xABBearer\xBB).",this.#o(),this.#s?.show();return}d(s,{username:"JWT pegado"}),this.#n(),r("Token guardado para esta pesta\xF1a.","success"),this.#s?.hide()}#d(){f(),this.#n(),r("Sesi\xF3n cerrada.")}#o(){const{authEnabled:e,session:s}=this.#a;if(this.#e.replaceChildren(),this.#s=null,!e){l(this.#e,import.meta.url,"sw-auth");return}const o=T(),t=!!s?.token;this.#e.append(a`
      <div class="auth">
        ${t?a`
              <is-dropdown class="menu">
                <is-button slot="trigger" variant="outlined" color="success" with-caret>
                  <is-icon slot="start" icon="mdi:account-check-outline"></is-icon>
                  ${$(s)}
                </is-button>
                <is-dropdown-item onclick=${()=>this.abrirLogin()}>Cambiar sesión</is-dropdown-item>
                <is-dropdown-item color="danger" onclick=${()=>this.#d()}>Cerrar sesión</is-dropdown-item>
              </is-dropdown>
            `:a`
              <is-button variant="outlined" color="neutral" onis-click=${()=>this.abrirLogin()}>
                <is-icon slot="start" icon="mdi:login-variant"></is-icon>
                Iniciar sesión
              </is-button>
            `}

        <is-dialog class="dialogo" label="Sesión para probar endpoints">
          ${this.#t?a`
                <is-callout color="danger" variant="filled-outlined" icon="mdi:alert-outline">
                  <pre class="error">${this.#t}</pre>
                </is-callout>
              `:null}

          <form
            class="formulario"
            onsubmit=${h=>{h.preventDefault();const n=this.#e,p=n.querySelector("#usuario")?.value??"",m=n.querySelector("#clave")?.value??"",v=n.querySelector("#recordar")?.checked??!1;this.#r(p,m,v)}}
          >
            <is-input
              id="usuario"
              full-width
              label="Usuario o correo"
              autocomplete="username"
              value="${o.username}"
              ${this.#i?"disabled":""}
            ></is-input>
            <is-input
              id="clave"
              type="password"
              full-width
              password-toggle
              label="Contraseña"
              autocomplete="current-password"
              value="${o.password}"
              ${this.#i?"disabled":""}
            ></is-input>
            <is-checkbox id="recordar" ${o.remember?"checked":""}>
              Recordar en este equipo
            </is-checkbox>
            <p class="nota">
              El token vive solo en esta pestaña. «Recordar» guarda las credenciales
              ofuscadas en este navegador; no lo actives en un equipo compartido.
            </p>
            <is-button type="submit" color="brand" ${this.#i?"loading":""}>Entrar</is-button>
          </form>

          <is-divider></is-divider>

          <div class="pegar">
            <is-input
              id="token"
              full-width
              label="…o pega un JWT"
              placeholder="eyJhbGciOi…"
              spellcheck="false"
            ></is-input>
            <is-button
              variant="outlined"
              color="neutral"
              onis-click=${()=>this.#l(this.#e.querySelector("#token")?.value??"")}
            >
              Usar token
            </is-button>
          </div>
        </is-dialog>
      </div>
    `),this.#s=this.#e.querySelector(".dialogo");const i=this.#e.querySelector('is-button[type="submit"]'),c=this.#e.querySelector("form");i?.addEventListener("is-click",()=>c?.requestSubmit()),l(this.#e,import.meta.url,"sw-auth")}}g(import.meta.url,"sw-auth"),b("sw-auth",u);export{u as SwAuth};
