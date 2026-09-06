import type { HTMLAttributes, ReactNode } from "react";

import "./primitivos.css";

export interface PropsTarjeta extends HTMLAttributes<HTMLDivElement> {
  variante?: "borde" | "plana" | "elevada";
  interactiva?: boolean;
  /** Envuelve el contenido con el padding estandar. */
  conCuerpo?: boolean;
  children: ReactNode;
}

export function Tarjeta({
  variante = "borde",
  interactiva = false,
  conCuerpo = true,
  className,
  children,
  ...resto
}: PropsTarjeta) {
  const clases = [
    "ui-tarjeta",
    variante === "plana" ? "ui-tarjeta--plana" : "",
    variante === "elevada" ? "ui-tarjeta--elevada" : "",
    interactiva ? "ui-tarjeta--interactiva" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={clases} {...resto}>
      {conCuerpo ? <div className="ui-tarjeta__cuerpo">{children}</div> : children}
    </div>
  );
}
