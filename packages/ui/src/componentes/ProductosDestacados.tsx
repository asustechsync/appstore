import { CarruselProductos } from "./CarruselProductos";
import { PanelSeccion } from "./PanelSeccion";
import { TarjetaPromo, type PropsTarjetaPromo } from "./TarjetaPromo";
import { TarjetaProducto } from "./TarjetaProducto";

import "./primitivos.css";

export function ProductosDestacados({ productos, banner }: { productos: any[]; banner?: PropsTarjetaPromo | null }) {
  return <PanelSeccion titulo="Productos destacados" accion={<a href="/ofertas">Ver todo</a>} variante="libre"><CarruselProductos etiqueta="Productos destacados" densidad="productos-con-banner">
    {banner ? <TarjetaPromo {...banner} prioridad /> : null}
    {productos.map((p, indice) => <TarjetaProducto key={p.slug} enlace={`/productos/${p.slug}`} nombre={p.nombre} imagenUrl={p.imagenUrl} marca={p.marcaNombre} sku={p.sku} categoria={p.categoriaSlug} precio={p.precioDesde} precioLista={p.precioLista} enOferta={p.enOferta} descuentoPct={p.descuentoPct} etiqueta={p.etiqueta === "Nuevo" ? "nuevo" : undefined} disponible={p.disponible} calificacion={p.calificacion} totalResenas={p.totalResenas} stock={p.stockTotal} prioridad={indice < 6} />)}
  </CarruselProductos></PanelSeccion>;
}
