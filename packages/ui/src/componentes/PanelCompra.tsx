"use client";

import { useState } from "react";

import { Boton } from "./Boton";

import "./primitivos.css";

export interface OpcionCompra {
  /** Valor visible, ej. "M". */
  valor: string;
  /** Unidades disponibles para vender de esa opcion. */
  stock: number;
}

export interface PropsPanelCompra {
  /** Opciones seleccionables (hoy: tallas). */
  opciones: OpcionCompra[];
  /** Nombre de la dimension, ej. "Talla". */
  nombreOpcion?: string;
  /** El producto en conjunto tiene stock. */
  disponible: boolean;
  /** Stock total del producto, para el texto "N unidades disponibles". */
  stockTotal?: number;
  /** Umbral bajo el cual se avisa "quedan pocas". */
  umbralStockBajo?: number;
}

function textoUnidades(n: number): string {
  if (n <= 0) return "Sin unidades";
  if (n > 10) return "10+ unidades disponibles";
  return `${n} ${n === 1 ? "unidad disponible" : "unidades disponibles"}`;
}

/**
 * Bloque interactivo de la ficha: elegir talla, cantidad y agregar al carrito.
 *
 * Isla cliente (lo unico dinamico de una ficha Clase A). El boton de carrito
 * queda listo visualmente; se conecta al carrito (Zustand) en F3, igual que el
 * de la tarjeta del catalogo.
 */
export function PanelCompra({
  opciones,
  nombreOpcion = "Opcion",
  disponible,
  stockTotal,
  umbralStockBajo = 5,
}: PropsPanelCompra) {
  const unica = opciones.length === 1 ? opciones[0] : null;
  const [seleccion, setSeleccion] = useState<string | null>(
    unica && unica.stock > 0 ? unica.valor : null,
  );
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const elegida = opciones.find((o) => o.valor === seleccion) ?? null;
  const topeCantidad = Math.max(1, Math.min(elegida?.stock ?? 10, 10));
  const cantidadValida = Math.min(cantidad, topeCantidad);
  const unidades = elegida ? elegida.stock : (stockTotal ?? 0);

  function elegir(valor: string) {
    setSeleccion(valor);
    setCantidad(1);
    setAgregado(false);
  }

  function agregar() {
    if (!elegida || elegida.stock === 0) return;
    // F3: enviar { ...variante, cantidad } al carrito.
    setAgregado(true);
  }

  return (
    <div className="ui-panel-compra">
      {opciones.length > 0 ? (
        <fieldset className="ui-panel-compra__opciones">
          <legend className="ui-panel-compra__titulo">
            {nombreOpcion}
            {seleccion ? <span className="ui-panel-compra__elegida">{seleccion}</span> : null}
          </legend>
          <div className="ui-panel-compra__chips">
            {opciones.map((opcion) => {
              const agotada = opcion.stock === 0;
              return (
                <button
                  key={opcion.valor}
                  type="button"
                  className="ui-panel-compra__chip"
                  aria-pressed={seleccion === opcion.valor}
                  disabled={agotada}
                  title={agotada ? `${opcion.valor} — agotada` : undefined}
                  onClick={() => elegir(opcion.valor)}
                >
                  {opcion.valor}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="ui-panel-compra__fila">
        <div className="ui-panel-compra__cantidad" role="group" aria-label="Cantidad">
          <button
            type="button"
            className="ui-panel-compra__paso"
            aria-label="Quitar una unidad"
            disabled={cantidadValida <= 1}
            onClick={() => setCantidad((n) => Math.max(1, n - 1))}
          >
            −
          </button>
          <span className="ui-panel-compra__numero" aria-live="polite">
            {cantidadValida}
          </span>
          <button
            type="button"
            className="ui-panel-compra__paso"
            aria-label="Agregar una unidad"
            disabled={cantidadValida >= topeCantidad}
            onClick={() => setCantidad((n) => Math.min(topeCantidad, n + 1))}
          >
            +
          </button>
        </div>

        <span className="ui-panel-compra__unidades">
          {disponible ? textoUnidades(unidades) : "Sin stock por ahora"}
        </span>
      </div>

      <Boton
        variante="solido"
        ancho
        disabled={!disponible || !elegida || elegida.stock === 0}
        onClick={agregar}
      >
        {agregado ? "Agregado ✓" : "Agregar al carrito"}
      </Boton>

      {disponible && !elegida ? (
        <p className="ui-panel-compra__aviso">Elige tu {nombreOpcion.toLowerCase()} para continuar</p>
      ) : elegida && elegida.stock > 0 && elegida.stock <= umbralStockBajo ? (
        <p className="ui-panel-compra__aviso ui-panel-compra__aviso--bajo">
          Ultimas {elegida.stock} unidades en {elegida.valor}
        </p>
      ) : null}
    </div>
  );
}
