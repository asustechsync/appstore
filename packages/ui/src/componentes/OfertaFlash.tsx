import { CuentaRegresivaOferta } from "./CuentaRegresivaOferta";
import { Estrellas } from "./Estrellas";
import { Precio } from "./Precio";

import "./primitivos.css";

export interface PropsOfertaFlash {
  nombre: string;
  enlace: string;
  imagenUrl?: string | null;
  precio: number;
  precioLista?: number | null;
  descuentoPct: number;
  finalizaEn: string;
  calificacion?: number | null;
  stock?: number | null;
}

/** Oferta breve para resaltar un producto con tiempo limitado. */
export function OfertaFlash({
  nombre,
  enlace,
  imagenUrl,
  precio,
  precioLista,
  descuentoPct,
  finalizaEn,
  calificacion,
  stock,
}: PropsOfertaFlash) {
  return (
    <a className="ui-oferta-flash" href={enlace}>
      <span className="ui-oferta-flash__figura">
        <span className="ui-oferta-flash__etiqueta">Oferta</span>
        <span className="ui-oferta-flash__descuento">-{descuentoPct}%</span>
        {imagenUrl ? (
          <img src={imagenUrl} alt="" width={360} height={280} loading="eager" decoding="async" />
        ) : null}
      </span>
      <span className="ui-oferta-flash__contenido">
        <span className="ui-oferta-flash__eyebrow">Tiempo limitado</span>
        <span className="ui-oferta-flash__nombre">{nombre}</span>
        {calificacion !== null && calificacion !== undefined ? <Estrellas valor={calificacion} /> : null}
        <span className="ui-oferta-flash__precio">
          <Precio valor={precio} antes={precioLista} tamano="sm" />
        </span>
        {stock !== null && stock !== undefined ? (
          <span className="ui-oferta-flash__disponibilidad">
            Disponible: {stock}
            <i aria-hidden="true" />
          </span>
        ) : null}
        <CuentaRegresivaOferta finalizaEn={finalizaEn} />
      </span>
    </a>
  );
}
