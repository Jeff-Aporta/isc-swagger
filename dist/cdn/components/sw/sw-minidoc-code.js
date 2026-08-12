import{adoptCss as c,precargarCss as h,define as m,html as p}from"./_shared.js";import{buildCurl as b}from"../../js/curl.js";import{jsonPretty as l,extractJsonExample as f,responseTone as g,toneToIsColor as v}from"../../js/openapi.js";import"./sw-json.js";class u extends HTMLElement{#s;#e={op:null,spec:null,serverBase:"",requiereBearer:!1};#t="";#o=null;constructor(){super(),this.#s=this.attachShadow({mode:"open"})}connectedCallback(){this.#i()}get props(){return this.#e}set props(t){const e=this.#e.op?.operationId;this.#e={...this.#e,...t??{}},this.#e.op?.operationId!==e&&(this.#t=""),this.isConnected&&this.#i()}get#a(){return Object.keys(this.#e.op?.responses??{}).sort((e,s)=>{const o=Number(e)||999,n=Number(s)||999;return o-n})}#n(t){const e=this.#e.op?.responses?.[t],s=f(e?.content?.["application/json"]);if(s!=null)return l(s);const o=e?.content?.["application/json"]?.schema;return o?l(o):e?.description?`// ${e.description}`:"// Sin cuerpo documentado"}#r(){const t=this.#o;if(!t)return;for(const s of this.#s.querySelectorAll(".estado"))s.toggleAttribute("data-activo",s.dataset.code===this.#t);const e=document.createElement("sw-json");e.props={value:this.#n(this.#t),maxHeight:"26rem"},t.replaceChildren(e)}#i(){const{op:t,spec:e,serverBase:s,requiereBearer:o}=this.#e;if(this.#s.replaceChildren(),this.#o=null,!t){c(this.#s,import.meta.url,"sw-minidoc-code");return}const n=b(t,e,s,o),a=document.createElement("sw-json");a.props={value:n.texto,maxHeight:"18rem"};const i=this.#a;(!this.#t||!i.includes(this.#t))&&(this.#t=i[0]??"");const d=i.map(r=>p`
        <button
          type="button"
          class="estado"
          data-code="${r}"
          data-tono="${g(r)}"
          onclick=${()=>{this.#t=r,this.#r()}}
        >${r}</button>
      `);this.#s.append(p`
      <section class="panel">
        <header class="panel-cab">
          <span class="panel-titulo">cURL</span>
          <is-copy-button value="${n.texto}" copy-label="Copiar petición"></is-copy-button>
        </header>
        ${a}
      </section>

      <section class="panel">
        <header class="panel-cab estados" role="tablist">
          ${d}
          <is-copy-button class="al-final" value="${this.#n(this.#t)}" copy-label="Copiar respuesta"></is-copy-button>
        </header>
        <div class="cuerpo"></div>
      </section>
    `),this.#o=this.#s.querySelector(".cuerpo"),this.#r(),c(this.#s,import.meta.url,"sw-minidoc-code")}}h(import.meta.url,"sw-minidoc-code"),m("sw-minidoc-code",u);export{u as SwMinidocCode,v as toneToIsColor};
