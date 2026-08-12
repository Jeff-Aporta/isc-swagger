/**
 * boot.js — tema y paleta antes del primer pintado.
 *
 * Único archivo en JavaScript plano del proyecto: corre síncrono en <head>,
 * antes de que exista ningún módulo. Cualquier otra cosa llegaría tarde y la
 * página parpadearía en claro antes de aplicar el tema.
 *
 * Precedencia: `?s=` (enlace compartido) → localStorage → dark.
 * `prefers-color-scheme` NO participa: el tema es explícito, igual que en el
 * kit is-*, para que un enlace compartido se vea igual en cualquier equipo.
 */
(function () {
  var TEMAS = { dark: 1, light: 1 };
  var raiz = document.documentElement;
  var tema = null;
  var paleta = 'contapyme';

  var s = new URLSearchParams(location.search).get('s');
  if (s) {
    try {
      var pad = s.replace(/-/g, '+').replace(/_/g, '/');
      while (pad.length % 4) pad += '=';
      var estado = JSON.parse(decodeURIComponent(escape(atob(pad))));
      if (TEMAS[estado.theme]) tema = estado.theme;
      if (estado.palette) paleta = String(estado.palette);
    } catch (e) {
      /* `?s=` corrupto: se ignora y se sigue con el tema guardado */
    }
  }

  if (!tema) {
    try {
      var guardado = localStorage.getItem('is-theme');
      if (TEMAS[guardado]) tema = guardado;
    } catch (e) {
      /* almacenamiento bloqueado */
    }
  }

  tema = tema || 'dark';

  raiz.classList.toggle('theme-dark', tema === 'dark');
  raiz.classList.toggle('theme-light', tema === 'light');
  raiz.dataset.theme = tema;
  raiz.dataset.palette = paleta;

  // <is-theme-toggle> escribe sobre <html>; se persiste para la próxima visita.
  new MutationObserver(function () {
    try {
      localStorage.setItem('is-theme', raiz.dataset.theme || 'dark');
    } catch (e) {
      /* almacenamiento bloqueado */
    }
  }).observe(raiz, { attributes: true, attributeFilter: ['data-theme'] });
})();
