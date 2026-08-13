const i="sw-dialog-host-css",n=`
  .sw-confirmar-texto {
    margin: 0 0 0.75rem;
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--is-text, #e6edf3);
  }
  .sw-confirmar-url {
    display: block;
    margin: 0 0 0.25rem;
    padding: 0.65rem 0.75rem;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: 0.5rem;
    background: var(--is-code-bg, #0f1318);
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-mono, ui-monospace, "Cascadia Code", Menlo, monospace);
    font-size: 0.75rem;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }
  .sw-confirmar-acciones {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  is-dialog.sw-dialog-try,
  is-dialog.sw-dialog-confirm {
    --is-dialog-width: min(52rem, calc(100vw - 2rem));
  }
`;function r(){if(typeof document>"u"||document.getElementById(i))return;const t=document.createElement("style");t.id=i,t.textContent=n,document.head.appendChild(t)}function s(t){r();const e=document.createElement("is-dialog");e.setAttribute("label",t.label),t.className&&e.classList.add(...t.className.split(/\s+/).filter(Boolean)),t.width&&e.style.setProperty("--is-dialog-width",t.width),e.append(t.content),e.addEventListener("is-hide",()=>e.remove()),e.addEventListener("is-after-hide",()=>e.remove()),document.body.appendChild(e);const o=e;return typeof o.show=="function"?o.show():o.open=!0,e}export{r as ensureDialogHostStyles,s as openHostDialog};
