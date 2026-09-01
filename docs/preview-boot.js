(() => {
  (function() {
    var TEMAS = { dark: 1, light: 1 };
    var raiz = document.documentElement;
    var estado = {};
    try {
      var s = new URLSearchParams(location.search).get("s");
      if (s) {
        var pad = s.replace(/-/g, "+").replace(/_/g, "/");
        while (pad.length % 4) pad += "=";
        estado = JSON.parse(decodeURIComponent(escape(atob(pad)))) || {};
      }
    } catch (e) {
    }
    function aplicar(tema, paleta) {
      tema = tema && TEMAS[tema] ? tema : "dark";
      raiz.classList.toggle("theme-dark", tema === "dark");
      raiz.classList.toggle("theme-light", tema === "light");
      raiz.dataset.theme = tema;
      if (paleta) raiz.dataset.palette = paleta;
    }
    aplicar(estado.theme, estado.palette || "contapyme");
    if (estado.embed) raiz.setAttribute("data-embed", "1");
    window.addEventListener("message", function(e) {
      if (e.origin !== location.origin) return;
      if (!e.data || e.data.type !== "is-context") return;
      aplicar(e.data.theme, e.data.palette);
    });
  })();
})();
