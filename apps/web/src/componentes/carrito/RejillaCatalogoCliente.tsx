"use client";

import { RejillaProductos, TarjetaProducto } from "@appstore/ui";

import { useCarrito, useHidratarCarrito } from "@/lib/carrito";
import type { VistaCatalogo } from "@/lib/consultas";

export interface PropsRejillaCatalogoCliente {
  productos: VistaCatalogo[];
}

/**
 * Rejilla de un listado (categoria, marca, ofertas) conectada al carrito. El
 * listado sigue siendo Clase A: esta isla se hidrata aparte y solo recibe lo
 * que `catalogo_lectura` ya resolvio.
 *
 * "AGREGAR" toma la primera variante con stock; elegir talla es trabajo de la
 * ficha.
 */
export function RejillaCatalogoCliente({ productos }: PropsRejillaCatalogoCliente) {
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
    <RejillaProductos>
      {productos.map((producto, indice) => (
        <TarjetaProducto
          key={producto.slug}
          enlace={`/productos/${producto.slug}`}
          nombre={producto.nombre}
          imagenUrl={producto.imagenUrl}
          marca={producto.marcaNombre}
          sku={producto.sku}
          categoria={producto.categoriaSlug}
          precio={producto.precioDesde}
          precioLista={producto.precioLista}
          enOferta={producto.enOferta}
          descuentoPct={producto.descuentoPct}
          etiqueta={producto.etiqueta === "Nuevo" ? "nuevo" : undefined}
          disponible={producto.disponible}
          calificacion={producto.calificacion}
          totalResenas={producto.totalResenas}
          stock={producto.stockTotal}
          prioridad={indice < 6}
          onAgregar={() => alAgregar(producto)}
        />
      ))}
    </RejillaProductos>
  );
}
