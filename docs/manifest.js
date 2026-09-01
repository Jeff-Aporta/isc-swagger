const paginas = [
  { tag: "inicio", title: "Inicio", page: "paginas/inicio.html", icon: "mdi:home-variant-outline", category: "documentacion" },
  { tag: "porque", title: "Por qu\xE9 existe", page: "paginas/porque.html", icon: "mdi:help-circle-outline", category: "documentacion" },
  { tag: "comparativa", title: "Frente a Postman", page: "paginas/comparativa.html", icon: "mdi:compare-horizontal", category: "documentacion" },
  { tag: "stack", title: "El stack", page: "paginas/stack.html", icon: "mdi:layers-triple-outline", category: "documentacion" },
  { tag: "arquitectura", title: "Arquitectura", page: "paginas/arquitectura.html", icon: "mdi:sitemap-outline", category: "documentacion" },
  { tag: "estrategias", title: "Estrategias", page: "paginas/estrategias.html", icon: "mdi:chess-knight", category: "documentacion" },
  { tag: "empezar", title: "Empezar", page: "paginas/empezar.html", icon: "mdi:rocket-launch-outline", category: "documentacion" }
];
const componentes = [
  { tag: "sw-app", title: "Visor completo", page: "previews/sw-app.html", category: "shell" },
  { tag: "sw-method", title: "M\xE9todo", page: "previews/sw-method.html", category: "atomos" },
  { tag: "sw-path", title: "Ruta", page: "previews/sw-path.html", category: "atomos" },
  { tag: "sw-json", title: "JSON", page: "previews/sw-json.html", category: "atomos" },
  { tag: "sw-doc", title: "Markdown", page: "previews/sw-doc.html", category: "atomos" },
  { tag: "sw-params", title: "Par\xE1metros", page: "previews/sw-params.html", category: "operacion" },
  { tag: "sw-body", title: "Cuerpo", page: "previews/sw-body.html", category: "operacion" },
  { tag: "sw-responses", title: "Respuestas", page: "previews/sw-responses.html", category: "operacion" },
  { tag: "sw-try", title: "Probar", page: "previews/sw-try.html", category: "operacion" },
  { tag: "sw-operation", title: "Operaci\xF3n", page: "previews/sw-operation.html", category: "operacion" },
  { tag: "sw-tag-group", title: "Grupo de tag", page: "previews/sw-tag-group.html", category: "shell" },
  { tag: "sw-info", title: "Cabecera", page: "previews/sw-info.html", category: "shell" },
  { tag: "sw-home", title: "Portada", page: "previews/sw-home.html", category: "shell" },
  { tag: "sw-server", title: "Servidor", page: "previews/sw-server.html", category: "shell" },
  { tag: "sw-auth", title: "Sesi\xF3n", page: "previews/sw-auth.html", category: "shell" },
  { tag: "sw-export", title: "Descargas", page: "previews/sw-export.html", category: "shell" },
  { tag: "sw-doc-reload", title: "Actualizar documento", page: "previews/sw-doc-reload.html", category: "shell" },
  { tag: "sw-doc-actions", title: "Documento (pill)", page: "previews/sw-doc-actions.html", category: "shell" },
  { tag: "sw-nav", title: "Barra superior", page: "previews/sw-nav.html", category: "shell" },
  { tag: "sw-viewer", title: "Envoltura de drivers", page: "previews/sw-viewer.html", category: "shell" },
  { tag: "sw-driver-switch", title: "Selector de vista", page: "previews/sw-driver-switch.html", category: "shell" },
  { tag: "sw-layout", title: "Armaz\xF3n de 3 zonas", page: "previews/sw-layout.html", category: "shell" },
  { tag: "sw-minidoc", title: "Visor por vistas", page: "previews/sw-minidoc.html", category: "minidoc" },
  { tag: "sw-minidoc-view", title: "Ficha de operaci\xF3n", page: "previews/sw-minidoc-view.html", category: "minidoc" },
  { tag: "sw-minidoc-code", title: "Petici\xF3n y respuesta", page: "previews/sw-minidoc-code.html", category: "minidoc" }
];
const categorias = [
  { id: "documentacion", label: "Documentaci\xF3n" },
  { id: "atomos", label: "\xC1tomos" },
  { id: "operacion", label: "Operaci\xF3n" },
  { id: "shell", label: "Shell" },
  { id: "minidoc", label: "Driver minidoc" }
];
var stdin_default = [...paginas, ...componentes];
export {
  categorias,
  componentes,
  stdin_default as default,
  paginas
};
