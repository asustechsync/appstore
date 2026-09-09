import {
  BannerPromo,
  CarruselProductos,
  Contenedor,
  HeroPortada,
  PanelSeccion,
  Pila,
  RejillaBanners,
  Seccion,
  TarjetaCategoria,
  TarjetaPromo,
  TarjetaProducto,
} from "@appstore/ui";

import { finalizaOfertaFlash, promocionesPortada } from "@/lib/contenido";
import { categoriasDestacadas, destacadosPortada, productosEnOferta, resumenPortada } from "@/lib/consultas";

/** CLASE A — portada. Etiqueta `portada`. Presupuesto: 20-40 ms. */

export default async function Portada() {
  // Las dos consultas comparten etiqueta y salen de cache; en paralelo para
  // que el primer render tras una invalidacion pague una sola espera.
  const [categorias, destacados, ofertas, resumen] = await Promise.all([
    categoriasDestacadas(12),
    destacadosPortada(6),
    productosEnOferta(1),
    resumenPortada(),
  ]);
  const ofertaFlash = ofertas[0] ?? null;
  const productosHero = destacados.filter((producto) => producto.slug !== ofertaFlash?.slug);

  return (
    <Seccion>
      <Contenedor>
        <Pila gap={6}>
          <HeroPortada
            totalProductos={resumen.totalProductos}
            totalCategorias={resumen.totalCategorias}
            categoria={
              categorias[0]
                ? {
                    nombre: categorias[0].nombre,
                    enlace: `/categorias/${categorias[0].slug}`,
                    imagenUrl: categorias[0].imagenUrl,
                  }
                : null
            }
            oferta={
              ofertaFlash && ofertaFlash.descuentoPct !== null
                ? {
                    nombre: ofertaFlash.nombre,
                    enlace: `/productos/${ofertaFlash.slug}`,
                    imagenUrl: ofertaFlash.imagenUrl,
                    precio: ofertaFlash.precioDesde,
                    precioLista: ofertaFlash.precioLista,
                    descuentoPct: ofertaFlash.descuentoPct,
                    finalizaEn: finalizaOfertaFlash,
                    calificacion: ofertaFlash.calificacion,
                    stock: ofertaFlash.stockTotal,
                  }
                : null
            }
            bannerPromocion={{
              gancho: "Cupones y descuentos",
              titulo: "Ahorra en tu próxima compra",
              enlace: "/ofertas",
            }}
            productos={productosHero.slice(0, 2).map((producto) => ({
              nombre: producto.nombre,
              enlace: `/productos/${producto.slug}`,
              imagenUrl: producto.imagenUrl,
              precio: producto.precioDesde,
              precioLista: producto.precioLista,
              enOferta: producto.enOferta,
              descuentoPct: producto.descuentoPct,
            }))}
          />

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
              <CarruselProductos etiqueta="Productos destacados" densidad="productos-con-banner">
                {promocionesPortada[0] ? (
                  <TarjetaPromo
                    gancho={promocionesPortada[0].gancho}
                    titulo={promocionesPortada[0].titulo}
                    enlace={promocionesPortada[0].enlace}
                    imagenUrl={promocionesPortada[0].imagenUrl}
                    tono={promocionesPortada[0].tono}
                    prioridad
                  />
                ) : null}
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
