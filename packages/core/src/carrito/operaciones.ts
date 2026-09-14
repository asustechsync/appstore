// ═══════════════════════════════════════════════════════════════════════════
//  Operaciones sobre las lineas del carrito.
//
//  Funciones puras sobre la lista: agregar, cambiar cantidad, quitar. El
//  almacen del cliente (Zustand en la web, AsyncStorage en F7) solo guarda el
//  resultado; las reglas —tope por linea, tope por stock, fusion de lineas
//  repetidas— viven aqui para que web y movil no las reescriban.
// ═══════════════════════════════════════════════════════════════════════════

/** Tope de unidades por linea. Evita pedidos accidentales de 300 unidades. */
export const TOPE_POR_LINEA = 10;

export interface LineaGuardada {
  varianteId: string;
  cantidad: number;
  /** Disponible real de la variante. Si falta, solo manda el tope. */
  stockDisponible?: number;
}

/** Cuantas unidades admite una linea: lo menor entre el tope y el stock. */
export function topeDeLinea(linea: Pick<LineaGuardada, "stockDisponible">, tope = TOPE_POR_LINEA): number {
  const stock = linea.stockDisponible;
  if (typeof stock !== "number") return tope;
  return Math.max(0, Math.min(tope, stock));
}

/**
 * Agrega una linea. Si la variante ya estaba, SUMA la cantidad —a diferencia
 * de `fusionarCarritos`, donde el cliente no pidio dos veces sino que abrio
 * dos dispositivos.
 */
export function agregarLinea<T extends LineaGuardada>(
  lineas: readonly T[],
  nueva: T,
  tope = TOPE_POR_LINEA,
): T[] {
  const limite = topeDeLinea(nueva, tope);
  if (limite <= 0) return [...lineas];

  const existente = lineas.find((l) => l.varianteId === nueva.varianteId);

  if (!existente) {
    return [...lineas, { ...nueva, cantidad: acotar(nueva.cantidad, limite) }];
  }

  return lineas.map((linea) =>
    linea.varianteId === nueva.varianteId
      ? // Los datos de presentacion se refrescan con los del ultimo agregado:
        // el precio o el stock pueden haber cambiado desde que se guardo.
        { ...linea, ...nueva, cantidad: acotar(linea.cantidad + nueva.cantidad, limite) }
      : linea,
  );
}

/** Fija la cantidad de una linea. Cantidad <= 0 la quita del carrito. */
export function fijarCantidad<T extends LineaGuardada>(
  lineas: readonly T[],
  varianteId: string,
  cantidad: number,
  tope = TOPE_POR_LINEA,
): T[] {
  if (cantidad <= 0) return quitarLinea(lineas, varianteId);

  return lineas.map((linea) =>
    linea.varianteId === varianteId
      ? { ...linea, cantidad: acotar(cantidad, topeDeLinea(linea, tope)) }
      : linea,
  );
}

export function quitarLinea<T extends LineaGuardada>(lineas: readonly T[], varianteId: string): T[] {
  return lineas.filter((linea) => linea.varianteId !== varianteId);
}

/** Descarta las lineas que ya no tienen stock. La usa el aviso del carrito. */
export function quitarAgotadas<T extends LineaGuardada>(lineas: readonly T[]): T[] {
  return lineas.filter((linea) => topeDeLinea(linea) > 0);
}

/** Unidades totales. Es el numero de la insignia de la cabecera. */
export function contarUnidades(lineas: readonly LineaGuardada[]): number {
  return lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
}

function acotar(cantidad: number, limite: number): number {
  return Math.max(1, Math.min(Math.trunc(cantidad), limite));
}
