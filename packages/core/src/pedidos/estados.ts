// ═══════════════════════════════════════════════════════════════════════════
//  Maquina de estados del pedido.
//
//  Ninguna parte del sistema cambia `Pedido.estado` a mano: todas pasan por
//  `puedeTransicionar`. Es lo que impide que un pedido cancelado vuelva a
//  ENVIADO por un clic mal dado en el panel.
// ═══════════════════════════════════════════════════════════════════════════

export type EstadoPedido =
  | "PENDIENTE"
  | "PAGADO"
  | "EN_PREPARACION"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO"
  | "REEMBOLSADO";

const TRANSICIONES: Record<EstadoPedido, readonly EstadoPedido[]> = {
  PENDIENTE: ["PAGADO", "CANCELADO"],
  PAGADO: ["EN_PREPARACION", "CANCELADO", "REEMBOLSADO"],
  EN_PREPARACION: ["ENVIADO", "CANCELADO"],
  ENVIADO: ["ENTREGADO", "REEMBOLSADO"],
  ENTREGADO: ["REEMBOLSADO"],
  CANCELADO: [],
  REEMBOLSADO: [],
};

/** Estados en los que el stock esta reservado y debe liberarse al cancelar. */
const CON_RESERVA: readonly EstadoPedido[] = ["PENDIENTE", "PAGADO", "EN_PREPARACION"];

/** Estados finales: el pedido ya no se mueve. */
const FINALES: readonly EstadoPedido[] = ["ENTREGADO", "CANCELADO", "REEMBOLSADO"];

export function puedeTransicionar(desde: EstadoPedido, hasta: EstadoPedido): boolean {
  return TRANSICIONES[desde].includes(hasta);
}

export function siguientesEstados(desde: EstadoPedido): readonly EstadoPedido[] {
  return TRANSICIONES[desde];
}

export function esFinal(estado: EstadoPedido): boolean {
  return FINALES.includes(estado);
}

export function tieneStockReservado(estado: EstadoPedido): boolean {
  return CON_RESERVA.includes(estado);
}

export class TransicionInvalida extends Error {
  constructor(
    readonly desde: EstadoPedido,
    readonly hasta: EstadoPedido,
  ) {
    super(
      `No se puede pasar un pedido de ${desde} a ${hasta}. ` +
        `Desde ${desde} solo se puede ir a: ${TRANSICIONES[desde].join(", ") || "ningun estado"}.`,
    );
    this.name = "TransicionInvalida";
  }
}

/** Lanza si la transicion no es valida. Usar antes de escribir en la base. */
export function exigirTransicion(desde: EstadoPedido, hasta: EstadoPedido): void {
  if (!puedeTransicionar(desde, hasta)) {
    throw new TransicionInvalida(desde, hasta);
  }
}

/** Etiqueta para la interfaz. */
export const ETIQUETA_ESTADO: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente de pago",
  PAGADO: "Pagado",
  EN_PREPARACION: "En preparacion",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  REEMBOLSADO: "Reembolsado",
};
