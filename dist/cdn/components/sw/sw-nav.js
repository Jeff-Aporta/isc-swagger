import{adoptCss as m,precargarCss as v,define as g,html as i,emitir as t,esc as w}from"./_shared.js";import"./sw-auth.js";import"./sw-driver-switch.js";import"./sw-export.js";class u extends HTMLElement{#e;#s={brand:{},tabs:[],activeTab:"",query:"",spec:null,config:{},authEnabled:!1,auth:{},session:null};#i=null;constructor(){super(),this.#e=this.attachShadow({mode:"open"})}connectedCallback(){this.#t()}get props(){return this.#s}set props(s){const a={...this.#s};this.#s={...this.#s,...s??{}},this.isConnected&&(a.query!==this.#s.query&&Object.keys(s??{}).length===1||this.#t())}abrirLogin(s){this.#i?.abrirLogin(s)}#t(){const{brand:s,tabs:a,activeTab:r,query:o,spec:l,config:p,authEnabled:d,auth:h,session:b}=this.#s;this.#e.replaceChildren();const n=document.createElement("sw-auth");n.props={authEnabled:d,auth:h,session:b},n.addEventListener("sw-session-change",e=>t(this,"sw-session-change",e.detail)),this.#i=n;const c=document.createElement("sw-export");c.props={spec:l,config:p},this.#e.append(i`
      <header class="barra">
        <button
          type="button"
          class="marca"
          aria-label="Reiniciar visor"
          title="Reiniciar visor"
          onclick=${()=>t(this,"sw-reset",null)}
        >
          ${s?.icon?i`<is-icon class="marca-icono" icon="${s.icon}"></is-icon>`:null}
          <div class="marca-texto">
            <span class="marca-titulo">${s?.title??l?.info?.title??"API"}</span>
            ${s?.subtitle?i`<span class="marca-sub">${s.subtitle}</span>`:null}
          </div>
        </button>

        <is-input
          class="busqueda"
          type="search"
          clearable
          placeholder="Buscar ruta, resumen u operationId…"
          aria-label="Buscar operaciones"
          value="${o}"
          onis-input=${e=>t(this,"sw-search",{query:String(e.target.value??"")})}
        >
          <is-icon slot="start" icon="mdi:magnify"></is-icon>
        </is-input>

        <div class="acciones">
          ${c}
          ${n}
          <sw-driver-switch></sw-driver-switch>
          <is-theme-toggle></is-theme-toggle>
        </div>
      </header>

      ${o.trim()?i`
            <div class="busqueda-titulo" role="status" aria-live="polite">
              <is-icon icon="mdi:magnify"></is-icon>
              <span>Resultados para <code class="busqueda-titulo__q">${w(o)}</code></span>
              <button
                type="button"
                class="busqueda-limpiar"
                aria-label="Limpiar búsqueda"
                onclick=${()=>t(this,"sw-search",{query:""})}
              >
                <is-icon icon="mdi:close"></is-icon>
                Limpiar
              </button>
            </div>
          `:a.length>1?i`
              <nav class="secciones" role="tablist" aria-label="Secciones">
                ${a.map(e=>i`
                    <button
                      type="button"
                      class="seccion"
                      role="tab"
                      ${e.id===r?"selected":""}
                      aria-selected="${e.id===r?"true":"false"}"
                      onclick=${()=>t(this,"sw-nav-tab",{tab:e.id})}
                    >
                      ${e.icon?i`<is-icon icon="${e.icon}"></is-icon>`:null}
                      ${e.label}
                    </button>
                  `)}
              </nav>
            `:null}
    `),m(this.#e,import.meta.url,"sw-nav")}}v(import.meta.url,"sw-nav"),g("sw-nav",u);export{u as SwNav};
