import type { ReactNode } from "react";

import "./primitivos.css";

const FORMATO = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export interface PropsPrecio {
  /** Precio que paga el cliente, en soles. */
  valor: number;
  /** Precio de lista tachado. Solo se pinta si es mayor que `valor`. */
  antes?: number | null;
  tamano?: "sm" | "md" | "lg";
  /** Presentacion del precio: lineal o resumen con el precio principal debajo. */
  disposicion?: "lineal" | "resumen";
  /** Contenido que se muestra entre el precio anterior y el actual. */
  descuento?: ReactNode;
  /** `inverso` para pintarlo sobre un fondo oscuro. */
  tono?: "normal" | "inverso";
}

export function Precio({
  valor,
  antes,
  tamano = "md",
  tono = "normal",
  descuento,
  disposicion = "lineal",
}: PropsPrecio) {
  const hayOferta = typeof antes === "number" && antes > valor;

  return (
    <span
      className={[
        "ui-precio",
        `ui-precio--${tamano}`,
        `ui-precio--${disposicion}`,
        tono === "inverso" ? "ui-precio--inverso" : "",
        hayOferta ? "ui-precio--oferta" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="ui-precio__actual">{FORMATO.format(valor)}</span>
      {hayOferta ? (
        <s className="ui-precio__antes">{FORMATO.format(antes)}</s>
      ) : null}
      {descuento ? <span className="ui-precio__descuento">{descuento}</span> : null}
    </span>
  );
}
