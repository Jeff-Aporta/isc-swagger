/**
 * <sw-json> — bloque de JSON con resaltado y botón de copiar.
 *
 * El resaltado se hace sobre el texto ya escapado con una sola pasada de
 * regex: no hay parser porque el valor puede no ser JSON válido (un 500 que
 * devuelve HTML tiene que verse igual de bien).
 */

import { crearComponente, define, html, raw, esc } from './_shared.js';

interface Props {
  value: string;
  /** Alto máximo antes de hacer scroll interno. */
  maxHeight: string;
}

/**
 * Tokeniza claves, cadenas, números, booleanos y `null`.
 *
 * Se tokeniza el texto **crudo** y se escapa dentro del reemplazo: escapar
 * antes convierte las comillas en `&quot;` y la regex deja de reconocer
 * cadenas y claves — el bloque se pinta entero sin color y nada falla.
 *
 * El orden de las alternativas importa: la clave va primera y la cadena
 * después, para que un número dentro de un string no se coloree como número.
 */
function resaltar(texto: string): string {
  const partes: string[] = [];
  let ultimo = 0;
  const re =
    /("(?:\\.|[^"\\])*"\s*:)|("(?:\\.|[^"\\])*")|(-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(\btrue\b|\bfalse\b)|(\bnull\b)/g;

  for (const m of texto.matchAll(re)) {
    const i = m.index ?? 0;
    partes.push(esc(texto.slice(ultimo, i)));
    const clase = m[1] ? 'k' : m[2] ? 's' : m[3] ? 'n' : m[4] ? 'b' : 'z';
    partes.push(`<span class="${clase}">${esc(m[0])}</span>`);
    ultimo = i + m[0].length;
  }
  partes.push(esc(texto.slice(ultimo)));
  return partes.join('');
}

const SwJson = crearComponente<Props>(
  import.meta.url,
  (root, { value, maxHeight }, host) => {
    const texto = String(value ?? '');
    host.style.setProperty('--sw-json-max', maxHeight || '28rem');

    root.append(html`
      <div class="caja">
        <is-copy-button class="copiar" value="${texto}" copy-label="Copiar JSON"></is-copy-button>
        <pre class="codigo"><code>${raw(resaltar(texto))}</code></pre>
      </div>
    `);
  },
  { value: '', maxHeight: '28rem' },
  'sw-json',
);

define('sw-json', SwJson);
export { SwJson };
