/**
 * build.mjs — compila `src/**` a JavaScript plano en `dist/cdn/`.
 *
 * Sin bundler y sin Babel: cada `.ts` se transpila por separado (esbuild solo le quita los
 * tipos y minifica) y **se conserva la estructura de carpetas de `src/`**. Antes se aplanaba
 * todo a un único directorio y los `import` se reescribían; con el árbol espejo los
 * especificadores del fuente (`./sw-nav.js`, `../../js/config.js`) ya son correctos tal cual,
 * así que no hay reescritura que pueda equivocarse.
 *
 * Los `.css` hermanos se copian al mismo directorio que su módulo. Ese es el contrato de
 * `adoptCss(shadow, import.meta.url)`: `components/sw/sw-operation.js` resuelve su hoja en
 * `components/sw/sw-operation.css` sin que nadie la declare. Por eso el CSS nunca vive dentro
 * del `.ts` — se minifica aparte, se cachea aparte y se edita como CSS.
 *
 * Salida:
 *
 *   dist/cdn/
 *     all.min.js              bundle único de los componentes (lo que se consume por CDN)
 *     boot.js, hojas.js       scripts planos, síncronos en <head>
 *     components/sw/*.js|css  cada componente con su hoja al lado
 *     js/*.js                 dominio (config, conn, openapi, …)
 */
import { readdirSync, mkdirSync, writeFileSync, rmSync, copyFileSync, existsSync } from 'node:fs';
import { join, basename, dirname, relative } from 'node:path';
import esbuild from 'esbuild';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'dist', 'cdn');

/**
 * Ficheros con esa extensión bajo `dir`, recursivo.
 *
 * `docs/` vive fuera de `src/`, así que no hace falta excluirla: el sitio
 * documental es HTML+JS plano que consume `dist/cdn/` como cualquier otro
 * consumidor, no fuente que se compile.
 */
const listar = (dir, ext) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = join(dir, e.name);
  if (e.isDirectory()) return listar(p, ext);
  return e.name.endsWith(ext) ? [p] : [];
});

const BARRIL = join(SRC, 'components', 'sw', 'all.ts');

/**
 * Sello del build, en UTC y al segundo.
 *
 * Lo consume `js/version.ts` y sirve para caducar la geometría guardada en `localStorage`: un
 * ancho de panel escrito por una versión anterior no debe sobrevivir a un cambio de layout, y
 * mucho menos a la corrección del fallo que lo escribió mal.
 */
const SELLO = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const DEFINE = { __SW_BUILD__: JSON.stringify(SELLO) };

function fuentes() {
  const ts = [
    ...listar(join(SRC, 'components'), '.ts'),
    ...listar(join(SRC, 'js'), '.ts'),
  ].filter((a) => a !== BARRIL);
  const css = [
    ...listar(join(SRC, 'components'), '.css'),
  ];
  return { ts, css };
}

/** Ruta de salida espejo de la de entrada, creando el directorio si hace falta. */
function destino(archivo, ext) {
  const rel = relative(SRC, archivo);
  const salida = join(OUT, ext ? rel.replace(/\.[^.]+$/, ext) : rel);
  mkdirSync(dirname(salida), { recursive: true });
  return salida;
}

async function compilar() {
  const { ts, css } = fuentes();

  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  for (const archivo of ts) {
    const resultado = await esbuild.build({
      entryPoints: [archivo],
      bundle: false,
      write: false,
      format: 'esm',
      target: 'es2022',
      minify: true,
      define: DEFINE,
      loader: { '.ts': 'ts' },
    });
    writeFileSync(destino(archivo, '.js'), resultado.outputFiles[0].text);
  }

  // El CSS no se transpila: se minifica y se copia junto a su módulo.
  for (const archivo of css) {
    const resultado = await esbuild.build({
      entryPoints: [archivo],
      bundle: false,
      write: false,
      minify: true,
      loader: { '.css': 'css' },
    });
    writeFileSync(destino(archivo), resultado.outputFiles[0].text);
  }

  // `all.min.js` — bundle único con todos los componentes del visor, en la raíz del CDN para
  // que la URL que se publica sea corta y estable. El CSS no se inlinea: el barril fija
  // `setCssBase('./components/sw/')` para que las hojas se sigan pidiendo de su carpeta.
  if (existsSync(BARRIL)) {
    const bundle = await esbuild.build({
      entryPoints: [BARRIL],
      bundle: true,
      write: false,
      format: 'esm',
      target: 'es2022',
      minify: true,
      define: DEFINE,
      loader: { '.ts': 'ts' },
    });
    writeFileSync(join(OUT, 'all.min.js'), bundle.outputFiles[0].text);
  }

  // `boot.js` (tema) y `hojas.js` (caché de CSS) son JS plano: corren síncronos en <head>,
  // antes de que exista ningún módulo. Van a la raíz para poder cargarlos con una sola línea.
  const planos = listar(join(SRC, 'js'), '.js');
  for (const archivo of planos) copyFileSync(archivo, join(OUT, basename(archivo)));

  return { ts: ts.length, css: css.length, planos: planos.length };
}

const { ts, css, planos } = await compilar();
console.log(`dist/cdn: ${ts} módulos + ${css} hojas + ${planos} scripts planos + all.min.js · build ${SELLO}`);

if (process.argv.includes('--watch')) {
  const { watch } = await import('node:fs');
  let pendiente = null;
  watch(SRC, { recursive: true }, (_e, archivo) => {
    if (!archivo || !/\.(ts|css|js)$/.test(archivo)) return;
    clearTimeout(pendiente);
    pendiente = setTimeout(async () => {
      try {
        const r = await compilar();
        console.log(`[watch] ${relative(SRC, join(SRC, archivo))} → ${r.ts} módulos + ${r.css} hojas`);
      } catch (e) {
        console.error('[watch]', e.message);
      }
    }, 80);
  });
  console.log('[watch] esperando cambios en src/…');
}
