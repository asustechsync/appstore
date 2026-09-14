import { BannerPromo } from "./BannerPromo";
import { SlidePortada, type DiapositivaPortada } from "./SlidePortada";

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
  categorias?: Array<{ nombre: string; enlace: string }>;
  diapositivas?: DiapositivaPortada[];
  categoria?: PiezaCategoriaHero | null;
  productos?: PiezaProductoHero[];
  banners?: Array<{ gancho: string; titulo: string; enlace: string; tono?: "frio" | "calido" }>;
}

/**
 * Entrada editorial de la portada. La composición mantiene el mensaje de
 * marca fijo y completa el costado con una categoría y un producto vigentes.
 */
export function HeroPortada({
  categorias = [],
  diapositivas = [],
  banners = [],
}: PropsHeroPortada) {
  return (
    <section className="ui-hero-portada" aria-labelledby="titulo-hero-portada">
      {categorias.length > 0 ? (
        <nav className="ui-hero-portada__categorias" aria-label="Categorías destacadas">
          {categorias.slice(0, 9).map((item) => (
            <a key={item.enlace} href={item.enlace}>
              <span className="ui-hero-portada__categoria-icono ui-hero-portada__categoria-icono--categoria" aria-hidden="true" />
              {item.nombre}
            </a>
          ))}
          <span className="ui-hero-portada__categoria-separador" aria-hidden="true" />
          <a className="ui-hero-portada__categoria-especial" href="/buscar?q=combos"><span className="ui-hero-portada__categoria-icono ui-hero-portada__categoria-icono--combos" aria-hidden="true" />COMBOS</a>
          <a className="ui-hero-portada__categoria-especial" href="/ofertas"><span className="ui-hero-portada__categoria-icono ui-hero-portada__categoria-icono--ofertas" aria-hidden="true" />OFERTAS</a>
          <a className="ui-hero-portada__categoria-especial" href="/cupones"><span className="ui-hero-portada__categoria-icono ui-hero-portada__categoria-icono--cupones" aria-hidden="true" />CUPONES</a>
          <a className="ui-hero-portada__categoria-especial" href="/ofertas"><span className="ui-hero-portada__categoria-icono ui-hero-portada__categoria-icono--tendencia" aria-hidden="true" />TENDENCIA</a>
        </nav>
      ) : null}
      <div className="ui-hero-portada__principal">
        <SlidePortada diapositivas={diapositivas} />
      </div>

      <div className="ui-hero-portada__banners">
        {banners.slice(0, 2).map((banner) => (
          <BannerPromo key={banner.titulo} {...banner} textoEnlace="Ver más" />
        ))}
      </div>
    </section>
  );
}
