import "./primitivos.css";

export interface PropsSelectorCantidad {
  valor: number;
  /** Maximo seleccionable: lo menor entre el tope por linea y el stock. */
  maximo: number;
  minimo?: number;
  tamano?: "sm" | "md";
  /** Nombre de lo que se cuenta, para los lectores de pantalla. */
  etiqueta?: string;
  onCambio: (cantidad: number) => void;
}

/**
 * Contador de unidades. Controlado: quien lo usa decide el valor y recibe el
 * nuevo. Lo comparten el panel de compra de la ficha y las lineas del carrito.
 */
export function SelectorCantidad({
  valor,
  maximo,
  minimo = 1,
  tamano = "md",
  etiqueta = "unidades",
  onCambio,
}: PropsSelectorCantidad) {
  const acotado = Math.max(minimo, Math.min(valor, maximo));

  return (
    <div
      className={`ui-cantidad ui-cantidad--${tamano}`}
      role="group"
      aria-label={`Cantidad de ${etiqueta}`}
    >
      <button
        type="button"
        className="ui-cantidad__paso"
        aria-label={`Quitar una unidad de ${etiqueta}`}
        disabled={acotado <= minimo}
        onClick={() => onCambio(acotado - 1)}
      >
        −
      </button>
      <span className="ui-cantidad__numero" aria-live="polite">
        {acotado}
      </span>
      <button
        type="button"
        className="ui-cantidad__paso"
        aria-label={`Agregar una unidad de ${etiqueta}`}
        disabled={acotado >= maximo}
        onClick={() => onCambio(acotado + 1)}
      >
        +
      </button>
    </div>
  );
}
