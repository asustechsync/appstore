import {
  BannerPromo,
  CarruselProductos,
  Contenedor,
  PanelSeccion,
  Pila,
  RejillaBanners,
  Seccion,
  TarjetaCategoria,
  TarjetaProducto,
} from "@appstore/ui";

import { promocionesPortada } from "@/lib/contenido";
import { categoriasDestacadas, destacadosPortada } from "@/lib/consultas";

/** CLASE A — portada. Etiqueta `portada`. Presupuesto: 20-40 ms. */

export default async function Portada() {
  // Las dos consultas comparten etiqueta y salen de cache; en paralelo para
  // que el primer render tras una invalidacion pague una sola espera.
  const [categorias, destacados] = await Promise.all([
    categoriasDestacadas(12),
    destacadosPortada(8),
  ]);

  return (
    <Seccion>
      <Contenedor>
        <Pila gap={6}>
          {/* F1: <HeroPortada /> */}

          {categorias.length > 0 ? (
            <PanelSeccion titulo="Compra por categoria">
              <CarruselProductos etiqueta="Categorias destacadas" densidad="categorias">
                {categorias.map((categoria, indice) => (
                  <TarjetaCategoria
                    key={categoria.slug}
                    nombre={categoria.nombre}
                    enlace={`/categorias/${categoria.slug}`}
                    imagenUrl={categoria.imagenUrl}
                    prioridad={indice < 8}
                  />
                ))}
              </CarruselProductos>
            </PanelSeccion>
          ) : null}

          <PanelSeccion
            titulo="Productos destacados"
            accion={<a href="/ofertas">Ver todo</a>}
            variante="libre"
          >
            <CarruselProductos etiqueta="Productos destacados">
              {destacados.map((p, indice) => (
                <TarjetaProducto
                  key={p.slug}
                  enlace={`/productos/${p.slug}`}
                  nombre={p.nombre}
                  imagenUrl={p.imagenUrl}
                  marca={p.marcaNombre}
                  sku={p.sku}
                  categoria={p.categoriaSlug}
                  precio={p.precioDesde}
                  precioLista={p.precioLista}
                  enOferta={p.enOferta}
                  descuentoPct={p.descuentoPct}
                  etiqueta={p.etiqueta === "Nuevo" ? "nuevo" : undefined}
                  disponible={p.disponible}
                  calificacion={p.calificacion}
                  totalResenas={p.totalResenas}
                  stock={p.stockTotal}
                  prioridad={indice < 6}
                />
              ))}
            </CarruselProductos>
          </PanelSeccion>

          <RejillaBanners>
            {promocionesPortada.map((promo) => (
              <BannerPromo
                key={promo.titulo}
                gancho={promo.gancho}
                titulo={promo.titulo}
                enlace={promo.enlace}
                imagenUrl={promo.imagenUrl}
                tono={promo.tono}
              />
            ))}
          </RejillaBanners>
        </Pila>
      </Contenedor>
    </Seccion>
  );
}
