import { Contenedor, Seccion } from "@appstore/ui";

import { CarritoCliente } from "@/componentes/carrito/CarritoCliente";

/**
 * CLASE B — carrito. Presupuesto: 40 ms al primer pixel.
 *
 * El shell (cabecera, contenedor) es estatico y llega al instante. Las lineas
 * son del cliente: viven en Zustand para el invitado y se sincronizan con la
 * base al iniciar sesion (F3).
 *
 * Los totales los calcula `calcularTotales` de @appstore/core — la MISMA
 * funcion que usa el checkout y el cierre del pedido. Nunca se recalcula un
 * precio en una pagina.
 *
 * La pagina no define estilos: solo compone primitivos y dispone el layout.
 */

export const metadata = { title: "Carrito" };

export default function PaginaCarrito() {
  return (
    <Seccion>
      <Contenedor>
        <CarritoCliente />
      </Contenedor>
    </Seccion>
  );
}
