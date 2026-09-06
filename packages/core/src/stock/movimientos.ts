// ═══════════════════════════════════════════════════════════════════════════
//  Reglas del kardex.
//
//  REGLA DURA: nunca se escribe `Variante.cantidad` ni `Variante.reservado`
//  sin registrar tambien el movimiento. Si no hay movimiento, el cambio no
//  ocurrio. Es lo unico que permite auditar diferencias de inventario.
//
//  Estas funciones son puras: deciden QUE movimientos hay que escribir.
//  Quien los escribe (dentro de una transaccion) es packages/api.
// ═══════════════════════════════════════════════════════════════════════════

export type TipoMovimiento = "ENTRADA" | "SALIDA" | "AJUSTE" | "RESERVA" | "LIBERACION";

export type MotivoMovimiento =
  | "COMPRA"
  | "VENTA"
  | "DEVOLUCION_CLIENTE"
  | "DEVOLUCION_PROVEEDOR"
  | "MERMA"
  | "INVENTARIO_FISICO"
  | "TRASLADO"
  | "CORRECCION";

export interface SaldoVariante {
  varianteId: string;
  cantidad: number;
  reservado: number;
}

export interface MovimientoPlaneado {
  varianteId: string;
  tipo: TipoMovimiento;
  motivo: MotivoMovimiento;
  cantidad: number; // positivo entra, negativo sale
  saldoAnterior: number;
  saldoNuevo: number;
  referenciaTipo?: string;
  referenciaId?: string;
  nota?: string;
}

/** Lo que se puede vender ahora mismo. */
export function disponible(saldo: SaldoVariante): number {
  return Math.max(0, saldo.cantidad - saldo.reservado);
}

export class StockInsuficiente extends Error {
  constructor(
    readonly varianteId: string,
    readonly pedido: number,
    readonly hay: number,
  ) {
    super(`Stock insuficiente para la variante ${varianteId}: se pidieron ${pedido} y hay ${hay}.`);
    this.name = "StockInsuficiente";
  }
}

/**
 * Al confirmar un pedido se RESERVA, no se descuenta. El stock fisico solo
 * baja cuando el pedido se despacha: hasta entonces la mercaderia sigue en
 * el almacen y tiene que aparecer en el inventario.
 */
export function planificarReserva(
  saldos: Map<string, SaldoVariante>,
  items: Array<{ varianteId: string; cantidad: number }>,
  pedidoId: string,
): MovimientoPlaneado[] {
  const movimientos: MovimientoPlaneado[] = [];

  for (const item of items) {
    const saldo = saldos.get(item.varianteId);
    if (!saldo) throw new StockInsuficiente(item.varianteId, item.cantidad, 0);

    const hay = disponible(saldo);
    if (hay < item.cantidad) throw new StockInsuficiente(item.varianteId, item.cantidad, hay);

    movimientos.push({
      varianteId: item.varianteId,
      tipo: "RESERVA",
      motivo: "VENTA",
      cantidad: -item.cantidad,
      saldoAnterior: saldo.cantidad,
      saldoNuevo: saldo.cantidad, // la reserva no toca el saldo fisico
      referenciaTipo: "pedido",
      referenciaId: pedidoId,
    });
  }

  return movimientos;
}

/** Al despachar: se libera la reserva y baja el stock fisico de verdad. */
export function planificarDespacho(
  saldos: Map<string, SaldoVariante>,
  items: Array<{ varianteId: string; cantidad: number }>,
  pedidoId: string,
): MovimientoPlaneado[] {
  return items.map((item) => {
    const saldo = saldos.get(item.varianteId);
    const anterior = saldo?.cantidad ?? 0;

    return {
      varianteId: item.varianteId,
      tipo: "SALIDA" as const,
      motivo: "VENTA" as const,
      cantidad: -item.cantidad,
      saldoAnterior: anterior,
      saldoNuevo: anterior - item.cantidad,
      referenciaTipo: "pedido",
      referenciaId: pedidoId,
    };
  });
}

/** Al cancelar un pedido que aun no se despacho: se suelta la reserva. */
export function planificarLiberacion(
  saldos: Map<string, SaldoVariante>,
  items: Array<{ varianteId: string; cantidad: number }>,
  pedidoId: string,
  motivo = "Pedido cancelado",
): MovimientoPlaneado[] {
  return items.map((item) => {
    const anterior = saldos.get(item.varianteId)?.cantidad ?? 0;

    return {
      varianteId: item.varianteId,
      tipo: "LIBERACION" as const,
      motivo: "CORRECCION" as const,
      cantidad: item.cantidad,
      saldoAnterior: anterior,
      saldoNuevo: anterior,
      referenciaTipo: "pedido",
      referenciaId: pedidoId,
      nota: motivo,
    };
  });
}

/** Conteo fisico: se corrige al saldo real y queda la diferencia registrada. */
export function planificarInventario(
  saldo: SaldoVariante,
  contado: number,
  nota?: string,
): MovimientoPlaneado | null {
  const diferencia = contado - saldo.cantidad;
  if (diferencia === 0) return null;

  return {
    varianteId: saldo.varianteId,
    tipo: "AJUSTE",
    motivo: "INVENTARIO_FISICO",
    cantidad: diferencia,
    saldoAnterior: saldo.cantidad,
    saldoNuevo: contado,
    referenciaTipo: "ajuste",
    nota: nota ?? `Conteo fisico: ${saldo.cantidad} -> ${contado}`,
  };
}
