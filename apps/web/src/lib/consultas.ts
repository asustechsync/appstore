// ═══════════════════════════════════════════════════════════════════════════
//  Consultas cacheadas del catalogo — Clase A.
//
//  Todas leen de `catalogo_lectura`, nunca de `productos` con joins.
//
//  IMPORTANTE: dentro de un ambito `use cache` NO se puede leer cookies(),
//  headers() ni searchParams. Si hace falta un valor de la peticion, se lee
//  fuera y se pasa como argumento — y entonces pasa a formar parte de la
//  clave de cache.
// ═══════════════════════════════════════════════════════════════════════════

import { cacheLife, cacheTag } from "next/cache";

import { db, type CatalogoLectura } from "@appstore/db";

import { etiquetas } from "./cache";

/**
 * Una variante ya resuelta dentro de `catalogo_lectura.variantes`. Es lo que la
 * ficha necesita para pintar el selector de talla y el stock: cero consultas
 * extra. La arma el refresco del catalogo (hoy, el seed).
 */
export interface VarianteCatalogo {
  id: string;
  sku: string;
  talla: string;
  color: string;
  precio: number;
  stock: number;
}

/** Una opcion configurable (Talla, Color...) dentro de `catalogo_lectura.opciones`. */
export interface OpcionCatalogo {
  clave: string;
  nombre: string;
  valores: Array<{ valor: string; colorHex?: string | null }>;
}

/**
 * `catalogo_lectura` guarda los precios como `Decimal`. El objeto Decimal de
 * Prisma no cruza la frontera de `use cache` (ni la de servidor -> cliente):
 * hay que devolver numeros planos. Se convierte aqui, una sola vez.
 *
 * Los campos JSON (`variantes`, `opciones`) llegan como `JsonValue`; se tipan
 * aqui mismo para que la ficha los consuma sin castear.
 */
export type VistaCatalogo = Omit<
  CatalogoLectura,
  "precioDesde" | "precioHasta" | "precioLista" | "calificacion" | "variantes" | "opciones"
> & {
  precioDesde: number;
  precioHasta: number;
  precioLista: number;
  calificacion: number | null;
  variantes: VarianteCatalogo[];
  opciones: OpcionCatalogo[];
};

function aVistaCatalogo(fila: CatalogoLectura): VistaCatalogo {
  const { variantes, opciones, ...resto } = fila;
  return {
    ...resto,
    precioDesde: Number(fila.precioDesde),
    precioHasta: Number(fila.precioHasta),
    precioLista: Number(fila.precioLista),
    calificacion: fila.calificacion === null ? null : Number(fila.calificacion),
    variantes: Array.isArray(variantes) ? (variantes as unknown as VarianteCatalogo[]) : [],
    opciones: Array.isArray(opciones) ? (opciones as unknown as OpcionCatalogo[]) : [],
  };
}

export async function productoPorSlug(slug: string): Promise<VistaCatalogo | null> {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.producto(slug));

  const fila = await db.catalogoLectura.findUnique({ where: { slug } });
  return fila ? aVistaCatalogo(fila) : null;
}

/**
 * Cabecera de la categoria: nombre, descripcion y SEO. Comparte la etiqueta del
 * listado para que un cambio en el panel invalide ambos de una vez.
 */
export async function categoriaPorSlug(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.categoria(slug));

  return db.categoria.findFirst({
    where: { slug, activo: true },
    select: {
      id: true,
      nombre: true,
      slug: true,
      descripcion: true,
      tituloSeo: true,
      descripcionSeo: true,
      padre: { select: { nombre: true, slug: true } },
    },
  });
}

/**
 * Filtros del listado. Llegan de la URL, asi que se leen FUERA del ambito
 * `use cache` y entran como argumento: cada combinacion es su propia entrada de
 * cache, con la misma etiqueta `categoria:{slug}`.
 */
export interface FiltrosCatalogo {
  marcas: string[];
  tallas: string[];
  colores: string[];
  soloOfertas: boolean;
}

export const FILTROS_VACIOS: FiltrosCatalogo = {
  marcas: [],
  tallas: [],
  colores: [],
  soloOfertas: false,
};

