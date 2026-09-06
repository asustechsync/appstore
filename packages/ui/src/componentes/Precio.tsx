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
  /** `inverso` para pintarlo sobre un fondo oscuro. */
  tono?: "normal" | "inverso";
}

export function Precio({ valor, antes, tamano = "md", tono = "normal" }: PropsPrecio) {
  const hayOferta = typeof antes === "number" && antes > valor;

  return (
    <span
      className={[
        "ui-precio",
        `ui-precio--${tamano}`,
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
    </span>
  );
}
