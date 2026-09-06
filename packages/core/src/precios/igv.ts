// ═══════════════════════════════════════════════════════════════════════════
//  IGV — Peru
//
//  En Peru los precios se MUESTRAN con IGV incluido. Todo lo que guardamos en
//  `Producto.precio` y `Variante.precio` es precio final al publico.
//  El desglose solo hace falta al emitir el comprobante (F6).
// ═══════════════════════════════════════════════════════════════════════════

import type { AfectacionIgv } from "../puertos/facturacion";

export const TASA_IGV = 0.18;

/** Redondeo a 2 decimales evitando el error binario de coma flotante. */
export function redondear(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export interface DesgloseIgv {
  /** Base imponible: lo que se cobra sin IGV. */
  valorVenta: number;
  igv: number;
  /** Lo que paga el cliente. */
  precioVenta: number;
  afectacion: AfectacionIgv;
}

/**
 * Desglosa un precio que YA incluye IGV.
 * S/ 118.00 gravado -> valorVenta 100.00, igv 18.00
 */
export function desglosar(
  precioConIgv: number,
  afectacion: AfectacionIgv = "GRAVADO",
): DesgloseIgv {
  if (afectacion !== "GRAVADO") {
    return {
      valorVenta: redondear(precioConIgv),
      igv: 0,
      precioVenta: redondear(precioConIgv),
      afectacion,
    };
  }

  const valorVenta = redondear(precioConIgv / (1 + TASA_IGV));

  return {
    valorVenta,
    igv: redondear(precioConIgv - valorVenta),
    precioVenta: redondear(precioConIgv),
    afectacion,
  };
}

/** Suma los desgloses de todas las lineas y los agrupa como los pide SUNAT. */
export function totalizar(
  lineas: Array<{ precioConIgv: number; cantidad: number; afectacion?: AfectacionIgv }>,
): { gravado: number; exonerado: number; inafecto: number; igv: number; total: number } {
  let gravado = 0;
  let exonerado = 0;
  let inafecto = 0;
  let igv = 0;
  let total = 0;

  for (const linea of lineas) {
    const bruto = linea.precioConIgv * linea.cantidad;
    const d = desglosar(bruto, linea.afectacion ?? "GRAVADO");

    if (d.afectacion === "GRAVADO") gravado += d.valorVenta;
    else if (d.afectacion === "EXONERADO") exonerado += d.valorVenta;
    else inafecto += d.valorVenta;

    igv += d.igv;
    total += d.precioVenta;
  }

  return {
    gravado: redondear(gravado),
    exonerado: redondear(exonerado),
    inafecto: redondear(inafecto),
    igv: redondear(igv),
    total: redondear(total),
  };
}
