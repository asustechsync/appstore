// ═══════════════════════════════════════════════════════════════════════════
//  Totales del carrito y del pedido.
//
//  Misma funcion en los tres sitios: carrito de la tienda, resumen del
//  checkout y cierre del pedido. Web y movil (F7) la comparten.
// ═══════════════════════════════════════════════════════════════════════════

import { redondear } from "../precios/igv";
import { calcularPrecio, type PromocionAplicable } from "../precios/efectivo";

export interface ItemCarrito {
  varianteId: string;
  cantidad: number;
  precio: number;
  precioOferta?: number | null;
  promociones?: PromocionAplicable[];
  /** Para mostrar y para congelar en el pedido. */
  nombreProducto: string;
  descripcionVar: string;
  skuVariante: string;
  /** Disponible real = cantidad - reservado. */
  stockDisponible: number;
}

export interface CuponAplicable {
  id: string;
  codigo: string;
  tipo: "PORCENTAJE" | "MONTO_FIJO" | "ENVIO_GRATIS";
  valor: number;
  montoMinimo?: number | null;
}

export interface EntradaTotales {
  items: ItemCarrito[];
  costoEnvio?: number;
  cupon?: CuponAplicable | null;
  /** Alguna promocion activa da envio gratis. */
  envioGratisPorPromocion?: boolean;
}

export interface LineaCalculada {
  varianteId: string;
  cantidad: number;
  precioUnit: number;
  precioLista: number | null;
  total: number;
  enOferta: boolean;
  sinStock: boolean;
  nombreProducto: string;
  descripcionVar: string;
  skuVariante: string;
}

export interface Totales {
  lineas: LineaCalculada[];
  subtotal: number;
  descuento: number;
  descuentoCupon: number;
  costoEnvio: number;
  total: number;
  unidades: number;
  /** Lineas que ya no tienen stock suficiente. El checkout se bloquea con esto. */
  problemas: Array<{ varianteId: string; motivo: "SIN_STOCK" | "STOCK_INSUFICIENTE"; disponible: number }>;
  cuponAplicado: boolean;
  motivoCuponRechazado?: string;
}

export function calcularTotales(entrada: EntradaTotales): Totales {
  const lineas: LineaCalculada[] = [];
  const problemas: Totales["problemas"] = [];

  let subtotal = 0;
  let descuento = 0;
  let unidades = 0;

  for (const item of entrada.items) {
    const precio = calcularPrecio({
      precio: item.precio,
      precioOferta: item.precioOferta,
      promociones: item.promociones,
      cantidad: item.cantidad,
    });

    const bruto = redondear(item.precio * item.cantidad);

    subtotal += bruto;
    descuento += redondear(bruto - precio.total);
    unidades += item.cantidad;

    const sinStock = item.stockDisponible <= 0;
    if (sinStock) {
      problemas.push({ varianteId: item.varianteId, motivo: "SIN_STOCK", disponible: 0 });
    } else if (item.stockDisponible < item.cantidad) {
      problemas.push({
        varianteId: item.varianteId,
        motivo: "STOCK_INSUFICIENTE",
        disponible: item.stockDisponible,
      });
    }

    lineas.push({
      varianteId: item.varianteId,
      cantidad: item.cantidad,
      precioUnit: precio.unitario,
      precioLista: precio.lista,
      total: precio.total,
      enOferta: precio.enOferta,
      sinStock,
      nombreProducto: item.nombreProducto,
      descripcionVar: item.descripcionVar,
      skuVariante: item.skuVariante,
    });
  }

  subtotal = redondear(subtotal);
  descuento = redondear(descuento);

  // ── Cupon ─────────────────────────────────────────────────────────────────
  const baseCupon = redondear(subtotal - descuento);
  let descuentoCupon = 0;
  let cuponAplicado = false;
  let motivoCuponRechazado: string | undefined;
  let envioGratisPorCupon = false;

  if (entrada.cupon) {
    const minimo = entrada.cupon.montoMinimo ?? 0;

    if (baseCupon < minimo) {
      motivoCuponRechazado = `Este cupon aplica desde S/ ${minimo.toFixed(2)}.`;
    } else {
      cuponAplicado = true;
      if (entrada.cupon.tipo === "PORCENTAJE") {
        descuentoCupon = redondear(baseCupon * (entrada.cupon.valor / 100));
      } else if (entrada.cupon.tipo === "MONTO_FIJO") {
        descuentoCupon = redondear(Math.min(entrada.cupon.valor, baseCupon));
      } else {
        envioGratisPorCupon = true;
      }
    }
  }

  // ── Envio ─────────────────────────────────────────────────────────────────
  const envioGratis = envioGratisPorCupon || entrada.envioGratisPorPromocion === true;
  const costoEnvio = envioGratis ? 0 : redondear(entrada.costoEnvio ?? 0);

  const total = redondear(Math.max(0, subtotal - descuento - descuentoCupon + costoEnvio));

  return {
    lineas,
    subtotal,
    descuento,
    descuentoCupon,
    costoEnvio,
    total,
    unidades,
    problemas,
    cuponAplicado,
    motivoCuponRechazado,
  };
}

/**
 * Fusiona el carrito de invitado con el del usuario al iniciar sesion.
 * Se queda con la cantidad mayor, nunca las suma: si el cliente puso 2 en el
 * telefono y 2 en la computadora, quiere 2, no 4.
 */
export function fusionarCarritos(
  invitado: Array<{ varianteId: string; cantidad: number }>,
  usuario: Array<{ varianteId: string; cantidad: number }>,
): Array<{ varianteId: string; cantidad: number }> {
  const mapa = new Map<string, number>();

  for (const item of usuario) mapa.set(item.varianteId, item.cantidad);

  for (const item of invitado) {
    mapa.set(item.varianteId, Math.max(mapa.get(item.varianteId) ?? 0, item.cantidad));
  }

  return [...mapa].map(([varianteId, cantidad]) => ({ varianteId, cantidad }));
}
