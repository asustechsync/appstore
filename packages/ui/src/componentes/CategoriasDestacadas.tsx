import { CarruselProductos } from "./CarruselProductos";
import { PanelSeccion } from "./PanelSeccion";
import { TarjetaCategoria } from "./TarjetaCategoria";

import "./primitivos.css";

export function CategoriasDestacadas({ categorias }: { categorias: Array<{ slug: string; nombre: string; imagenUrl?: string | null }> }) {
  if (!categorias.length) return null;
  return <PanelSeccion titulo="Compra por categoría"><CarruselProductos etiqueta="Categorías destacadas" densidad="categorias">
    {categorias.map((categoria, indice) => <TarjetaCategoria key={categoria.slug} nombre={categoria.nombre} enlace={`/categorias/${categoria.slug}`} imagenUrl={categoria.imagenUrl} prioridad={indice < 8} />)}
  </CarruselProductos></PanelSeccion>;
}
