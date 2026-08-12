import{crearComponente as $,define as h,html as i,emitir as g}from"./_shared.js";import{paramEnum as v,paramInputMode as f,paramTypeLabel as b,sanitizeParamInputValue as w}from"../../js/param-schema.js";function S(e,s,o,c){const t=String(e.name??""),m=b(e.schema),r=[e.description,m&&`\xB7 ${m}`].filter(Boolean).join(" "),u=v(e.schema);if(u.length)return i`
      <is-select
        class="campo"
        full-width
        label="${t}"
        hint="${r}"
        value="${s}"
        ${o?"disabled":""}
        ${e.required?"required":""}
        onis-change=${n=>c(String(n.target.value??""))}
      >
        ${u.map(n=>i`<is-option value="${n}">${n}</is-option>`)}
      </is-select>
    `;const a=e.example!=null?String(e.example):t;return i`
    <is-input
      class="campo"
      full-width
      clearable
      label="${t}"
      hint="${r}"
      placeholder="${a}"
      inputmode="${f(e.schema)}"
      value="${s}"
      ${o?"disabled":""}
      ${e.required?"required":""}
      onis-input=${n=>{const l=n.target,p=w(e.schema,l.value);p!==l.value&&(l.value=p),c(p)}}
    ></is-input>
  `}const d=$(import.meta.url,(e,{params:s,values:o,disabled:c,titulo:t},m)=>{const r=Array.isArray(s)?s.filter(a=>a?.name):[];if(!r.length)return;const u=a=>n=>g(m,"sw-param-change",{name:a,value:n});e.append(i`
      <section class="bloque">
        ${t?i`<h4 class="titulo">${t}</h4>`:null}
        <div class="campos">
          ${r.map(a=>{const n=String(a.name),l=a.in&&a.in!=="path"?i`<span class="ubicacion">${a.in}</span>`:null;return i`
              <div class="fila" data-in="${a.in??""}">
                ${S(a,o?.[n]??"",c,u(n))}
                ${l}
              </div>
            `})}
        </div>
      </section>
    `)},{params:[],values:{},disabled:!1,titulo:""},"sw-params");h("sw-params",d);export{d as SwParams};
