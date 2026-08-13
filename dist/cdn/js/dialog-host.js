const s="sw-dialog-host-css",n=`
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
    border: 1px solid var(--is-border-soft, var(--is-border, #1f242b));
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
    width: 100%;
  }
  is-dialog.sw-dialog-try,
  is-dialog.sw-dialog-confirm {
    --is-dialog-width: min(52rem, calc(100vw - 2rem));
    --is-dialog-spacing: 1.1rem;
    --spacing: var(--is-dialog-spacing);
  }
  is-dialog.sw-dialog-try sw-try {
    display: block;
    min-width: 0;
  }
`;function r(){if(typeof document>"u"||document.getElementById(s))return;const i=document.createElement("style");i.id=s,i.textContent=n,document.head.appendChild(i)}function a(i){r();const e=document.createElement("is-dialog");e.setAttribute("label",i.label),e.setAttribute("light-dismiss",""),i.className&&e.classList.add(...i.className.split(/\s+/).filter(Boolean));const o=i.width||"min(52rem, calc(100vw - 2rem))";e.setAttribute("width",o),e.style.setProperty("--is-dialog-width",o),e.style.setProperty("--spacing","var(--is-dialog-spacing, 1.1rem)"),e.append(i.content),e.addEventListener("is-hide",()=>e.remove()),e.addEventListener("is-after-hide",()=>e.remove()),document.body.appendChild(e);const t=e;return typeof t.show=="function"?t.show():t.open=!0,e}export{r as ensureDialogHostStyles,a as openHostDialog};
