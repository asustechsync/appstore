import "./primitivos.css";

export interface PropsTarjetaPromo {
  /** Texto corto que contextualiza la promocion. */
  gancho: string;
  titulo: string;
  enlace: string;
  textoEnlace?: string;
  imagenUrl?: string | null;
  tono?: "frio" | "calido";
  /** Adelanta la carga cuando la promocion abre el carrusel. */
  prioridad?: boolean;
}

/**
 * Promocion compacta para convivir con las tarjetas de producto dentro de un
 * carrusel. Comparte la misma proporcion de imagen y altura que una card.
 */
export function TarjetaPromo({
  gancho,
  titulo,
  enlace,
  textoEnlace = "Ver ofertas",
  imagenUrl,
  tono = "frio",
  prioridad = false,
}: PropsTarjetaPromo) {
  return (
    <a
      className={`ui-tarjeta-promo ui-tarjeta-promo--${tono}`}
      href={enlace}
      aria-label={`${titulo}. ${textoEnlace}`}
    >
      <span className="ui-tarjeta-promo__panel">
        <span className="ui-tarjeta-promo__titulo">{titulo}</span>
        <span className="ui-tarjeta-promo__gancho">{gancho}</span>
      </span>
      <span className="ui-tarjeta-promo__figura">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt=""
            width={400}
            height={320}
            loading={prioridad ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={prioridad ? "high" : undefined}
          />
        ) : null}
      </span>
    </a>
  );
}
