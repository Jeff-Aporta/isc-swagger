# isc-swagger — contexto rápido para agentes

Visor de APIs InSoft en web components (`sw-*` + kit `is-*`). Sin React, sin MUI, sin Babel.

Este archivo es el contrato **público** (CDN). El `LLM.md` de la raíz del repo es para quien edita el visor.

CDN (pin `@main` salvo que el host fije SHA):

```
https://cdn.jsdelivr.net/gh/Jeff-Aporta/isc-swagger@main/dist/cdn/
```

| Recurso | URL relativa al CDN |
|---|---|
| Este markdown | `LLM.md` |
| Visor (bundle) | `all.min.js` |
| Tags `is-*` que carga el visor | `js/kit-tags.js` |
| Tipos + asserts de piezas JSON | `js/iss-swagger-doc.js` · `.d.ts` · `.ts` |
| JSON → markdown de una API | `js/iss-swagger-md.js` (módulos hermanos) o `js/iss-swagger-md.min.js` (un solo ESM) |
| Tipos ambiente del visor | `types/swagger.d.ts` |

## 1. Piezas JSON (`swagger__*.json`)

Un host no publica OpenAPI como contrato: publica piezas con `kind` distinto. **No mezclar kinds.**

| `kind` | Fichero típico | Qué lleva |
|---|---|---|
| `meta` | `swagger__meta.json` | `info.title`, visor, nav, tags |
| `paths` | `swagger__paths.json` | `paths` (operaciones). `kind` **no** es `"config"` |
| `config` | `swagger__config.json` | `catalog` (docs, schemas, payloads). **Sin** `paths`. Docs en `catalog.docs`, no en la raíz |
| `general` | `swagger__general.json` | Portada: `titulo`, `resumen`, `secciones` |

El visor pide el documento **unido** en `GET …/system/swagger/config.json`. Esa ruta es cable interno: no se lista en `paths`.

Métodos de operación: `get` `post` `put` `patch` `delete` `query` `options` `head`. Cada op necesita `summary`. Si `op.doc` existe, debe haber `catalog.docs[id]`.

## 2. Consistencia en Deno (no reescribir el shape)

```ts
import {
  assertIssSwaggerPiezas,
  type IssSwaggerPiezas,
  type IssSwaggerMetaFile,
  type IssSwaggerPathsFile,
  type IssSwaggerCatalogFile,
  type IssSwaggerGeneralFile,
} from "https://cdn.jsdelivr.net/gh/Jeff-Aporta/isc-swagger@main/dist/cdn/js/iss-swagger-doc.ts";

const errs = assertIssSwaggerPiezas({ meta, paths, config, general });
if (errs.length) throw new Error(errs.join("\n"));
```

Wrangler no resuelve `https:`: pin el `.js` (o el `.min.js` del convertidor) en `vendor/` y alias.

Tipos del visor (spec interna, no las piezas): `dist/cdn/types/swagger.d.ts`.

## 3. Markdown para que un LLM controle *tu* API

No sirvas un `.md` escrito a mano. Genera:

```ts
import { issSwaggerToMarkdown, buildIssSwaggerLlmViewHtml } from
  "https://cdn.jsdelivr.net/gh/Jeff-Aporta/isc-swagger@main/dist/cdn/js/iss-swagger-md.min.js";

const md = issSwaggerToMarkdown({ meta, paths, config, general });
```

`GET /LLM.md` = ese string. `GET /LLM.view` = `buildIssSwaggerLlmViewHtml({ kitCdn, llmMdHref: "/LLM.md" })`.

## 4. Embeber el visor

```html
<script type="module">
  import { ISWebComponentsLoader as L } from
    "https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@main/dist/cdn/loader.min.js";
  import { SW_KIT_TAGS } from
    "https://cdn.jsdelivr.net/gh/Jeff-Aporta/isc-swagger@main/dist/cdn/js/kit-tags.js";
  await L.load(...SW_KIT_TAGS);
</script>
<script type="module" src="https://cdn.jsdelivr.net/gh/Jeff-Aporta/isc-swagger@main/dist/cdn/all.min.js"></script>
```

Lista de tags: solo `js/kit-tags.js`. No duplicarla en el host (sin el tag, el custom element no hace upgrade y no hay error en consola).

`?conn=<base64url>` gana sobre el `specUrl` del `<script>`. Documento InSoft (`kind:"config"`) pasa por `parseInsoftConfig`; no asumas OpenAPI en la UI.

## 5. Leyes cortas

- CSS del visor: hoja **hermana** del componente, no constantes en el `.ts`.
- Reusar `is-*` del kit. Los `sw-*` solo traducen datos del documento al kit.
- Listados de APIs InSoft: HTTP **QUERY** + JSON en el body (`sqlFiltering`), nunca `GET ?q=`.
- Tras cambiar CSS/JS del visor: rebuild, push a `main`, y el host bumpea el pin SHA si no usa `@main`.
