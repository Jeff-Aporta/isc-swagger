/**
 * version.ts — sello del build, para caducar el estado persistido.
 *
 * `__SW_BUILD__` lo sustituye esbuild en tiempo de compilación (ver `scripts/build.mjs`). En
 * desarrollo, si alguien carga el `.ts` sin pasar por el build, cae a `'dev'`: eso hace que la
 * geometría guardada se descarte en cada arranque, que es justo lo que conviene mientras se
 * está tocando el layout.
 */

declare const __SW_BUILD__: string;

export const SW_VERSION: string = typeof __SW_BUILD__ === 'string' ? __SW_BUILD__ : 'dev';
