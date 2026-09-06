// ═══════════════════════════════════════════════════════════════════════════
//  Catalogo — Clase A.
//
//  Todas las lecturas van contra `catalogo_lectura`, nunca contra `productos`
//  con joins. Es lo que convierte 8 consultas encadenadas en un indice.
// ═══════════════════════════════════════════════════════════════════════════

import { z } from "zod";

import { esquemaFiltrosCatalogo } from "@appstore/tipos";

import { publico, router } from "../trpc";

export const routerCatalogo = router({
  /** Listado con filtros y facetas. Lo usa /categorias/[slug] y /buscar. */
  listar: publico.input(esquemaFiltrosCatalogo).query(async ({ ctx, input }) => {
    const salto = (input.pagina - 1) * input.porPagina;

    const where = {
      activo: true,
      ...(input.soloDisponibles ? { disponible: true } : {}),
      ...(input.soloOfertas ? { enOferta: true } : {}),
      ...(input.categoria ? { categoriaRuta: { has: input.categoria } } : {}),
      ...(input.marca ? { marcaSlug: input.marca } : {}),
      ...(input.precioMin !== undefined || input.precioMax !== undefined
        ? {
            precioDesde: {
              ...(input.precioMin !== undefined ? { gte: input.precioMin } : {}),
              ...(input.precioMax !== undefined ? { lte: input.precioMax } : {}),
            },
          }
        : {}),
    };

    const orden = {
      relevancia: { destacado: "desc" as const },
      precio_asc: { precioDesde: "asc" as const },
      precio_desc: { precioDesde: "desc" as const },
      nuevos: { actualizadoEn: "desc" as const },
      descuento: { descuentoPct: "desc" as const },
    }[input.orden];

    const [items, total] = await Promise.all([
      ctx.db.catalogoLectura.findMany({
        where,
        orderBy: orden,
        skip: salto,
        take: input.porPagina,
      }),
      ctx.db.catalogoLectura.count({ where }),
    ]);

    return {
      items,
      total,
      paginas: Math.ceil(total / input.porPagina),
      pagina: input.pagina,
    };
  }),

  /** Ficha completa. Todo viene pre-armado: variantes, opciones y facetas. */
  porSlug: publico.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.catalogoLectura.findUnique({ where: { slug: input.slug } });
  }),

  /** Portada. */
  destacados: publico
    .input(z.object({ limite: z.number().int().min(1).max(24).default(12) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.catalogoLectura.findMany({
        where: { destacado: true, disponible: true, activo: true },
        orderBy: { actualizadoEn: "desc" },
        take: input.limite,
      });
    }),

  /** Ofertas, ordenadas por cuanto se descuenta. */
  ofertas: publico
    .input(z.object({ limite: z.number().int().min(1).max(60).default(24) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.catalogoLectura.findMany({
        where: { enOferta: true, disponible: true, activo: true },
        orderBy: { descuentoPct: "desc" },
        take: input.limite,
      });
    }),

  /**
   * Busqueda por texto. Usa el indice GIN sobre `busqueda` (tsvector).
   * `websearch_to_tsquery` entiende comillas y el operador OR como Google.
   */
  buscar: publico
    .input(z.object({ q: z.string().min(2).max(120), limite: z.number().int().max(40).default(20) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.$queryRaw`
        SELECT producto_id, slug, nombre, imagen_url, precio_desde, precio_lista,
               en_oferta, descuento_pct, marca_nombre, disponible
        FROM catalogo_lectura
        WHERE activo
          AND busqueda @@ websearch_to_tsquery('spanish', unaccent(${input.q}))
        ORDER BY ts_rank(busqueda, websearch_to_tsquery('spanish', unaccent(${input.q}))) DESC,
                 disponible DESC
        LIMIT ${input.limite}
      `;
    }),

  categorias: publico.query(async ({ ctx }) => {
    return ctx.db.categoria.findMany({
      where: { activo: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      select: {
        id: true,
        nombre: true,
        slug: true,
        imagenUrl: true,
        destacada: true,
        padreId: true,
      },
    });
  }),

  marcas: publico.query(async ({ ctx }) => {
    return ctx.db.marca.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true, slug: true, logoUrl: true },
    });
  }),
});
