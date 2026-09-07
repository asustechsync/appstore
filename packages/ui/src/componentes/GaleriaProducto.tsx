"use client";

import { useState, type ReactNode } from "react";

import "./primitivos.css";

export interface PropsGaleriaProducto {
  /** Imagenes ya resueltas. La primera es la portada. */
  imagenes: string[];
  /** Texto alternativo base (normalmente el nombre del producto). */
  alt: string;
  /** Distintivo opcional en una esquina de la imagen (ej. una insignia de oferta). */
  distintivo?: ReactNode;
}

/**
 * Galeria de la ficha: tira de miniaturas (vertical en escritorio, horizontal
 * en movil), imagen grande con flechas y puntos de posicion.
 *
 * Es una isla cliente porque la seleccion es estado local; el resto de la ficha
 * se sirve como HTML estatico (Clase A) y se hidrata aparte. FIRST MOBILE: el
 * cambio a tira vertical lo hace primitivos.css por quiebre, aqui no hay medidas.
 */
export function GaleriaProducto({ imagenes, alt, distintivo }: PropsGaleriaProducto) {
  const fuentes = imagenes.filter(Boolean);
  const [activa, setActiva] = useState(0);

  if (fuentes.length === 0) {
    return (
      <div className="ui-galeria ui-galeria--sola">
        <div className="ui-galeria__principal ui-galeria__sin-imagen" aria-hidden="true">
          Sin imagen
        </div>
      </div>
    );
  }

  const total = fuentes.length;
  const indice = ((activa % total) + total) % total;
  const ir = (delta: number) => setActiva((n) => (((n + delta) % total) + total) % total);

  return (
    <div className={total > 1 ? "ui-galeria" : "ui-galeria ui-galeria--sola"}>
      {total > 1 ? (
        <ul className="ui-galeria__miniaturas">
          {fuentes.map((fuente, i) => (
            <li key={fuente}>
              <button
                type="button"
                className="ui-galeria__miniatura"
                aria-label={`Ver imagen ${i + 1}`}
                aria-current={i === indice ? "true" : undefined}
                onClick={() => setActiva(i)}
              >
                <img src={fuente} alt="" width={120} height={120} loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="ui-galeria__escenario">
        {distintivo ? <div className="ui-galeria__distintivo">{distintivo}</div> : null}

        <div className="ui-galeria__principal">
          <img
            src={fuentes[indice]}
            alt={total > 1 ? `${alt} — imagen ${indice + 1} de ${total}` : alt}
            width={800}
            height={800}
            decoding="async"
            fetchPriority="high"
          />
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              className="ui-galeria__flecha ui-galeria__flecha--prev"
              aria-label="Imagen anterior"
              onClick={() => ir(-1)}
            >
              <Chevron sentido="izquierda" />
            </button>
            <button
              type="button"
              className="ui-galeria__flecha ui-galeria__flecha--next"
              aria-label="Imagen siguiente"
              onClick={() => ir(1)}
            >
              <Chevron sentido="derecha" />
            </button>

            <div className="ui-galeria__puntos" role="tablist" aria-label="Posicion en la galeria">
              {fuentes.map((fuente, i) => (
                <button
                  key={fuente}
                  type="button"
                  role="tab"
                  aria-selected={i === indice}
                  aria-label={`Imagen ${i + 1}`}
                  className="ui-galeria__punto"
                  onClick={() => setActiva(i)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function Chevron({ sentido }: { sentido: "izquierda" | "derecha" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {sentido === "izquierda" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}
