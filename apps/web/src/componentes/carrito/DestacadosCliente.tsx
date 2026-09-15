"use client";

import { ProductosDestacados, type PropsTarjetaPromo } from "@appstore/ui";

import { useCarrito, useHidratarCarrito } from "@/lib/carrito";
import type { VistaCatalogo } from "@/lib/consultas";

export interface PropsDestacadosCliente {
  productos: VistaCatalogo[];
  banner?: PropsTarjetaPromo | null;
}

/**
 * Puente de cliente entre `ProductosDestacados` (de @appstore/ui, sin
 * carrito) y el carrito del navegador. La portada sigue siendo Clase A:
 * esto se hidrata aparte y recibe solo props serializables.
 *
 * El boton "AGREGAR" de la card no elige talla: agrega la primera variante
 * con stock. Elegir talla sigue siendo trabajo de la ficha del producto.
 */
export function DestacadosCliente({ productos, banner }: PropsDestacadosCliente) {
  useHidratarCarrito();
  const agregar = useCarrito((estado) => estado.agregar);

  function alAgregar(producto: VistaCatalogo) {
    const variante = producto.variantes.find((v) => v.stock > 0);
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

  return <ProductosDestacados productos={productos} banner={banner} onAgregar={alAgregar} />;
}
