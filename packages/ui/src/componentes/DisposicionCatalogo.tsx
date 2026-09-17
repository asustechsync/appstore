import type { ReactNode } from "react";

import "./primitivos.css";

export interface PropsDisposicionCatalogo {
  /** Columna estrecha de la izquierda: el panel de filtros. */
  lateral?: ReactNode;
  /** Columna ancha: la rejilla y su paginacion. */
  children: ReactNode;
}

/**
 * Disposicion de un listado con filtros: panel a la izquierda y rejilla a la
 * derecha. FIRST MOBILE — en movil es una sola columna con los filtros arriba,
 * plegados; desde tablet el panel pasa al lateral y se queda pegajoso.
 */
export function DisposicionCatalogo({ lateral, children }: PropsDisposicionCatalogo) {
  if (!lateral) return <>{children}</>;

  return (
    <div className="ui-catalogo-cols">
      <aside className="ui-catalogo-cols__lateral">{lateral}</aside>
      <div className="ui-catalogo-cols__principal">{children}</div>
    </div>
  );
}
