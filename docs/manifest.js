/**
 * manifest.js — catálogo del sitio documental.
 *
 * Única fuente de verdad: el shell (`index.html`) pinta el nav desde aquí y
 * cada entrada apunta a su página. Hay dos clases de entrada y se mantienen
 * separadas a propósito:
 *
 *   `paginas`     → documentación en prosa: por qué existe, stack, estrategias,
 *                   arquitectura, comparativa. Se leen en orden.
 *   `componentes` → un `sw-*` cada uno, con sus casos en vivo. Se consultan.
 *
 * Añadir un `sw-*` sin entrada en `componentes` lo deja fuera del sitio;
 * `tests/estructura.test.mjs` avisa si eso pasa, y también si una entrada
 * apunta a una página que no existe en disco.
 */

/** Documentación en prosa. El orden del array es el orden de lectura. */
export const paginas = [
  { tag: 'inicio', title: 'Inicio', page: 'paginas/inicio.html', icon: 'mdi:home-variant-outline', category: 'documentacion' },
  { tag: 'porque', title: 'Por qué existe', page: 'paginas/porque.html', icon: 'mdi:help-circle-outline', category: 'documentacion' },
  { tag: 'comparativa', title: 'Frente a Postman', page: 'paginas/comparativa.html', icon: 'mdi:compare-horizontal', category: 'documentacion' },
  { tag: 'stack', title: 'El stack', page: 'paginas/stack.html', icon: 'mdi:layers-triple-outline', category: 'documentacion' },
  { tag: 'arquitectura', title: 'Arquitectura', page: 'paginas/arquitectura.html', icon: 'mdi:sitemap-outline', category: 'documentacion' },
  { tag: 'estrategias', title: 'Estrategias', page: 'paginas/estrategias.html', icon: 'mdi:chess-knight', category: 'documentacion' },
  { tag: 'empezar', title: 'Empezar', page: 'paginas/empezar.html', icon: 'mdi:rocket-launch-outline', category: 'documentacion' },
];

/** Un `sw-*` por entrada. `category` agrupa el nav. */
export const componentes = [
  { tag: 'sw-app', title: 'Visor completo', page: 'previews/sw-app.html', category: 'shell' },

  { tag: 'sw-method', title: 'Método', page: 'previews/sw-method.html', category: 'atomos' },
  { tag: 'sw-path', title: 'Ruta', page: 'previews/sw-path.html', category: 'atomos' },
  { tag: 'sw-json', title: 'JSON', page: 'previews/sw-json.html', category: 'atomos' },
  { tag: 'sw-doc', title: 'Markdown', page: 'previews/sw-doc.html', category: 'atomos' },

  { tag: 'sw-params', title: 'Parámetros', page: 'previews/sw-params.html', category: 'operacion' },
  { tag: 'sw-body', title: 'Cuerpo', page: 'previews/sw-body.html', category: 'operacion' },
  { tag: 'sw-responses', title: 'Respuestas', page: 'previews/sw-responses.html', category: 'operacion' },
  { tag: 'sw-try', title: 'Probar', page: 'previews/sw-try.html', category: 'operacion' },
  { tag: 'sw-operation', title: 'Operación', page: 'previews/sw-operation.html', category: 'operacion' },

  { tag: 'sw-tag-group', title: 'Grupo de tag', page: 'previews/sw-tag-group.html', category: 'shell' },
  { tag: 'sw-info', title: 'Cabecera', page: 'previews/sw-info.html', category: 'shell' },
  { tag: 'sw-server', title: 'Servidor', page: 'previews/sw-server.html', category: 'shell' },
  { tag: 'sw-auth', title: 'Sesión', page: 'previews/sw-auth.html', category: 'shell' },
  { tag: 'sw-export', title: 'Descargas', page: 'previews/sw-export.html', category: 'shell' },
  { tag: 'sw-nav', title: 'Barra superior', page: 'previews/sw-nav.html', category: 'shell' },

  { tag: 'sw-viewer', title: 'Envoltura de drivers', page: 'previews/sw-viewer.html', category: 'shell' },
  { tag: 'sw-driver-switch', title: 'Selector de vista', page: 'previews/sw-driver-switch.html', category: 'shell' },
  { tag: 'sw-layout', title: 'Armazón de 3 zonas', page: 'previews/sw-layout.html', category: 'shell' },

  { tag: 'sw-minidoc', title: 'Visor por vistas', page: 'previews/sw-minidoc.html', category: 'minidoc' },
  { tag: 'sw-minidoc-view', title: 'Ficha de operación', page: 'previews/sw-minidoc-view.html', category: 'minidoc' },
  { tag: 'sw-minidoc-code', title: 'Petición y respuesta', page: 'previews/sw-minidoc-code.html', category: 'minidoc' },
];

/** Orden y etiqueta de los grupos del nav. */
export const categorias = [
  { id: 'documentacion', label: 'Documentación' },
  { id: 'atomos', label: 'Átomos' },
  { id: 'operacion', label: 'Operación' },
  { id: 'shell', label: 'Shell' },
  { id: 'minidoc', label: 'Driver minidoc' },
];

export default [...paginas, ...componentes];
