/**
 * CLASE B — checkout. Shell en 40 ms; los datos no se cachean nunca.
 *
 * Pasos: direccion -> envio -> facturacion -> pago.
 *
 * El paso de facturacion pide tipo de comprobante, RUC/DNI y razon social
 * DESDE AHORA (F3), aunque la emision llegue en F6. Si no se piden desde el
 * inicio, F6 empieza persiguiendo clientes por datos que ya no se consiguen.
 *
 * El cobro pasa por el puerto `PasarelaPago`:
 *   hoy -> PasarelaManual (Yape, Plin, transferencia)
 *   F5  -> PasarelaIzipay, sin tocar esta pagina.
 */

export const metadata = { title: "Finalizar compra" };

export default function PaginaCheckout() {
  return (
    <main>
      <h1>Finalizar compra</h1>
      {/* F3: <PasosCompra />, <FormularioEnvio />, <FormularioFacturacion />,
              <SelectorPago />, <ResumenPedido /> */}
    </main>
  );
}
