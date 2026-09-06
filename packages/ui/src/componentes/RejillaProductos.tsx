import type { HTMLAttributes, ReactNode } from "react";

import "./primitivos.css";

export interface PropsRejillaProductos extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Rejilla del catalogo. FIRST MOBILE: `auto-fill` con un ancho minimo de
 * tarjeta hace que sean 2 columnas en un movil y mas segun crece la pantalla,
 * sin puntos de quiebre.
 */
export function RejillaProductos({ className, children, ...resto }: PropsRejillaProductos) {
  return (
    <div className={["ui-rejilla-productos", className ?? ""].filter(Boolean).join(" ")} {...resto}>
      {children}
    </div>
  );
}
