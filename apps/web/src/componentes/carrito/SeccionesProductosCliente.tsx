"use client";

import { SeccionProductos, type PropsTarjetaPromo } from "@appstore/ui";

import { useCarrito, useHidratarCarrito } from "@/lib/carrito";
import type { VistaCatalogo } from "@/lib/consultas";

export interface PropsSeccionesProductosCliente {
  ofertas: VistaCatalogo[];
  nuevos: VistaCatalogo[];
  masVendidos: VistaCatalogo[];
  bannerOferta?: PropsTarjetaPromo | null;
}

/**
 * Hidrata el carrito una sola vez y comparte la misma acción entre los tres
 * bloques de productos de la portada.
 */
export function SeccionesProductosCliente({
  ofertas,
  nuevos,
  masVendidos,
  bannerOferta,
}: PropsSeccionesProductosCliente) {
  useHidratarCarrito();
  const agregar = useCarrito((estado) => estado.agregar);

  function alAgregar(producto: VistaCatalogo) {
    const variante = producto.variantes.find((item) => item.stock > 0);
    if (!variante) return;

    agregar({
      varianteId: variante.id,
      cantidad: 1,
      stockDisponible: variante.stock,
      productoSlug: producto.slug,
      nombreProducto: producto.nombre,
      descripcionVar: [variante.talla, variante.color].filter(Boolean).join(" · "),
      skuVariante: variante.sku,
      imagenUrl: producto.imagenUrl ?? null,
      precio: variante.precio,
      precioOferta: producto.enOferta ? producto.precioDesde : null,
    });
  }

  return (
    <>
      <SeccionProductos
        titulo="Ofertas del día"
        productos={ofertas}
        enlaceVerTodo="/ofertas"
        banner={bannerOferta}
        onAgregar={alAgregar}
        prioridadImagenes
      />
      <SeccionProductos
        titulo="Nuevos productos"
        productos={nuevos}
        marcarComoNuevos
        onAgregar={alAgregar}
      />
      <SeccionProductos
        titulo="Más vendidos"
        productos={masVendidos}
        onAgregar={alAgregar}
      />
    </>
  );
}
