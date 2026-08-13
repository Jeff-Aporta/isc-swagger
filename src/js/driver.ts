/**
 * driver.ts — qué presentación del visor está activa.
 *
 * El visor tiene dos drivers (`sw-app` y `sw-minidoc`) que leen el mismo documento y lo pintan
 * distinto. Cuál se usa es una preferencia del lector, no del documento, así que vive fuera de
 * los dos: si la guardara uno de ellos, el otro no podría leerla sin depender de su hermano.
 *
 * Se persiste en dos sitios, y el orden importa:
 *
 *   1. `?driver=` en la URL — para que un enlace compartido llegue con la vista que se quiso
 *      enseñar. Manda sobre la preferencia guardada: quien comparte decide.
 *   2. `localStorage` — para que la elección sobreviva a recargar sin ensuciar la URL de quien
 *      no la ha tocado nunca.
 */

export const PARAM_DRIVER = 'driver';
const CLAVE_ALMACEN = 'sw:driver';

export interface SwDriver {
  /** Tag del custom element que monta este driver. */
  id: 'sw-app' | 'sw-minidoc';
  label: string;
  /** Una línea para el `title` del selector: qué gana quien lo elige. */
  detalle: string;
}

export const DRIVERS: readonly SwDriver[] = [
  { id: 'sw-app', label: 'Clásico', detalle: 'Lista por secciones; cada operación se despliega en su sitio' },
  { id: 'sw-minidoc', label: 'Documento', detalle: 'Índice lateral, una operación por página y el código a la derecha' },
] as const;

export const DRIVER_DEFAULT: SwDriver['id'] = 'sw-app';

/** `true` si el valor es uno de los drivers registrados. */
export function esDriver(v: unknown): v is SwDriver['id'] {
  return DRIVERS.some((d) => d.id === v);
}

export function driverMeta(id: string): SwDriver {
  return DRIVERS.find((d) => d.id === id) ?? DRIVERS[0]!;
}

/** Driver activo: URL, luego preferencia guardada, luego el de por defecto. */
export function readDriver(): SwDriver['id'] {
  try {
    if (typeof location !== 'undefined') {
      const enUrl = new URLSearchParams(location.search).get(PARAM_DRIVER)?.trim();
      if (esDriver(enUrl)) return enUrl;
    }
  } catch {
    /* URL ilegible: se sigue con la preferencia guardada */
  }
  try {
    const guardado = globalThis.localStorage?.getItem(CLAVE_ALMACEN);
    if (esDriver(guardado)) return guardado;
  } catch {
    /* almacenamiento bloqueado (modo privado, cookies off) */
  }
  return DRIVER_DEFAULT;
}

/**
 * Fija el driver activo en la URL y en la preferencia guardada.
 *
 * Usa `replaceState`: cambiar de presentación no es navegar, y meterlo en el historial obligaría
 * a pulsar «atrás» dos veces para volver a la página anterior.
 */
export function writeDriver(id: string): void {
  const valido = esDriver(id) ? id : DRIVER_DEFAULT;
  try {
    globalThis.localStorage?.setItem(CLAVE_ALMACEN, valido);
  } catch {
    /* almacenamiento bloqueado: la URL basta para esta sesión */
  }
  try {
    // `globalThis.history` y no `history` a secas: en un contexto sin History API, la
    // referencia suelta lanza ReferenceError y el catch se lo tragaba en silencio.
    const h = globalThis.history;
    if (typeof location === 'undefined' || !h?.replaceState) return;
    const url = new URL(location.href);
    // El default no se escribe: una URL sin `?driver=` es la que hay que poder compartir.
    if (valido === DRIVER_DEFAULT) url.searchParams.delete(PARAM_DRIVER);
    else url.searchParams.set(PARAM_DRIVER, valido);
    h.replaceState(h.state, '', url.toString());
  } catch {
    /* sin History API no se puede reflejar; la preferencia ya quedó guardada */
  }
}
