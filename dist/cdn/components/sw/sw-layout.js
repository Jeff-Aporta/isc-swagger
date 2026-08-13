import{adoptCss as r,precargarCss as c,define as d,html as h,emitir as u}from"./_shared.js";const p="(max-width: 87.5rem)",m="(max-width: 60rem)";class l extends HTMLElement{#i;#e=null;#s=null;#t=()=>this.#o();constructor(){super(),this.#i=this.attachShadow({mode:"open"})}connectedCallback(){this.#l(),typeof matchMedia=="function"&&(this.#e=matchMedia(p),this.#s=matchMedia(m),this.#e.addEventListener("change",this.#t),this.#s.addEventListener("change",this.#t)),this.#o()}disconnectedCallback(){this.#e?.removeEventListener("change",this.#t),this.#s?.removeEventListener("change",this.#t),this.#e=this.#s=null}get#a(){return this.#e?.matches??!1}get#n(){return this.#s?.matches??!1}abrir(e){const i=this.#i.querySelector(`is-drawer[data-lado="${e}"]`);i&&(i.open=!0)}#o(){const e=[["inicio",this.#n],["fin",this.#a]];for(const[i,s]of e){const t=this.#i.querySelector(s?`is-drawer[data-lado="${i}"] .hueco`:`.hueco-${i}`),a=this.#i.querySelector(`slot[name="${i}"]`);t&&a&&a.parentElement!==t&&t.append(a);const n=this.#i.querySelector(`is-split-panel[data-zona="${i}"]`);n&&(s?n.setAttribute("collapse",i==="inicio"?"start":"end"):n.removeAttribute("collapse"));const o=this.#i.querySelector(`.hamburguesa-${i}`);o&&(o.hidden=!s)}u(this,"sw-layout-modo",{inicio:this.#n?"cajon":"panel",fin:this.#a?"cajon":"panel"})}#l(){this.#i.replaceChildren(),this.#i.append(h`
      <header class="cabecera">
        <is-button
          class="hamburguesa hamburguesa-inicio"
          variant="plain"
          size="small"
          hidden
          aria-label="Abrir el índice de endpoints"
          onis-click=${()=>this.abrir("inicio")}
        ><is-icon icon="mdi:menu"></is-icon></is-button>

        <div class="cabecera-slot"><slot name="cabecera"></slot></div>

        <is-button
          class="hamburguesa hamburguesa-fin"
          variant="plain"
          size="small"
          hidden
          aria-label="Abrir la petición y la respuesta"
          onis-click=${()=>this.abrir("fin")}
        ><is-icon icon="mdi:code-braces"></is-icon></is-button>
      </header>

      <is-split-panel class="split-externo" data-zona="inicio" position="18" snap="14% 18% 24%" snap-threshold="16" storage-key="sw:split:inicio">
        <div slot="start" class="lateral hueco-inicio"><slot name="inicio"></slot></div>
        <div slot="end" class="resto">
          <is-split-panel class="split-interno" data-zona="fin" position="62" snap="50% 62% 75%" snap-threshold="16" storage-key="sw:split:fin">
            <div slot="start" class="centro"><slot name="centro"></slot></div>
            <div slot="end" class="lateral hueco-fin"><slot name="fin"></slot></div>
          </is-split-panel>
        </div>
      </is-split-panel>

      <is-drawer data-lado="inicio" placement="start" label="Endpoints"><div class="hueco"></div></is-drawer>
      <is-drawer data-lado="fin" placement="end" label="Petición y respuesta"><div class="hueco"></div></is-drawer>
    `),r(this.#i,import.meta.url,"sw-layout")}}c(import.meta.url,"sw-layout"),d("sw-layout",l);export{l as SwLayout};
