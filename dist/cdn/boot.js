(() => {
  (function() {
    var TEMAS = { dark: 1, light: 1 };
    var raiz = document.documentElement;
    var tema = null;
    var paleta = "contapyme";
    var s = new URLSearchParams(location.search).get("s");
    if (s) {
      try {
        var pad = s.replace(/-/g, "+").replace(/_/g, "/");
        while (pad.length % 4) pad += "=";
        var estado = JSON.parse(decodeURIComponent(escape(atob(pad))));
        if (TEMAS[estado.theme]) tema = estado.theme;
        if (estado.palette) paleta = String(estado.palette);
      } catch (e) {
      }
    }
    if (!tema) {
      try {
        var guardado = localStorage.getItem("is-theme");
        if (guardado && TEMAS[guardado]) tema = guardado;
      } catch (e) {
      }
    }
    tema = tema || "dark";
    raiz.classList.toggle("theme-dark", tema === "dark");
    raiz.classList.toggle("theme-light", tema === "light");
    raiz.dataset.theme = tema;
    raiz.dataset.palette = paleta;
    new MutationObserver(function() {
      try {
        localStorage.setItem("is-theme", raiz.dataset.theme || "dark");
      } catch (e) {
      }
    }).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
  })();
})();
