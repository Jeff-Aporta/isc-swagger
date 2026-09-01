const $ = (sel) => document.querySelector(sel);
function crear(tag, props) {
  const node = document.createElement(tag);
  if (props !== void 0) node.props = props;
  return node;
}
function caso(titulo, nota, ...nodos) {
  const section = document.createElement("section");
  section.className = "caso";
  const h = document.createElement("h2");
  h.className = "caso__titulo";
  h.textContent = titulo;
  section.append(h);
  if (nota) {
    const p = document.createElement("p");
    p.className = "caso__nota";
    p.textContent = nota;
    section.append(p);
  }
  const cuerpo = document.createElement("div");
  cuerpo.className = "caso__cuerpo";
  cuerpo.append(...nodos.filter((n) => n != null));
  section.append(cuerpo);
  return section;
}
function montar(tag, descripcion, casos) {
  const main = $(".preview") ?? document.body;
  const head = document.createElement("header");
  head.className = "preview__head";
  head.innerHTML = `<code class="preview__tag">&lt;${tag}&gt;</code>`;
  if (descripcion) {
    const p = document.createElement("p");
    p.className = "preview__desc";
    p.textContent = descripcion;
    head.append(p);
  }
  main.append(head, ...casos);
  document.title = `${tag} \xB7 preview`;
}
function registrarEventos(nodo, eventos) {
  const log = document.createElement("div");
  log.className = "eventos";
  log.innerHTML = '<span class="eventos__vacio">Sin eventos todav\xEDa.</span>';
  for (const nombre of eventos) {
    nodo.addEventListener(nombre, (e) => {
      const linea = document.createElement("code");
      linea.className = "eventos__linea";
      const detalle = e instanceof CustomEvent ? e.detail : void 0;
      linea.textContent = `${nombre} \u2192 ${JSON.stringify(detalle ?? {})}`;
      if (log.firstElementChild?.classList.contains("eventos__vacio")) log.replaceChildren();
      log.prepend(linea);
      while (log.childElementCount > 8) log.lastElementChild.remove();
    });
  }
  return log;
}
export {
  caso,
  crear,
  montar,
  registrarEventos
};
