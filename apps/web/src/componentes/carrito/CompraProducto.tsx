"use client";

import { PanelCompra, type OpcionCompra } from "@appstore/ui";

import { useCarrito, useHidratarCarrito } from "@/lib/carrito";

/** Lo minimo de una variante para poder venderla. Todo serializable. */
export interface VarianteCompra {
  id: string;
  sku: string;
  talla: string;
  color: string;
  precio: number;
  stock: number;
}

export interface PropsCompraProducto {
  productoSlug: string;
  nombreProducto: string;
  imagenUrl?: string | null;
  /** Precio efectivo si el producto esta en oferta; si no, `null`. */
  precioOferta?: number | null;
  variantes: VarianteCompra[];
  nombreOpcion?: string;
  disponible: boolean;
  stockTotal?: number;
}

/**
 * Isla de compra de la ficha — el puente entre el panel (de @appstore/ui, que
 * no conoce el carrito) y el carrito del navegador.
 *
 * La ficha sigue siendo Clase A: esto se hidrata aparte y recibe solo props
 * serializables, sin volver dinamica la pagina.
 */
export function CompraProducto({
  productoSlug,
  nombreProducto,
  imagenUrl,
  precioOferta,
  variantes,
  nombreOpcion = "Talla",
  disponible,
  stockTotal,
}: PropsCompraProducto) {
  // Hay que leer lo guardado ANTES de agregar: si no, la primera linea que
  // se agregue pisaria el carrito que ya existia en localStorage.
  useHidratarCarrito();
  const agregar = useCarrito((estado) => estado.agregar);

  // Las tallas se agrupan sumando el stock de sus variantes de color.
  const opciones: OpcionCompra[] = [...agruparPorTalla(variantes)].map(([valor, stock]) => ({
    valor,
    stock,
  }));

  function alAgregar(talla: string, cantidad: number) {
    const variante = variantes.find((v) => v.talla === talla && v.stock > 0);
    if (!variante) return;

    agregar({
      varianteId: variante.id,
      cantidad,
      stockDisponible: variante.stock,
      productoSlug,
      nombreProducto,
      descripcionVar: [variante.talla, variante.color].filter(Boolean).join(" · "),
      skuVariante: variante.sku,
      imagenUrl: imagenUrl ?? null,
      precio: variante.precio,
      precioOferta: precioOferta ?? null,
    });
  }

  return (
    <PanelCompra
      opciones={opciones}
      nombreOpcion={nombreOpcion}
      disponible={disponible}
      {...(typeof stockTotal === "number" ? { stockTotal } : {})}
      onAgregar={alAgregar}
    />
  );
}

function agruparPorTalla(variantes: VarianteCompra[]): Map<string, number> {
  const porTalla = new Map<string, number>();
  for (const variante of variantes) {
    porTalla.set(variante.talla, (porTalla.get(variante.talla) ?? 0) + variante.stock);
  }
  return porTalla;
}
