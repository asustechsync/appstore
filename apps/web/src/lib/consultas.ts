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

export async function productosDeCategoria(
  categoriaSlug: string,
  pagina = 1,
  porPagina = 24,
) {
  "use cache";
  cacheLife("max");
  cacheTag(etiquetas.categoria(categoriaSlug));

  const where = {
    categoriaRuta: { has: categoriaSlug },
    activo: true,
    disponible: true,
  };

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
