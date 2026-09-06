/**
 * CLASE B — carrito. Presupuesto: 40 ms al primer pixel.
 *
 * El shell (cabecera, estructura, resumen vacio) es estatico y llega al
 * instante. Las lineas del carrito son del cliente: viven en Zustand para el
 * invitado y se sincronizan con la base al iniciar sesion.
 *
 * Los totales los calcula `calcularTotales` de @appstore/core — la MISMA
 * funcion que usa el checkout y el cierre del pedido. Nunca se recalcula
 * un precio en una pagina.
 */

export const metadata = { title: "Carrito" };

export default function PaginaCarrito() {
  return (
    <main>
      <h1>Tu carrito</h1>
      {/* F3: <LineasCarrito /> y <ResumenCompra /> — componentes cliente */}
    </main>
  );
}
