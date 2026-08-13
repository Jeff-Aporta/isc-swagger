import{adoptCss as a,precargarCss as u,define as h,html as n}from"./_shared.js";import{buildCurl as m}from"../../js/curl.js";import{defaultTryItBodyText as b,formatBodyExample as y,resolveTryItBodyExample as f,resolveTryItBodyExamples as g}from"../../js/tryit-body.js";import{jsonPretty as l,extractJsonExample as v,responseTone as E,toneToIsColor as j}from"../../js/openapi.js";import"./sw-json.js";class c extends HTMLElement{#e;#t={op:null,spec:null,serverBase:"",requiereBearer:!1};#s="";#o="";#i="curl";#a=null;#l=null;#n=null;constructor(){super(),this.#e=this.attachShadow({mode:"open"})}connectedCallback(){this.#b()}get props(){return this.#t}set props(t){const e=this.#t.op?.operationId;this.#t={...this.#t,...t??{}},this.#t.op?.operationId!==e&&(this.#s="",this.#o="",this.#i="curl"),this.isConnected&&this.#b()}get#p(){return g(this.#t.op??void 0)}get#r(){const t=this.#p;return t.length?(t.find(s=>s.id===this.#o)??t[0])?.example:f(this.#t.op??void 0)}get#y(){const t=this.#r;return t!==void 0?y(t):b(this.#t.op??void 0)}get#f(){const{op:t,spec:e,serverBase:s,requiereBearer:o}=this.#t;return m(t,e,s,o,this.#r).texto}get#d(){return this.#i==="body"?this.#y:this.#f}get#g(){return Object.keys(this.#t.op?.responses??{}).sort((e,s)=>{const o=Number(e)||999,r=Number(s)||999;return o-r})}#u(t){const e=this.#t.op?.responses?.[t],s=v(e?.content?.["application/json"]);if(s!=null)return l(s);const o=e?.content?.["application/json"]?.schema;return o?l(o):e?.description?`// ${e.description}`:"// Sin cuerpo documentado"}#c(){const t=this.#l;if(!t)return;for(const s of this.#e.querySelectorAll(".vista"))s.toggleAttribute("data-activo",s.dataset.vista===this.#i);for(const s of this.#e.querySelectorAll(".ejemplo"))s.toggleAttribute("data-activo",s.dataset.id===this.#o);const e=document.createElement("sw-json");e.props={value:this.#d,maxHeight:this.#i==="body"?"22rem":"18rem"},t.replaceChildren(e),this.#n&&(this.#n.value=this.#d)}#h(){const t=this.#a;if(!t)return;for(const s of this.#e.querySelectorAll(".estado"))s.toggleAttribute("data-activo",s.dataset.code===this.#s);const e=document.createElement("sw-json");e.props={value:this.#u(this.#s),maxHeight:"26rem"},t.replaceChildren(e)}#v(t){this.#o=t,this.#c()}#m(t){this.#i=t,this.#c()}#b(){const{op:t}=this.#t;if(this.#e.replaceChildren(),this.#a=null,this.#l=null,this.#n=null,!t){a(this.#e,import.meta.url,"sw-minidoc-code");return}const e=this.#p;e.length?e.some(i=>i.id===this.#o)||(this.#o=e[0].id):this.#o="";const s=this.#r!==void 0&&this.#r!==null,o=this.#g;(!this.#s||!o.includes(this.#s))&&(this.#s=o[0]??"");const r=e.length?n`
          <div class="ejemplos" role="group" aria-label="Ejemplos de body">
            ${e.map(i=>n`
                <button
                  type="button"
                  class="ejemplo"
                  data-id="${i.id}"
                  title="Usar este body en cURL y Body raw"
                  onclick=${()=>this.#v(i.id)}
                >${i.label}</button>
              `)}
          </div>
        `:null,p=s?n`
          <button type="button" class="vista" data-vista="curl" onclick=${()=>this.#m("curl")}>cURL</button>
          <button type="button" class="vista" data-vista="body" onclick=${()=>this.#m("body")}>Body raw</button>
        `:n`<span class="panel-titulo">cURL</span>`,d=o.map(i=>n`
        <button
          type="button"
          class="estado"
          data-code="${i}"
          data-tono="${E(i)}"
          onclick=${()=>{this.#s=i,this.#h()}}
        >${i}</button>
      `);this.#e.append(n`
      <section class="panel">
        <header class="panel-cab vistas" role="tablist" aria-label="Formato de la petición">
          ${p}
          <is-copy-button class="al-final" copy-label="Copiar petición"></is-copy-button>
        </header>
        ${r}
        <div class="peticion"></div>
      </section>

      <section class="panel">
        <header class="panel-cab estados" role="tablist">
          ${d}
          <is-copy-button class="al-final" value="${this.#u(this.#s)}" copy-label="Copiar respuesta"></is-copy-button>
        </header>
        <div class="cuerpo"></div>
      </section>
    `),this.#l=this.#e.querySelector(".peticion"),this.#a=this.#e.querySelector(".cuerpo"),this.#n=this.#e.querySelector(".vistas is-copy-button, .panel-cab is-copy-button"),this.#c(),this.#h(),a(this.#e,import.meta.url,"sw-minidoc-code")}}u(import.meta.url,"sw-minidoc-code"),h("sw-minidoc-code",c);export{c as SwMinidocCode,j as toneToIsColor};
