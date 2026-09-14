import type { ReactNode } from "react";

import "./primitivos.css";

export interface PropsDisposicionCompra {
  titulo: string;
  /** Linea bajo el titulo: "3 productos · 5 unidades". */
  detalle?: ReactNode;
  /** Enlace de escape, normalmente "Seguir comprando". */
  volverHref?: string;
  volverTexto?: string;
  /** Columna ancha: las lineas o los pasos del checkout. */
  children: ReactNode;
  /** Columna estrecha y pegajosa: el resumen. */
  lateral?: ReactNode;
}

/**
 * Disposicion de las pantallas de compra (Clase B): titulo, columna principal
 * y resumen lateral pegajoso. En movil el resumen baja debajo de la lista.
 */
export function DisposicionCompra({
  titulo,
  detalle,
  volverHref,
  volverTexto = "Seguir comprando",
  children,
  lateral,
}: PropsDisposicionCompra) {
  return (
    <div className="ui-compra">
      <header className="ui-compra__encabezado">
        <div>
          <h1 className="ui-compra__titulo">{titulo}</h1>
          {detalle ? <p className="ui-compra__detalle">{detalle}</p> : null}
        </div>
        {volverHref ? (
          <a className="ui-compra__volver" href={volverHref}>
            {volverTexto}
          </a>
        ) : null}
      </header>

      <div className="ui-compra__cols">
        <div className="ui-compra__principal">{children}</div>
        {lateral ? <div className="ui-compra__lateral">{lateral}</div> : null}
      </div>
    </div>
  );
}
