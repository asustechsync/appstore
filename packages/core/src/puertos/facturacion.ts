// ═══════════════════════════════════════════════════════════════════════════
//  PUERTO: comprobantes electronicos (SUNAT)
//
//    Hoy -> ComprobanteBorrador  (crea la fila en BORRADOR, no envia nada)
//    F6  -> NubefactProvider / el OSE que se elija
//
//  Los datos del receptor se capturan en el checkout DESDE F3. Si no se piden
//  desde el inicio, F6 empieza persiguiendo clientes por datos perdidos.
// ═══════════════════════════════════════════════════════════════════════════

export type TipoDocumentoSunat = "DNI" | "RUC" | "CE" | "PASAPORTE";
export type TipoComprobante = "BOLETA" | "FACTURA" | "NOTA_CREDITO" | "NOTA_DEBITO";
export type AfectacionIgv = "GRAVADO" | "EXONERADO" | "INAFECTO";

export interface Receptor {
  tipoDoc: TipoDocumentoSunat;
  numDoc: string;
  nombre: string; // nombre completo o razon social
  direccion?: string; // domicilio fiscal, obligatorio en factura
  email?: string;
}

export interface LineaComprobante {
  descripcion: string;
  codigo?: string;
  unidadMedida: string; // NIU = unidad
  cantidad: number;
  /** Precio unitario CON IGV, que es como se muestra en Peru. */
  precioUnitario: number;
  descuento?: number;
  afectacionIgv: AfectacionIgv;
}

export interface SolicitudComprobante {
  pedidoId: string;
  tipo: TipoComprobante;
  receptor: Receptor;
  lineas: LineaComprobante[];
  /** Ya calculado por packages/core/precios. */
  totales: {
    gravado: number;
    exonerado: number;
    inafecto: number;
    igv: number;
    descuento: number;
    total: number;
  };
  moneda: "PEN" | "USD";
  observaciones?: string;
}

export type EstadoSunat =
  | "BORRADOR"
  | "ENVIADO"
  | "ACEPTADO"
  | "OBSERVADO"
  | "RECHAZADO"
  | "ANULADO";

export interface Comprobante {
  id: string;
  tipo: TipoComprobante;
  serie: string;
  correlativo: number;
  estado: EstadoSunat;
  hashCpe?: string;
  xmlUrl?: string;
  cdrUrl?: string;
  pdfUrl?: string;
  mensaje?: string;
  crudo?: unknown;
}

export interface ProveedorComprobante {
  readonly nombre: string;

  emitir(solicitud: SolicitudComprobante): Promise<Comprobante>;

  anular(comprobanteId: string, motivo: string): Promise<void>;

  consultarEstado(comprobanteId: string): Promise<EstadoSunat>;

  /** Nota de credito sobre un comprobante ya emitido. */
  notaDeCredito(comprobanteId: string, motivo: string, lineas?: LineaComprobante[]): Promise<Comprobante>;
}
