/**
 * preview-kit.js — utilidades que comparten todas las previews.
 *
 * Una preview declara **datos**, no chrome: `montar()` crea el componente, le
 * asigna `props` y lo envuelve en una tarjeta con título. Escribir ese
 * andamiaje a mano en cada archivo es lo que convirtió las previews del kit en
 * 400 líneas por tag.
 */

const $ = (sel: string) => document.querySelector<HTMLElement>(sel);

/**
 * Crea un componente con sus props y lo devuelve.
 * `props` se asigna por propiedad, nunca por atributo: los payloads del visor
 * llevan objetos anidados.
 */
export function crear(tag: string, props?: unknown): HTMLElement {
  const node = document.createElement(tag) as HTMLElement & { props?: unknown };
  if (props !== undefined) node.props = props;
  return node;
}

/** Sección con título, nota opcional y contenido. */
export function caso(
  titulo: string,
  nota: string | null | undefined,
  ...nodos: (Node | null | undefined)[]
): HTMLElement {
  const section = document.createElement('section');
  section.className = 'caso';

  const h = document.createElement('h2');
  h.className = 'caso__titulo';
  h.textContent = titulo;
  section.append(h);

  if (nota) {
    const p = document.createElement('p');
    p.className = 'caso__nota';
    p.textContent = nota;
    section.append(p);
  }

  const cuerpo = document.createElement('div');
  cuerpo.className = 'caso__cuerpo';
  cuerpo.append(...nodos.filter((n): n is Node => n != null));
  section.append(cuerpo);

  return section;
}

/** Monta los casos dentro de `<main class="preview">` y sella el encabezado. */
export function montar(tag: string, descripcion: string | null | undefined, casos: Node[]): void {
  const main = $('.preview') ?? document.body;

  const head = document.createElement('header');
  head.className = 'preview__head';
  head.innerHTML = `<code class="preview__tag">&lt;${tag}&gt;</code>`;
  if (descripcion) {
    const p = document.createElement('p');
    p.className = 'preview__desc';
    p.textContent = descripcion;
    head.append(p);
  }
  main.append(head, ...casos);
  document.title = `${tag} · preview`;
}

/** Registra los eventos del componente en un panel, para verlos disparar. */
export function registrarEventos(nodo: EventTarget, eventos: readonly string[]): HTMLElement {
  const log = document.createElement('div');
  log.className = 'eventos';
  log.innerHTML = '<span class="eventos__vacio">Sin eventos todavía.</span>';

  for (const nombre of eventos) {
    nodo.addEventListener(nombre, (e: Event) => {
      const linea = document.createElement('code');
      linea.className = 'eventos__linea';
      const detalle = e instanceof CustomEvent ? e.detail : undefined;
      linea.textContent = `${nombre} → ${JSON.stringify(detalle ?? {})}`;
      if (log.firstElementChild?.classList.contains('eventos__vacio')) log.replaceChildren();
      log.prepend(linea);
      // Un log infinito hace crecer la página sin fin dentro del iframe.
      while (log.childElementCount > 8) log.lastElementChild!.remove();
    });
  }
  return log;
}
