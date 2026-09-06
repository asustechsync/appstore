// ═══════════════════════════════════════════════════════════════════════════
//  PUERTO: pasarela de pago
//
//  El checkout habla SIEMPRE con esta interfaz, nunca con una pasarela
//  concreta. Por eso F5 (Izipay) es anadir un archivo, no tocar el checkout.
//
//    Hoy   -> PasarelaManual   (Yape, Plin, transferencia, contraentrega)
//    F5    -> PasarelaIzipay
// ═══════════════════════════════════════════════════════════════════════════

export type Moneda = "PEN" | "USD";

export interface DatosIntento {
  pedidoId: string;
  numeroPedido: number;
  monto: number;
  moneda: Moneda;
  /** Correo del comprador — la pasarela lo usa para el recibo. */
  email: string;
  /** A donde vuelve el cliente cuando termina de pagar. */
  urlRetorno: string;
}

export interface IntentoPago {
  /** Id del registro `Pago` en nuestra base. */
  pagoId: string;
  /** Id del lado de la pasarela. En manual es el numero de operacion. */
  referenciaExterna: string | null;
  /**
   * Lo que el front necesita para cobrar:
   *  - "redireccion": mandar al cliente a `url`
   *  - "formulario":  montar el formulario incrustado con `token`
   *  - "instrucciones": mostrar los datos de Yape/transferencia
   */
  modo: "redireccion" | "formulario" | "instrucciones";
  url?: string;
  token?: string;
  instrucciones?: string;
}

export type EstadoResultado =
  | "PAGADO"
  | "PENDIENTE"
  | "RECHAZADO"
  | "CANCELADO"
  | "REEMBOLSADO";

export interface ResultadoPago {
  estado: EstadoResultado;
  referenciaExterna: string | null;
  monto: number;
  mensaje?: string;
  codigoError?: string;
  marcaTarjeta?: string;
  ultimosDigitos?: string;
  /** Respuesta cruda: se guarda en `IntentoPago.payload` para poder depurar. */
  crudo?: unknown;
}

export interface EventoPago {
  tipo: string;
  referenciaExterna: string | null;
  estado: EstadoResultado;
  monto: number | null;
  firmaValida: boolean;
  crudo: unknown;
}

export interface PasarelaPago {
  /** Nombre corto que se guarda en `Pago.pasarela`. */
  readonly nombre: string;

  /** Abre el cobro. Crea el `Pago` en estado PENDIENTE. */
  crearIntento(datos: DatosIntento): Promise<IntentoPago>;

  /** Consulta el estado real contra la pasarela. Fuente de verdad al volver. */
  confirmar(referenciaExterna: string): Promise<ResultadoPago>;

  /** Devuelve el dinero. Sin `monto` es reembolso total. */
  reembolsar(referenciaExterna: string, monto?: number): Promise<ResultadoPago>;

  /**
   * Valida la firma del webhook y lo normaliza.
   * NUNCA confiar en el cuerpo sin verificar la firma: cualquiera puede
   * llamar a la URL del webhook.
   */
  verificarWebhook(cuerpo: unknown, cabeceras: Record<string, string>): Promise<EventoPago>;
}
