// ═══════════════════════════════════════════════════════════════════════════
//  Que promociones alcanzan a un producto.
//
//  Los alcances se suman como union; los marcados con `excluir` restan.
//  Ejemplo: "toda la categoria Polos MENOS la marca X" son dos filas —
//  una CATEGORIA normal y una MARCA con excluir = true.
// ═══════════════════════════════════════════════════════════════════════════

import type { PromocionAplicable } from "../precios/efectivo";

export type TipoAlcance = "TODO" | "CATEGORIA" | "MARCA" | "PRODUCTO" | "VARIANTE";

export interface Alcance {
  tipo: TipoAlcance;
  referenciaId: string | null;
  excluir: boolean;
}

export interface PromocionConAlcance extends PromocionAplicable {
  fechaInicio: Date | null;
  fechaFin: Date | null;
  activo: boolean;
  usoMaximo: number | null;
  usosActuales: number;
  compraMinima: number | null;
  alcances: Alcance[];
}

export interface Objetivo {
  productoId: string;
  varianteId?: string;
  categoriaId: string;
  /** Ids de toda la rama de categorias, desde la raiz hasta la hoja. */
  categoriaRuta?: string[];
  marcaId?: string | null;
}

export function estaVigente(promo: PromocionConAlcance, ahora: Date = new Date()): boolean {
  if (!promo.activo) return false;
  if (promo.fechaInicio && ahora < promo.fechaInicio) return false;
  if (promo.fechaFin && ahora > promo.fechaFin) return false;
  if (promo.usoMaximo !== null && promo.usosActuales >= promo.usoMaximo) return false;
  return true;
}

function alcanzaObjetivo(alcance: Alcance, objetivo: Objetivo): boolean {
  switch (alcance.tipo) {
    case "TODO":
      return true;
    case "CATEGORIA":
      if (!alcance.referenciaId) return false;
      return (
        objetivo.categoriaId === alcance.referenciaId ||
        (objetivo.categoriaRuta?.includes(alcance.referenciaId) ?? false)
      );
    case "MARCA":
      return Boolean(alcance.referenciaId) && objetivo.marcaId === alcance.referenciaId;
    case "PRODUCTO":
      return objetivo.productoId === alcance.referenciaId;
    case "VARIANTE":
      return Boolean(objetivo.varianteId) && objetivo.varianteId === alcance.referenciaId;
  }
}

export function alcanza(promo: PromocionConAlcance, objetivo: Objetivo): boolean {
  let incluido = false;

  for (const alcance of promo.alcances) {
    if (!alcanzaObjetivo(alcance, objetivo)) continue;
    // Una exclusion gana sobre cualquier inclusion.
    if (alcance.excluir) return false;
    incluido = true;
  }

  return incluido;
}

/** Promociones vigentes que aplican a este producto, listas para calcularPrecio(). */
export function promocionesPara(
  todas: PromocionConAlcance[],
  objetivo: Objetivo,
  ahora: Date = new Date(),
): PromocionAplicable[] {
  return todas
    .filter((p) => estaVigente(p, ahora) && alcanza(p, objetivo))
    .sort((a, b) => b.prioridad - a.prioridad);
}

/** ¿Alguna promocion vigente del carrito da envio gratis? */
export function hayEnvioGratis(
  promos: PromocionConAlcance[],
  subtotal: number,
  ahora: Date = new Date(),
): boolean {
  return promos.some(
    (p) =>
      p.tipo === "ENVIO_GRATIS" &&
      estaVigente(p, ahora) &&
      subtotal >= (p.compraMinima ?? 0),
  );
}
