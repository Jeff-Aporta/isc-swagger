/**
 * all.ts — barril de los componentes `sw-*`.
 *
 * Solo lo usa el build para producir `dist/cdn/all.min.js`: un único
 * `<script type="module">` en lugar de listar cada archivo. El CSS **no** entra
 * en el bundle; cada componente lo sigue pidiendo desde `dist/cdn/components/sw/<tag>.css`,
 * así que ese directorio tiene que estar publicado.
 *
 * El `setCssBase` va primero y en su propia sentencia: dentro del bundle todos los módulos
 * comparten `import.meta.url`, que apunta a `all.min.js` en la raíz del CDN, y sin fijar la
 * base los componentes buscarían sus hojas en `dist/cdn/` en vez de en `components/sw/`.
 * Los `import` se ejecutan en orden, así que la base queda puesta antes de que ningún
 * componente registre su tag y precargue su hoja.
 */

import { setCssBase } from './_shared.js';

setCssBase(new URL('./components/sw/', import.meta.url).href);

await import('./sw-method.js');
await import('./sw-path.js');
await import('./sw-json.js');
await import('./sw-doc.js');
await import('./sw-params.js');
await import('./sw-body.js');
await import('./sw-responses.js');
await import('./sw-try.js');
await import('./sw-operation.js');
await import('./sw-tag-group.js');
await import('./sw-info.js');
await import('./sw-server.js');
await import('./sw-auth.js');
await import('./sw-export.js');
await import('./sw-nav.js');
await import('./sw-app.js');

// Segundo driver: mismo documento, presentación por vistas. Se registra junto al de acordeones
// para que una página pueda montar cualquiera de los dos sin pedir otro bundle.
await import('./sw-minidoc-code.js');
await import('./sw-minidoc-view.js');
await import('./sw-minidoc.js');
