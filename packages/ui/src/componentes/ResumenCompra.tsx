"use client";

import { useState, type ReactNode } from "react";

import { Boton } from "./Boton";
import { Insignia } from "./Insignia";

import "./primitivos.css";

const FORMATO = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export interface PropsResumenCompra {
  unidades: number;
  subtotal: number;
  /** Descuento por ofertas y promociones. */
  descuento: number;
  descuentoCupon: number;
  /** `null` mientras no haya direccion: se muestra "Se calcula al finalizar". */
  costoEnvio: number | null;
  total: number;

  /** Cupon en uso. Si hay uno, se ofrece quitarlo en lugar del formulario. */
  cupon?: string | null;
  cuponAplicado?: boolean;
  /** Motivo del rechazo, ya redactado por `calcularTotales`. */
  mensajeCupon?: string | null;
  onAplicarCupon?: (codigo: string) => void;
  onQuitarCupon?: () => void;

  /** Cuanto falta para el envio gratis. `null` si ya lo tiene o no aplica. */
  faltaEnvioGratis?: number | null;

  /** Destino del boton principal. */
  hrefContinuar?: string;
  textoContinuar?: string;
  /** Impide continuar (ej. lineas sin stock) y explica por que. */
  bloqueo?: string | null;

  /** Nota al pie: medios de pago, devoluciones. */
  pie?: ReactNode;
}

/**
 * Resumen de la compra. Lo comparten el carrito y el checkout.
 *
 * No calcula: todas las cifras llegan de `calcularTotales` de @appstore/core,
 * la misma funcion que cierra el pedido.
 */
export function ResumenCompra({
  unidades,
  subtotal,
  descuento,
  descuentoCupon,
  costoEnvio,
  total,
  cupon,
  cuponAplicado = false,
  mensajeCupon,
  onAplicarCupon,
  onQuitarCupon,
  faltaEnvioGratis,
  hrefContinuar = "/checkout",
  textoContinuar = "Continuar compra",
  bloqueo,
  pie,
}: PropsResumenCompra) {
  const [codigo, setCodigo] = useState("");

  function aplicar(evento: React.FormEvent) {
    evento.preventDefault();
    const limpio = codigo.trim().toUpperCase();
    if (limpio.length > 0) onAplicarCupon?.(limpio);
  }

  return (
    <aside className="ui-resumen" aria-label="Resumen de la compra">
      <h2 className="ui-resumen__titulo">Resumen</h2>

      {typeof faltaEnvioGratis === "number" && faltaEnvioGratis > 0 ? (
        <p className="ui-resumen__envio-gratis">
          Te faltan <strong>{FORMATO.format(faltaEnvioGratis)}</strong> para el envío gratis.
        </p>
      ) : null}

      <dl className="ui-resumen__cifras">
        <Cifra termino={`Subtotal (${unidades} ${unidades === 1 ? "unidad" : "unidades"})`} valor={subtotal} />
        {descuento > 0 ? <Cifra termino="Descuentos" valor={-descuento} tono="ahorro" /> : null}
        {descuentoCupon > 0 ? (
          <Cifra termino={cupon ? `Cupón ${cupon}` : "Cupón"} valor={-descuentoCupon} tono="ahorro" />
        ) : null}
        <div className="ui-resumen__cifra">
          <dt>Envío</dt>
          <dd>
            {costoEnvio === null ? (
              <span className="ui-resumen__pendiente">Se calcula al finalizar</span>
            ) : costoEnvio === 0 ? (
              <Insignia tono="exito">Gratis</Insignia>
            ) : (
              FORMATO.format(costoEnvio)
            )}
          </dd>
        </div>
      </dl>

      <div className="ui-resumen__total">
        <span>Total</span>
        <strong>{FORMATO.format(total)}</strong>
      </div>
      <p className="ui-resumen__igv">IGV incluido</p>

      {onAplicarCupon ? (
        cuponAplicado && cupon ? (
          <div className="ui-resumen__cupon-activo">
            <Insignia tono="exito">{cupon}</Insignia>
            <button type="button" className="ui-resumen__quitar-cupon" onClick={onQuitarCupon}>
              Quitar
            </button>
          </div>
        ) : (
          <form className="ui-resumen__cupon" onSubmit={aplicar}>
            <input
              className="ui-resumen__cupon-control"
              type="text"
              name="cupon"
              value={codigo}
              placeholder="Código de cupón"
              aria-label="Código de cupón"
              autoComplete="off"
              onChange={(evento) => setCodigo(evento.target.value)}
            />
            <Boton variante="contorno" tamano="sm" type="submit" disabled={codigo.trim().length === 0}>
              Aplicar
            </Boton>
          </form>
        )
      ) : null}

      {mensajeCupon ? (
        <p className="ui-resumen__aviso" role="alert">
          {mensajeCupon}
        </p>
      ) : null}

      {bloqueo ? (
        <Boton variante="solido" tamano="lg" ancho disabled>
          {textoContinuar}
        </Boton>
      ) : (
        <Boton variante="solido" tamano="lg" ancho href={hrefContinuar}>
          {textoContinuar}
        </Boton>
      )}

      {bloqueo ? (
        <p className="ui-resumen__aviso" role="alert">
          {bloqueo}
        </p>
      ) : null}

      {pie ? <div className="ui-resumen__pie">{pie}</div> : null}
    </aside>
  );
}

function Cifra({ termino, valor, tono }: { termino: string; valor: number; tono?: "ahorro" }) {
  return (
    <div className={["ui-resumen__cifra", tono === "ahorro" ? "ui-resumen__cifra--ahorro" : ""].filter(Boolean).join(" ")}>
      <dt>{termino}</dt>
      <dd>{FORMATO.format(valor)}</dd>
    </div>
  );
}