/**
 * Traduce los filtros a un `where` de Prisma sobre `catalogo_lectura`.
 *
 * `talla` y `color` viven dentro de la columna JSON `facetas`, ya resuelta por
 * el refresco del catalogo: se consultan con `array_contains` y no obligan a
 * unir variantes. Dentro de un grupo las opciones suman (OR); entre grupos
 * restringen (AND).
 */
function condiciones(categoriaSlug: string, filtros: FiltrosCatalogo) {
  const porFaceta = (faceta: "talla" | "color", valores: string[]) =>
    valores.map((valor) => ({ facetas: { path: [faceta], array_contains: valor } }));

  const grupos = [
    filtros.tallas.length > 0 ? { OR: porFaceta("talla", filtros.tallas) } : null,
    filtros.colores.length > 0 ? { OR: porFaceta("color", filtros.colores) } : null,
  ].filter((grupo) => grupo !== null);

  return {
    categoriaRuta: { has: categoriaSlug },
    activo: true,
    disponible: true,
    ...(filtros.marcas.length > 0 ? { marcaSlug: { in: filtros.marcas } } : {}),
    ...(filtros.soloOfertas ? { enOferta: true } : {}),
    ...(grupos.length > 0 ? { AND: grupos } : {}),
  };
}

export async function productosDeCategoria(
  categoriaSlug: string,
  pagina = 1,
  filtros: FiltrosCatalogo = FILTROS_VACIOS,
  porPagina = 24,
) {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.categoria(categoriaSlug));

  const where = condiciones(categoriaSlug, filtros);

  const [items, total] = await Promise.all([
    db.catalogoLectura.findMany({
      where,
      orderBy: [{ destacado: "desc" }, { precioDesde: "asc" }],
      skip: (pagina - 1) * porPagina,
      take: porPagina,
    }),
    db.catalogoLectura.count({ where }),
  ]);

  return { items: items.map(aVistaCatalogo), total, paginas: Math.ceil(total / porPagina) };
}

/** Una opcion del panel de filtros con cuantos productos la tienen. */
export interface OpcionFaceta {
  valor: string;
  etiqueta: string;
  total: number;
}

/**
 * Opciones disponibles para filtrar una categoria: marcas, tallas y colores.
 *
 * Se calculan sobre la categoria COMPLETA, no sobre el resultado ya filtrado,
 * para que las opciones no desaparezcan al marcar una y el panel se pueda
 * cachear junto al resto del listado.
 */
export async function facetasDeCategoria(categoriaSlug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.categoria(categoriaSlug));

  const filas = await db.catalogoLectura.findMany({
    where: { categoriaRuta: { has: categoriaSlug }, activo: true, disponible: true },
    select: { marcaSlug: true, marcaNombre: true, facetas: true, enOferta: true },
  });

  const marcas = new Map<string, OpcionFaceta>();
  const tallas = new Map<string, OpcionFaceta>();
  const colores = new Map<string, OpcionFaceta>();
  let ofertas = 0;

  const sumar = (mapa: Map<string, OpcionFaceta>, valor: string, etiqueta: string) => {
    const previa = mapa.get(valor);
    if (previa) previa.total += 1;
    else mapa.set(valor, { valor, etiqueta, total: 1 });
  };

  for (const fila of filas) {
    if (fila.marcaSlug && fila.marcaNombre) {
      sumar(marcas, fila.marcaSlug, fila.marcaNombre);
    }
    if (fila.enOferta) ofertas += 1;

    const facetas = (fila.facetas ?? {}) as { talla?: unknown; color?: unknown };
    for (const talla of Array.isArray(facetas.talla) ? facetas.talla : []) {
      if (typeof talla === "string") sumar(tallas, talla, talla);
    }
    for (const color of Array.isArray(facetas.color) ? facetas.color : []) {
      if (typeof color === "string") sumar(colores, color, color);
    }
  }

  const porEtiqueta = (a: OpcionFaceta, b: OpcionFaceta) => a.etiqueta.localeCompare(b.etiqueta, "es");

  return {
    marcas: [...marcas.values()].sort(porEtiqueta),
    // Las tallas se ordenan por su orden natural de uso, no alfabetico.
    tallas: [...tallas.values()].sort((a, b) => ordenDeTalla(a.valor) - ordenDeTalla(b.valor)),
    colores: [...colores.values()].sort(porEtiqueta),
    ofertas,
  };
}

