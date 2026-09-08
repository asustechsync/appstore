import "./primitivos.css";

export interface PropsBannerPromo {
  /** Gancho corto sobre el titulo, ej. "Hasta 30% de descuento". */
  gancho: string;
  titulo: string;
  enlace: string;
  /** Texto del enlace. Por defecto "Comprar ahora". */
  textoEnlace?: string;
  imagenUrl?: string | null;
  /** Fondo del banner. Alterna entre los dos tonos suaves del sistema. */
  tono?: "frio" | "calido";
}

/**
 * Franja promocional de la portada: gancho, titulo, enlace y una imagen del
 * producto a la derecha. El fondo sale de los tonos del sistema, no de la
 * imagen, para que el texto conserve el contraste con cualquier foto.
 */
export function BannerPromo({
  gancho,
  titulo,
  enlace,
  textoEnlace = "Comprar ahora",
  imagenUrl,
  tono = "frio",
}: PropsBannerPromo) {
  return (
    <a className={`ui-banner-promo ui-banner-promo--${tono}`} href={enlace}>
      <span className="ui-banner-promo__texto">
        <span className="ui-banner-promo__gancho">{gancho}</span>
        <span className="ui-banner-promo__titulo">{titulo}</span>
        <span className="ui-banner-promo__accion">{textoEnlace}</span>
      </span>
      {imagenUrl ? (
        <span className="ui-banner-promo__figura">
          <img src={imagenUrl} alt="" width={320} height={220} loading="lazy" decoding="async" />
        </span>
      ) : null}
    </a>
  );
}
