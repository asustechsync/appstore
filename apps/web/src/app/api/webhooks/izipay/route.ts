import { NextResponse } from "next/server";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Webhook de Izipay — FASE 5.
 *
 *  La ruta existe desde ahora para que la URL este registrada y el flujo
 *  este probado. Hasta F5 responde 501.
 *
 *  Cuando llegue F5, el cuerpo de este archivo es:
 *
 *    const pasarela = new PasarelaIzipay(config)
 *    const evento = await pasarela.verificarWebhook(cuerpo, cabeceras)
 *    if (!evento.firmaValida) return 401
 *    await registrarEventoPasarela(evento)      // se guarda SIEMPRE, crudo
 *    await aplicarResultadoDePago(evento)       // mueve el pedido de estado
 *
 *  REGLAS que no se negocian:
 *    1. Verificar la firma ANTES de leer nada del cuerpo. La URL es publica:
 *       cualquiera puede llamarla diciendo que un pedido esta pagado.
 *    2. Guardar el evento crudo en `eventos_pasarela` aunque falle el
 *       procesamiento. Es la unica forma de conciliar despues.
 *    3. Ser idempotente: las pasarelas reintentan. El mismo evento dos veces
 *       no puede cobrar ni despachar dos veces.
 *    4. Responder 200 rapido. Lo pesado (correo, comprobante) va a la cola.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { error: "La integracion con Izipay llega en la fase 5." },
    { status: 501 },
  );
}
