// ═══════════════════════════════════════════════════════════════════════════
//  CONTRATO DE INVALIDACION
//
//  La Clase A depende de cachear HTML de forma agresiva. Eso solo es seguro si
//  hay una regla clara de cuando se invalida cada cosa.
//
//  Reglas:
//    · Cada funcion cacheada declara sus etiquetas con `cacheTag(...)`.
//    · Al guardar en el panel se invalidan las etiquetas afectadas.
//    · Nunca se invalida por tiempo lo que se puede invalidar por evento:
//      el catalogo esta SIEMPRE fresco Y SIEMPRE cacheado. No hay que elegir.
//
//  Este archivo es la lista completa de etiquetas del sistema. Si una etiqueta
//  no esta aqui, no existe.
// ═══════════════════════════════════════════════════════════════════════════

export const etiquetas = {
  /** Ficha de un producto. */
  producto: (slug: string) => `producto:${slug}`,

  /** Listado de una categoria. Tambien cubre sus subcategorias. */
  categoria: (slug: string) => `categoria:${slug}`,

  /** Listado de una marca. */
  marca: (slug: string) => `marca:${slug}`,

  /** Portada: destacados y categorias destacadas. */
  portada: () => "portada",

  /** Landing de ofertas. */
  ofertas: () => "ofertas",

  /** Menu de navegacion (arbol de categorias y marcas). */
  navegacion: () => "navegacion",

  /** Todo el catalogo. Usar solo en cambios masivos (importacion, precios). */
  catalogo: () => "catalogo",
} as const;

/**
 * Que hay que invalidar cuando cambia un producto.
 *
 * Se invalida la ficha, su categoria, su marca, la portada y las ofertas:
 * un cambio de precio puede sacar o meter el producto en /ofertas, y puede
 * cambiar el "desde S/ ..." de la tarjeta en el listado.
 */
export function etiquetasDeProducto(datos: {
  slug: string;
  categoriaSlugs: string[];
  marcaSlug?: string | null;
}): string[] {
  return [
    etiquetas.producto(datos.slug),
    ...datos.categoriaSlugs.map(etiquetas.categoria),
    ...(datos.marcaSlug ? [etiquetas.marca(datos.marcaSlug)] : []),
    etiquetas.portada(),
    etiquetas.ofertas(),
    etiquetas.catalogo(),
  ];
}

/**
 * Perfiles de vida por tipo de contenido.
 *
 * Todo lo del catalogo usa "max" porque se invalida por evento, no por reloj:
 * si nadie toca el producto, su HTML puede vivir indefinidamente en el CDN.
 * Ahi es donde salen los 20-40 ms.
 */
export const vidaCache = {
  catalogo: "max",
  navegacion: "max",
  /** La busqueda si caduca por tiempo: no vale la pena invalidarla por evento. */
  busqueda: "minutes",
} as const;
