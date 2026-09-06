// ═══════════════════════════════════════════════════════════════════════════
//  PRECIO EFECTIVO — el unico lugar donde se decide cuanto cuesta algo.
//
//  Lo usan tres consumidores y los tres tienen que coincidir SIEMPRE:
//    1. El refresco de `catalogo_lectura` (lo que ve el cliente en la tienda)
//    2. El carrito
//    3. El cierre del pedido
//
//  Si el precio se calculara en cada uno por separado, tarde o temprano la
//  ficha diria S/ 79.90 y el carrito cobraria S/ 89.90.
// ═══════════════════════════════════════════════════════════════════════════

import { redondear } from "./igv";

export type TipoPromocion = "PORCENTAJE" | "MONTO_FIJO" | "PRECIO_FIJO" | "NXM" | "ENVIO_GRATIS";

export interface PromocionAplicable {
  id: string;
  nombre: string;
  tipo: TipoPromocion;
  valor: number | null;
  cantidadN: number | null;
  cantidadM: number | null;
  prioridad: number;
  acumulable: boolean;
  etiqueta: string | null;
  etiquetaColor: string | null;
}

export interface EntradaPrecio {
  /** Precio de lista del producto o de la variante. */
  precio: number;
  /** Oferta manual cargada en el panel. Gana sobre el precio de lista. */
  precioOferta?: number | null;
  /** Promociones que alcanzan a este producto, ya filtradas por vigencia. */
  promociones?: PromocionAplicable[];
  /** Unidades. Solo importa para promociones NXM. */
  cantidad?: number;
}

export interface PrecioEfectivo {
  /** Lo que paga el cliente por unidad. */
  unitario: number;
  /** Precio tachado. `null` si no hay nada que tachar. */
  lista: number | null;
  /** Total por `cantidad`, ya con promociones de volumen aplicadas. */
  total: number;
  enOferta: boolean;
  descuentoPct: number | null;
  etiqueta: string | null;
  etiquetaColor: string | null;
  /** Que se aplico y cuanto descontó. Se congela en `Pedido.descuentosDetalle`. */
  aplicadas: Array<{ id: string; nombre: string; descuento: number }>;
}

/**
 * Orden de resolucion:
 *   1. Se parte del precio de lista.
 *   2. La oferta manual del panel lo reemplaza si es menor.
 *   3. Se aplican las promociones: gana la de mayor prioridad; las marcadas
 *      como acumulables se suman encima.
 */
export function calcularPrecio(entrada: EntradaPrecio): PrecioEfectivo {
  const cantidad = Math.max(1, entrada.cantidad ?? 1);
  const lista = redondear(entrada.precio);

  let unitario = lista;
  const aplicadas: PrecioEfectivo["aplicadas"] = [];

  // ── 2. Oferta manual ────────────────────────────────────────────────────
  if (typeof entrada.precioOferta === "number" && entrada.precioOferta > 0 && entrada.precioOferta < unitario) {
    unitario = redondear(entrada.precioOferta);
  }

  // ── 3. Promociones ──────────────────────────────────────────────────────
  const promos = [...(entrada.promociones ?? [])].sort((a, b) => b.prioridad - a.prioridad);

  let etiqueta: string | null = null;
  let etiquetaColor: string | null = null;
  let totalNxm: number | null = null;
  let yaAplicoNoAcumulable = false;

  for (const promo of promos) {
    if (yaAplicoNoAcumulable && !promo.acumulable) continue;
    if (promo.tipo === "ENVIO_GRATIS") continue; // se resuelve en el calculo de envio

    const antes = unitario;

    switch (promo.tipo) {
      case "PORCENTAJE":
        if (promo.valor !== null) unitario = redondear(unitario * (1 - promo.valor / 100));
        break;

      case "MONTO_FIJO":
        if (promo.valor !== null) unitario = redondear(Math.max(0, unitario - promo.valor));
        break;

      case "PRECIO_FIJO":
        if (promo.valor !== null && promo.valor < unitario) unitario = redondear(promo.valor);
        break;

      case "NXM": {
        // "Lleva 3, paga 2": solo cambia el TOTAL, no el precio unitario.
        const n = promo.cantidadN ?? 0;
        const m = promo.cantidadM ?? 0;
        if (n > 0 && m > 0 && m < n && cantidad >= n) {
          const grupos = Math.floor(cantidad / n);
          const sueltas = cantidad % n;
          totalNxm = redondear(unitario * (grupos * m + sueltas));
        }
        break;
      }
    }

    const descuento =
      promo.tipo === "NXM"
        ? totalNxm !== null
          ? redondear(unitario * cantidad - totalNxm)
          : 0
        : redondear((antes - unitario) * cantidad);

    if (descuento > 0) {
      aplicadas.push({ id: promo.id, nombre: promo.nombre, descuento });
      if (!etiqueta && promo.etiqueta) {
        etiqueta = promo.etiqueta;
        etiquetaColor = promo.etiquetaColor;
      }
      if (!promo.acumulable) yaAplicoNoAcumulable = true;
    }
  }

  const total = totalNxm ?? redondear(unitario * cantidad);
  const enOferta = unitario < lista || totalNxm !== null;

  return {
    unitario,
    lista: enOferta ? lista : null,
    total,
    enOferta,
    descuentoPct: enOferta && unitario < lista ? Math.round(((lista - unitario) / lista) * 100) : null,
    etiqueta,
    etiquetaColor,
    aplicadas,
  };
}

/** Rango de precios de un producto con variantes, para la tarjeta del catalogo. */
export function rangoDePrecios(
  variantes: Array<{ precio: number; precioOferta?: number | null }>,
  promociones: PromocionAplicable[] = [],
): { desde: number; hasta: number } {
  if (variantes.length === 0) return { desde: 0, hasta: 0 };

  const precios = variantes.map(
    (v) => calcularPrecio({ precio: v.precio, precioOferta: v.precioOferta, promociones }).unitario,
  );

  return { desde: Math.min(...precios), hasta: Math.max(...precios) };
}
