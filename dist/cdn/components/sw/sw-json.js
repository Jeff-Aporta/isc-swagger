import{crearComponente as l,define as p,html as m,raw as u,esc as r}from"./_shared.js";function b(t){const e=[];let o=0;const n=/("(?:\\.|[^"\\])*"\s*:)|("(?:\\.|[^"\\])*")|(-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(\btrue\b|\bfalse\b)|(\bnull\b)/g;for(const s of t.matchAll(n)){const a=s.index??0;e.push(r(t.slice(o,a)));const i=s[1]?"k":s[2]?"s":s[3]?"n":s[4]?"b":"z";e.push(`<span class="${i}">${r(s[0])}</span>`),o=a+s[0].length}return e.push(r(t.slice(o))),e.join("")}const c=l(import.meta.url,(t,{value:e,maxHeight:o},n)=>{const s=String(e??"");n.style.setProperty("--sw-json-max",o||"28rem"),t.append(m`
      <div class="caja">
        <is-copy-button class="copiar" value="${s}" copy-label="Copiar JSON"></is-copy-button>
        <pre class="codigo"><code>${u(b(s))}</code></pre>
      </div>
    `)},{value:"",maxHeight:"28rem"},"sw-json");p("sw-json",c);export{c as SwJson};
