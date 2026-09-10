import { Boton } from "./Boton";
import { BannerPromo } from "./BannerPromo";
import { OfertaFlash, type PropsOfertaFlash } from "./OfertaFlash";
import { Precio } from "./Precio";

import "./primitivos.css";

export interface PiezaCategoriaHero {
  nombre: string;
  enlace: string;
  imagenUrl?: string | null;
}

export interface PiezaProductoHero {
  nombre: string;
  enlace: string;
  imagenUrl?: string | null;
  precio: number;
  precioLista?: number | null;
  enOferta?: boolean;
  descuentoPct?: number | null;
}

export interface PropsHeroPortada {
  totalProductos: number;
  totalCategorias: number;
  categoria?: PiezaCategoriaHero | null;
  productos?: PiezaProductoHero[];
  oferta?: PropsOfertaFlash | null;
  bannerPromocion?: { gancho: string; titulo: string; enlace: string } | null;
}

/**
 * Entrada editorial de la portada. La composición mantiene el mensaje de
 * marca fijo y completa el costado con una categoría y un producto vigentes.
 */
export function HeroPortada({
  totalProductos,
  totalCategorias,
  categoria,
  productos = [],
  oferta,
  bannerPromocion,
}: PropsHeroPortada) {
  return (
    <section className="ui-hero-portada" aria-labelledby="titulo-hero-portada">
      <div className="ui-hero-portada__principal">
        <p className="ui-hero-portada__etiqueta">SOCKS · TIENDA ONLINE</p>
        <h1 id="titulo-hero-portada" className="ui-hero-portada__titulo">
          Ropa interior y básicos para toda la familia.
        </h1>
        <p className="ui-hero-portada__texto">
          Medias, boxers y prendas esenciales elegidas por talla y color, con stock disponible.
        </p>

        <div className="ui-hero-portada__acciones">
          <Boton href="/ofertas">Ver ofertas</Boton>
          {categoria ? (
            <Boton href={categoria.enlace} variante="contorno">
              Explorar categorías
            </Boton>
          ) : null}
        </div>

        <dl className="ui-hero-portada__datos">
          <div>
            <dt>Productos</dt>
            <dd>{totalProductos}</dd>
          </div>
          <div>
            <dt>Categorías</dt>
            <dd>{totalCategorias}</dd>
          </div>
          <div>
            <dt>Envíos</dt>
            <dd>Perú</dd>
          </div>
        </dl>
      </div>

      {!oferta ? productos.slice(0, 1).map((producto) => (
        <a key={producto.enlace} className="ui-hero-portada__pieza" href={producto.enlace}>
          <span className="ui-hero-portada__pieza-figura">
            {producto.imagenUrl ? (
              <img src={producto.imagenUrl} alt="" width={640} height={360} loading="eager" decoding="async" />
            ) : (
              <span className="ui-hero-portada__pieza-inicial" aria-hidden="true">
                {producto.nombre.charAt(0)}
              </span>
            )}
          </span>
          <span className="ui-hero-portada__pieza-texto">
            <span className="ui-hero-portada__pieza-etiqueta">
              {producto.enOferta && producto.descuentoPct ? `Oferta · -${producto.descuentoPct}%` : "Destacado"}
            </span>
            <span className="ui-hero-portada__pieza-titulo">{producto.nombre}</span>
            <span className="ui-hero-portada__pieza-pie">
              <Precio valor={producto.precio} antes={producto.enOferta ? producto.precioLista : null} tamano="sm" />
            </span>
          </span>
        </a>
      )) : null}

      {bannerPromocion ? (
        <div className="ui-hero-portada__cupones">
          <BannerPromo
            gancho={bannerPromocion.gancho}
            titulo={bannerPromocion.titulo}
            enlace={bannerPromocion.enlace}
            textoEnlace="Ver promociones"
            tono="calido"
          />
        </div>
      ) : (
        productos.slice(oferta ? 0 : 1, oferta ? 1 : 2).map((producto) => (
          <a key={producto.enlace} className="ui-hero-portada__pieza" href={producto.enlace}>
            <span className="ui-hero-portada__pieza-figura">
              {producto.imagenUrl ? (
                <img src={producto.imagenUrl} alt="" width={640} height={360} loading="eager" decoding="async" />
              ) : (
                <span className="ui-hero-portada__pieza-inicial" aria-hidden="true">
                  {producto.nombre.charAt(0)}
                </span>
              )}
            </span>
            <span className="ui-hero-portada__pieza-texto">
              <span className="ui-hero-portada__pieza-etiqueta">
                {producto.enOferta && producto.descuentoPct ? `Oferta · -${producto.descuentoPct}%` : "Destacado"}
              </span>
              <span className="ui-hero-portada__pieza-titulo">{producto.nombre}</span>
              <span className="ui-hero-portada__pieza-pie">
                <Precio valor={producto.precio} antes={producto.enOferta ? producto.precioLista : null} tamano="sm" />
              </span>
            </span>
          </a>
        ))
      )}

      {oferta ? <OfertaFlash {...oferta} /> : null}
    </section>
  );
}
