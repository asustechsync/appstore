import type { ReactNode } from "react";

import { Boton } from "./Boton";

import "./primitivos.css";

export interface PropsEstadoVacio {
  titulo: string;
  detalle?: string;
  /** Icono decorativo. Si falta, no se pinta el circulo. */
  icono?: ReactNode;
  accionHref?: string;
  accionTexto?: string;
}

/** Estado vacio de una coleccion: carrito, favoritos, pedidos, busqueda. */
export function EstadoVacio({ titulo, detalle, icono, accionHref, accionTexto }: PropsEstadoVacio) {
  return (
    <div className="ui-vacio">
      {icono ? (
        <span className="ui-vacio__icono" aria-hidden="true">
          {icono}
        </span>
      ) : null}
      <p className="ui-vacio__titulo">{titulo}</p>
      {detalle ? <p className="ui-vacio__detalle">{detalle}</p> : null}
      {accionHref && accionTexto ? (
        <Boton variante="solido" href={accionHref}>
          {accionTexto}
        </Boton>
      ) : null}
    </div>
  );
}
