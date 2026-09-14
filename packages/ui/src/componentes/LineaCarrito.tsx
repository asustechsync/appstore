import { Precio } from "./Precio";
import { SelectorCantidad } from "./SelectorCantidad";

import "./primitivos.css";

export interface PropsLineaCarrito {
  nombre: string;
  /** Ruta a la ficha del producto. */
  enlace: string;
  imagenUrl?: string | null;
  /** Descripcion de la variante, ej. "Talla M · Negro". */
  variante?: string | null;
  sku?: string | null;

  /** Precio unitario ya con promociones aplicadas. */
  precioUnit: number;
  /** Precio de lista tachado, si la linea esta en oferta. */
  precioLista?: number | null;
  /** Total de la linea (precio unitario x cantidad). */
  total: number;

  cantidad: number;
  /** Maximo seleccionable: lo menor entre el tope por linea y el stock. */
  maximo: number;
  /** Aviso de stock ya redactado, ej. "Solo quedan 2 unidades". */
  aviso?: string | null;
  /** La variante se quedo sin stock: la linea se apaga y bloquea el checkout. */
  agotada?: boolean;

  onCantidad: (cantidad: number) => void;
  onQuitar: () => void;
}

/**
 * Una linea del carrito: imagen, identidad del producto, cantidad y total.
 *
 * No calcula nada. Los precios y los avisos llegan ya resueltos por
 * `calcularTotales` de @appstore/core.
 */
export function LineaCarrito({
  nombre,
  enlace,
  imagenUrl,
  variante,
  sku,
  precioUnit,
  precioLista,
  total,
  cantidad,
  maximo,
  aviso,
  agotada = false,
  onCantidad,
  onQuitar,
}: PropsLineaCarrito) {
  return (
    <li className={["ui-linea-carrito", agotada ? "ui-linea-carrito--agotada" : ""].filter(Boolean).join(" ")}>
      <a className="ui-linea-carrito__figura" href={enlace} tabIndex={-1} aria-hidden="true">
        {imagenUrl ? (
          <img src={imagenUrl} alt="" width={96} height={96} loading="lazy" decoding="async" />
        ) : (
          <span className="ui-linea-carrito__sin-imagen" />
        )}
      </a>

      <div className="ui-linea-carrito__datos">
        <a className="ui-linea-carrito__nombre" href={enlace}>
          {nombre}
        </a>
        {variante ? <p className="ui-linea-carrito__variante">{variante}</p> : null}
        {sku ? <p className="ui-linea-carrito__sku">SKU: {sku}</p> : null}
        <div className="ui-linea-carrito__unitario">
          <Precio valor={precioUnit} antes={precioLista} tamano="sm" />
          <span className="ui-linea-carrito__por-unidad">c/u</span>
        </div>
      </div>

      <div className="ui-linea-carrito__controles">
        <SelectorCantidad
          valor={cantidad}
          maximo={Math.max(1, maximo)}
          tamano="sm"
          etiqueta={nombre}
          onCambio={onCantidad}
        />
        <button
          type="button"
          className="ui-linea-carrito__quitar"
          onClick={onQuitar}
          aria-label={`Quitar ${nombre} del carrito`}
        >
          Quitar
        </button>
      </div>

      <div className="ui-linea-carrito__total">
        <Precio valor={total} tamano="md" />
      </div>

      {aviso ? (
        <p className="ui-linea-carrito__aviso" role="status">
          {aviso}
        </p>
      ) : null}
    </li>
  );
}
