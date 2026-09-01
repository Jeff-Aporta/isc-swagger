# Tareas — TypeScript en isc-swagger

Regla del proyecto: **todo en TypeScript**. Las convenciones son las mismas que
las de `is-webcomponents`, escritas en
`../is-webcomponents/specs/typescript/spec.md` (S-TS1 a S-TS8) e indexadas en el
RAG bajo el dominio `webcomponents`.

## Hecho — 1-sep-2026

**No queda un solo `.js` ni `.mjs` escrito a mano en el repositorio.** Los
únicos cuatro `.js` que sobreviven fuera de `dist/` son los que genera el build
en `docs/`, y son artefactos, no fuente.

- [x] **`src/`**: `boot.js` y `hojas.js`, los dos scripts planos.
- [x] **`tests/`**: los 17 `*.test.mjs` → `*.test.ts`. No hizo falta el hook de
      resolución que sí necesitó `is-webcomponents`: aquí los tests importan de
      `dist/cdn/`, donde los `.js` son ficheros de verdad.
- [x] **`docs/`**: `doc-kit`, `manifest`, `preview-boot`, `preview-kit`.
- [x] **`scripts/build.mjs`** → `build.ts`.

### Lo que no era un renombrado

**Los scripts planos.** `boot` y `hojas` existen para correr **síncronos en
`<head>`**: el primero aplica el tema antes del primer pintado, el segundo
instala la caché de hojas antes de que el kit `is-*` construya su primer shadow
root. El build los copiaba tal cual; ahora los **transpila** manteniendo la
salida como script clásico (`format: 'iife'`). Si los emitiera como módulo ES el
navegador los diferiría y volverían el parpadeo en claro y el repintado que
ambos existen para evitar. `PLANOS` los nombra explícitamente en `build.ts`.

**`docs/` no se compilaba a propósito**: es un sitio estático que consume
`dist/cdn/` como cualquier otro consumidor. Ahora `compilarDocs()` transpila sus
`.ts` dejando el `.js` **al lado del fuente**, no en `dist/`, para que las
páginas sigan pidiendo `./manifest.js` sin tocar una sola URL. `preview-boot`
tiene la misma restricción que `boot` y sale también como script clásico.

**Declaraciones para todo lo publicado.** `tsconfig.cdn.json` solo emitía
`.d.ts` de dos entry points, así que los tests veían `any` en todo lo que
importaban de `dist/cdn/`. Ampliado a `src/` entero: 29 declaraciones en `js/` y
27 en `components/sw/`. Eso destapó **cuatro errores reales** que el `any`
tapaba, ya corregidos:

- `driver.ts`: `esDriver(enS.trim())` estrecha la expresión, no la variable, así
  que el `return enS.trim()` seguía siendo `string`.
- `iss-swagger-md.ts` (×2): `if (str(x))` no estrecha `x`; se pasaba el original
  en vez del resultado recortado.
- `insoft-config.ts`: casteo de `IssSwaggerInfo` a `Record<string, unknown>` que
  TypeScript rechaza por faltarle índice.
- `sw-minidoc.ts`: `#filaOp` declaraba `HTMLElement` pero `html` devuelve
  `DocumentFragment`.

**Un guardián obsoleto.** `docs.test.ts` exigía que los tests **no** fueran
`.ts`, «porque no hay pipeline TS y un `.test.ts` no lo ejecuta nadie». Node 22
los ejecuta. Reescrito para vigilar lo que de verdad importaba: que los tests
corran contra `dist/cdn/` y no contra `src/`.

Añadidos `@types/node` y `@types/jsdom`, que faltaban.

Verificado: `npm run build` pasa y **202 tests en verde, 0 en rojo**.

## Pendiente

**`npm run typecheck`: 232 errores, todos en `tests/*.ts`.**

Antes de esta tanda eran 5, pero la comparación no vale: el `tsconfig` solo
miraba `src/`. Al entrar `tests/`, `docs/` y `scripts/` al `include` —y al
existir por fin las declaraciones de `dist/cdn/`— salió a la luz lo que nunca se
había comprobado. `src/`, `docs/` y `scripts/` están **en cero**.

| Fichero | Errores |
|---|---|
| `tests/dominio.test.ts` | 44 |
| `tests/insoft-config.test.ts` | 37 |
| `tests/minidoc.test.ts` | 36 |
| `tests/app.test.ts` | 29 |
| `tests/hojas.test.ts` | 19 |
| `tests/openapi.test.ts` | 17 |

Lo que queda es casi todo el mismo caso: **fixtures que no encajan con el tipo
declarado**, por ejemplo un `paths` de prueba contra
`Record<string, Record<string, SwOperation>>`. Cada uno pide decidir si el
fixture está incompleto o si el tipo es más estrecho de lo que la realidad
admite — y esa segunda posibilidad es la interesante, porque entonces el fallo
está en el tipo, no en el test.

Ya aplicado y agotado: los codemods de `is-webcomponents`
(`ts-codemod`, `ts-campos-dom`, `ts-tipo-por-selector`, `ts-inferir-params` con
su `ts-revertir-inferencia`), más dos barridos propios de los tests — afirmar
`shadowRoot` y `querySelector` (mismo criterio que S-TS4: si no está, el
componente está roto y el test debe fallar ahí) y afirmar las indexaciones, que
`noUncheckedIndexedAccess` obliga a comprobar.
