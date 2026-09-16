import { CarruselProductos } from "./CarruselProductos";
import { PanelSeccion } from "./PanelSeccion";
import { TarjetaPromo, type PropsTarjetaPromo } from "./TarjetaPromo";
import { TarjetaProducto } from "./TarjetaProducto";

import "./primitivos.css";

export interface ProductoDeSeccion {
  slug: string;
  nombre: string;
  imagenUrl?: string | null;
  marcaNombre?: string | null;
  categoriaSlug?: string | null;
  sku?: string | null;
  precioDesde: number;
  precioLista?: number | null;
  enOferta?: boolean;
  descuentoPct?: number | null;
  etiqueta?: string | null;
  disponible?: boolean;
  calificacion?: number | null;
  totalResenas?: number | null;
  stockTotal?: number | null;
}

export interface PropsSeccionProductos<TProducto extends ProductoDeSeccion = ProductoDeSeccion> {
  titulo: string;
  productos: TProducto[];
  enlaceVerTodo?: string;
  textoVerTodo?: string;
  banner?: PropsTarjetaPromo | null;
  marcarComoNuevos?: boolean;
  prioridadImagenes?: boolean;
  onAgregar?: (producto: TProducto) => void;
}

/**
 * Bloque reutilizable para cualquier selección de catálogo. La página decide
 * qué productos entrega; este componente resuelve una sola vez el encabezado,
 * el carrusel y las tarjetas.
 */
export function SeccionProductos<TProducto extends ProductoDeSeccion>({
  titulo,
  productos,
  enlaceVerTodo,
  textoVerTodo = "Ver todos",
  banner,
  marcarComoNuevos = false,
  prioridadImagenes = false,
  onAgregar,
}: PropsSeccionProductos<TProducto>) {
  if (productos.length === 0) return null;

  return (
    <PanelSeccion
      titulo={titulo}
      accion={enlaceVerTodo ? <a href={enlaceVerTodo}>{textoVerTodo}</a> : undefined}
      variante="libre"
    >
      <CarruselProductos
        etiqueta={titulo}
        densidad={banner ? "productos-con-banner" : "productos-siete"}
      >
        {banner ? <TarjetaPromo {...banner} prioridad /> : null}
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
            etiqueta={marcarComoNuevos || producto.etiqueta === "Nuevo" ? "nuevo" : undefined}
            disponible={producto.disponible}
            calificacion={producto.calificacion}
            totalResenas={producto.totalResenas}
            stock={producto.stockTotal}
            prioridad={prioridadImagenes && indice < 4}
            onAgregar={onAgregar ? () => onAgregar(producto) : undefined}
          />
        ))}
      </CarruselProductos>
    </PanelSeccion>
  );
}