/** Orden de talla para el panel: XS..XXL, luego tallas numericas y de bebe. */
const ESCALA_TALLAS = ["XS", "S", "M", "L", "XL", "XXL"];

function ordenDeTalla(talla: string): number {
  const letra = ESCALA_TALLAS.indexOf(talla.toUpperCase());
  if (letra >= 0) return letra;

  const numero = Number.parseInt(talla, 10);
  return Number.isNaN(numero) ? 500 : 100 + numero;
}

export async function destacadosPortada(limite = 12): Promise<VistaCatalogo[]> {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.portada());

  const filas = await db.catalogoLectura.findMany({
    where: { destacado: true, disponible: true, activo: true },
    orderBy: { actualizadoEn: "desc" },
    take: limite,
  });
  return filas.map(aVistaCatalogo);
}

/** Productos recientes de la portada, sin salir del modelo de lectura. */
export async function nuevosPortada(limite = 12): Promise<VistaCatalogo[]> {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.portada());

  const filas = await db.catalogoLectura.findMany({
    where: { disponible: true, activo: true },
    orderBy: { actualizadoEn: "desc" },
    take: limite,
  });
  return filas.map(aVistaCatalogo);
}

/**
 * Selección popular de la portada. Hasta que F4 agregue ventas confirmadas al
 * modelo de lectura, `destacado` es la curación editorial y reseñas/calificación
 * ordenan los empates sin consultar tablas transaccionales desde el catálogo.
 */
export async function masVendidosPortada(limite = 12): Promise<VistaCatalogo[]> {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.portada());

  const filas = await db.catalogoLectura.findMany({
    where: { destacado: true, disponible: true, activo: true },
    orderBy: [{ totalResenas: "desc" }, { calificacion: "desc" }, { actualizadoEn: "desc" }],
    take: limite,
  });
  return filas.map(aVistaCatalogo);
}

/** Totales de la portada para el hero. Se regeneran junto al resto del catálogo. */
export async function resumenPortada() {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.portada());

  const [totalProductos, totalCategorias] = await Promise.all([
    db.catalogoLectura.count({ where: { activo: true, disponible: true } }),
    db.categoria.count({ where: { activo: true, padreId: null } }),
  ]);

  return { totalProductos, totalCategorias };
}

/**
 * Categorias que la portada muestra como accesos directos. Solo las raiz
 * marcadas como destacadas, en el orden que fija el panel.
 */
export async function categoriasDestacadas(limite = 12) {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.portada());

  return db.categoria.findMany({
    where: { destacada: true, activo: true, padreId: null },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    take: limite,
    select: { id: true, nombre: true, slug: true, imagenUrl: true },
  });
}

export async function productosEnOferta(limite = 24): Promise<VistaCatalogo[]> {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.ofertas());

  const filas = await db.catalogoLectura.findMany({
    where: { enOferta: true, disponible: true, activo: true },
    orderBy: { descuentoPct: "desc" },
    take: limite,
  });
  return filas.map(aVistaCatalogo);
}

/** Arbol de categorias y marcas para la cabecera. Cambia muy poco. */
export async function navegacion() {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.navegacion());

  const [categorias, marcas] = await Promise.all([
    db.categoria.findMany({
      where: { activo: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      select: { id: true, nombre: true, slug: true, padreId: true, destacada: true, imagenUrl: true },
    }),
    db.marca.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
      select: { nombre: true, slug: true, logoUrl: true },
    }),
  ]);

  return { categorias, marcas };
}

/** Slugs para pre-generar los listados de categoria en el build. */
export async function slugsDeCategorias(): Promise<Array<{ slug: string }>> {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.navegacion());

  return db.categoria.findMany({
    where: { activo: true },
    select: { slug: true },
  });
}

/** Slugs para pre-generar las fichas en el build. */
export async function slugsDeProductos(): Promise<Array<{ slug: string }>> {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.catalogo());

  return db.catalogoLectura.findMany({
    where: { activo: true },
    select: { slug: true },
  });
}
