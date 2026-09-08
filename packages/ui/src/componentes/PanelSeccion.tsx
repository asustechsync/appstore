import type { ReactNode } from "react";

import "./primitivos.css";

export interface PropsPanelSeccion {
  /** Titulo del bloque, ej. "Productos destacados". */
  titulo: string;
  /** Enlace opcional a la derecha del titulo ("Ver todo"). */
  accion?: ReactNode;
  /** `libre` deja el contenido sobre el fondo de pagina, sin panel envolvente. */
  variante?: "superficie" | "libre";
  children: ReactNode;
}

/**
 * Bloque de la portada: una superficie con cabecera de titulo y su contenido
 * debajo. Es lo que da el ritmo de la pagina — cada seccion se lee como una
 * tarjeta independiente sobre el fondo.
 */
export function PanelSeccion({
  titulo,
  accion,
  variante = "superficie",
  children,
}: PropsPanelSeccion) {
  return (
    <section
      className={[
        "ui-panel-seccion",
        variante === "libre" ? "ui-panel-seccion--libre" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="ui-panel-seccion__cabecera">
        <h2 className="ui-panel-seccion__titulo">{titulo}</h2>
        {accion ? <div className="ui-panel-seccion__accion">{accion}</div> : null}
      </header>
      <div className="ui-panel-seccion__cuerpo">{children}</div>
    </section>
  );
}
