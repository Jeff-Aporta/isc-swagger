import{adoptCss as l,precargarCss as o,define as a,html as i}from"./_shared.js";import{DRIVERS as c,driverMeta as n,readDriver as d,writeDriver as h}from"../../js/driver.js";import"./sw-app.js";import"./sw-minidoc.js";class r extends HTMLElement{#t;#e=d();#i=null;#n=null;constructor(){super(),this.#t=this.attachShadow({mode:"open"})}get conn(){return this.#i}set conn(e){this.#i=e&&typeof e=="object"?e:null;const t=this.#n?.firstElementChild;t&&(t.conn=this.#i)}get driver(){return this.#e}set driver(e){e!==this.#e&&(this.#e=n(e).id,h(this.#e),this.isConnected&&(this.#s(),this.#r()))}connectedCallback(){this.#l()}#s(){const e=this.#t.querySelector("is-select");e&&e.value!==this.#e&&(e.value=this.#e)}#r(){const e=this.#n;if(!e)return;const t=document.createElement(this.#e);this.#i&&(t.conn=this.#i),e.replaceChildren(t)}#l(){this.#t.replaceChildren();const e=c.map(t=>i`<is-option value="${t.id}" title="${t.detalle}">${t.label}</is-option>`);this.#t.append(i`
      <div class="barra">
        <label class="etiqueta" for="sel-driver">Vista</label>
        <is-select
          id="sel-driver"
          size="small"
          value="${this.#e}"
          title="${n(this.#e).detalle}"
          onis-change=${t=>{const s=String(t.target.value??"");this.driver=s}}
        >${e}</is-select>
      </div>
      <div class="montaje"></div>
    `),this.#n=this.#t.querySelector(".montaje"),this.#r(),l(this.#t,import.meta.url,"sw-viewer")}}o(import.meta.url,"sw-viewer"),a("sw-viewer",r);export{r as SwViewer};
