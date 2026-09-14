import type { ReactNode } from "react";

import "./primitivos.css";

export interface PropsListaCarrito {
  /** Las `LineaCarrito` del carrito. */
  children: ReactNode;
  /** Acciones sobre el carrito completo, ej. vaciarlo. */
  acciones?: ReactNode;
}

/** Contenedor de las lineas del carrito. */
export function ListaCarrito({ children, acciones }: PropsListaCarrito) {
  return (
    <>
      <ul className="ui-lista-carrito">{children}</ul>
      {acciones ? <div className="ui-carrito__acciones">{acciones}</div> : null}
    </>
  );
}

export interface PropsBotonVaciar {
  onClick: () => void;
  children?: ReactNode;
}

/** Accion destructiva discreta: no compite con el boton de continuar. */
export function BotonVaciar({ onClick, children = "Vaciar carrito" }: PropsBotonVaciar) {
  return (
    <button type="button" className="ui-carrito__vaciar" onClick={onClick}>
      {children}
    </button>
  );
}
