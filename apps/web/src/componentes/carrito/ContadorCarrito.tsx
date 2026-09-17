"use client";

import { InsigniaContador } from "@appstore/ui";

import { unidadesDe, useCarrito, useHidratarCarrito } from "@/lib/carrito";

/**
 * Contador del carrito en la cabecera.
 *
 * Isla minima: la cabecera sigue siendo HTML estatico del CDN y esto se
 * hidrata encima. No lee cookies ni toca el servidor.
 */
export function ContadorCarrito() {
  const hidratado = useHidratarCarrito();
  const unidades = useCarrito((estado) => unidadesDe(estado.lineas));

  if (!hidratado) return null;

  return <InsigniaContador valor={unidades} />;
}
