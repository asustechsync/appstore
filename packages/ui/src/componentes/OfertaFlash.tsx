import { CuentaRegresivaOferta } from "./CuentaRegresivaOferta";
import { Insignia } from "./Insignia";
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
  finalizaEn,
  calificacion,
  stock,
}: PropsOfertaFlash) {
  const valorCalificacion = calificacion ?? 4.5;

  return (
    <a className="ui-oferta-flash" href={enlace}>
      <span className="ui-oferta-flash__figura">
        <span className="ui-oferta-flash__etiquetas">
          <Insignia tono="oferta">OFERTA</Insignia>
          <Insignia tono="tendencia">TENDENCIA</Insignia>
        </span>
        {imagenUrl ? (
          <img src={imagenUrl} alt="" width={360} height={280} loading="eager" decoding="async" />
        ) : null}
      </span>
      <span className="ui-oferta-flash__contenido">
        <span className="ui-oferta-flash__nombre">{nombre}</span>
        <span className="ui-oferta-flash__calificacion" role="img" aria-label={`Calificacion: ${valorCalificacion} de 5`}>
          {[1, 2, 3, 4, 5].map((estrella) => (
            <i key={estrella} className="ui-oferta-flash__calificacion-icono" aria-hidden="true" />
          ))}
        </span>
        <span className="ui-oferta-flash__precio">
          <Precio valor={precio} antes={precioLista} tamano="md" />
        </span>
        {stock !== null && stock !== undefined ? (
          <span className="ui-oferta-flash__disponibilidad">
            DISPONIBLE: {stock}
            <i aria-hidden="true" />
          </span>
        ) : null}
        <CuentaRegresivaOferta finalizaEn={finalizaEn} />
      </span>
    </a>
  );
}
