/**
 * preview-boot.js — arranque común de las previews.
 *
 * Cada preview es un HTML suelto que se abre dentro del iframe del shell o a
 * pelo en una pestaña. Aquí se resuelve el contexto (tema, paleta, modo
 * embebido) desde `?s=` y se escucha al shell para los cambios en caliente.
 *
 * JS plano, síncrono y en `<head>`: si el tema se aplicara después del primer
 * pintado, cada navegación entre previews parpadearía en claro.
 */
(function () {
  var TEMAS = { dark: 1, light: 1 };
  var raiz = document.documentElement;
  var estado = {};

  try {
    var s = new URLSearchParams(location.search).get('s');
    if (s) {
      var pad = s.replace(/-/g, '+').replace(/_/g, '/');
      while (pad.length % 4) pad += '=';
      estado = JSON.parse(decodeURIComponent(escape(atob(pad)))) || {};
    }
  } catch (e) {
    /* `?s=` corrupto: se sigue con los valores por defecto */
  }

  function aplicar(tema, paleta) {
    tema = TEMAS[tema] ? tema : 'dark';
    raiz.classList.toggle('theme-dark', tema === 'dark');
    raiz.classList.toggle('theme-light', tema === 'light');
    raiz.dataset.theme = tema;
    if (paleta) raiz.dataset.palette = paleta;
  }

  aplicar(estado.theme, estado.palette || 'contapyme');
  if (estado.embed) raiz.setAttribute('data-embed', '1');

  // El shell manda el contexto al cargar el iframe y en cada toggle.
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin) return;
    if (!e.data || e.data.type !== 'is-context') return;
    aplicar(e.data.theme, e.data.palette);
  });
})();
