// ═══════════════════════════════════════════════════════════════════════════
//  Calculo de envio por zona.
//
//  El cliente elige departamento; la zona se deduce de ahi. Si un metodo no
//  tiene tarifa para esa zona, no se ofrece.
// ═══════════════════════════════════════════════════════════════════════════

import { redondear } from "../precios/igv";

export interface TarifaZona {
  metodoId: string;
  metodoClave: string;
  metodoNombre: string;
  tipo: "AGENCIA" | "DOMICILIO" | "RECOJO";
  zonaId: string;
  departamentos: string[];
  precio: number;
  gratisDesde: number | null;
  diasMin: number | null;
  diasMax: number | null;
  pesoMaxKg: number | null;
}

export interface OpcionEnvio {
  metodoId: string;
  clave: string;
  nombre: string;
  tipo: TarifaZona["tipo"];
  costo: number;
  gratis: boolean;
  motivoGratis?: "MONTO_MINIMO" | "PROMOCION" | "CUPON";
  diasMin: number | null;
  diasMax: number | null;
  /** Texto listo para la interfaz: "1 a 2 dias habiles". */
  plazo: string;
}

export interface ConsultaEnvio {
  departamento: string;
  /** Subtotal ya con descuentos, para evaluar el envio gratis por monto. */
  subtotal: number;
  pesoTotalKg?: number;
  /** Una promocion o un cupon ya concedieron envio gratis. */
  envioGratisForzado?: "PROMOCION" | "CUPON" | null;
}

function textoPlazo(min: number | null, max: number | null): string {
  if (min === null && max === null) return "Plazo por confirmar";
  if (min !== null && max !== null && min !== max) return `${min} a ${max} dias habiles`;
  const dias = max ?? min ?? 0;
  return dias === 1 ? "1 dia habil" : `${dias} dias habiles`;
}

export function opcionesDeEnvio(tarifas: TarifaZona[], consulta: ConsultaEnvio): OpcionEnvio[] {
  const departamento = consulta.departamento.trim().toLowerCase();

  return tarifas
    .filter((t) => t.departamentos.some((d) => d.trim().toLowerCase() === departamento))
    .filter((t) => t.pesoMaxKg === null || (consulta.pesoTotalKg ?? 0) <= t.pesoMaxKg)
    .map((t): OpcionEnvio => {
      const gratisPorMonto = t.gratisDesde !== null && consulta.subtotal >= t.gratisDesde;
      const forzado = consulta.envioGratisForzado ?? null;
      const gratis = gratisPorMonto || forzado !== null || t.precio === 0;

      return {
        metodoId: t.metodoId,
        clave: t.metodoClave,
        nombre: t.metodoNombre,
        tipo: t.tipo,
        costo: gratis ? 0 : redondear(t.precio),
        gratis,
        motivoGratis: gratis ? (forzado ?? (gratisPorMonto ? "MONTO_MINIMO" : undefined)) : undefined,
        diasMin: t.diasMin,
        diasMax: t.diasMax,
        plazo: textoPlazo(t.diasMin, t.diasMax),
      };
    })
    .sort((a, b) => a.costo - b.costo);
}

/** Cuanto falta para el envio gratis. `null` si ya lo tiene o si no aplica. */
export function faltaParaEnvioGratis(tarifas: TarifaZona[], subtotal: number): number | null {
  const umbrales = tarifas
    .map((t) => t.gratisDesde)
    .filter((v): v is number => v !== null && v > subtotal);

  if (umbrales.length === 0) return null;
  return redondear(Math.min(...umbrales) - subtotal);
}
