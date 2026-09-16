"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import "./primitivos.css";

export interface PropsCarruselProductos {
  children: ReactNode;
  /** Nombre accesible de la region (ej. "Productos destacados"). */
  etiqueta?: string;
  /**
   * Cuantos elementos caben por vista. "productos" muestra tarjetas anchas;
   * "categorias" muestra el doble, que son fichas pequenas.
   */
  densidad?: "productos" | "productos-con-banner" | "productos-siete" | "categorias";
}

/**
 * Fila de tarjetas que se recorre en horizontal. En pantalla ancha se ven
 * ~6 a la vez; el resto queda a un lado y se llega con las flechas o
 * arrastrando. En movil se desliza con el dedo (las flechas se ocultan).
 *
 * FIRST MOBILE: el numero de tarjetas visibles sube por quiebres via la
 * variable `--visibles` en primitivos.css; aqui no hay medidas.
 */
export function CarruselProductos({
  children,
  etiqueta = "Productos",
  densidad = "productos",
}: PropsCarruselProductos) {
  const pistaRef = useRef<HTMLDivElement>(null);
  const [alInicio, setAlInicio] = useState(true);
  const [alFinal, setAlFinal] = useState(true);

  const revisarBordes = useCallback(() => {
    const pista = pistaRef.current;
    if (!pista) return;
    const margen = 2; // holgura para redondeos de subpixel
    setAlInicio(pista.scrollLeft <= margen);
    setAlFinal(pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - margen);
  }, []);

  useEffect(() => {
    const pista = pistaRef.current;
    if (!pista) return;

    revisarBordes();
    pista.addEventListener("scroll", revisarBordes, { passive: true });

    const observador = new ResizeObserver(revisarBordes);
    observador.observe(pista);

    return () => {
      pista.removeEventListener("scroll", revisarBordes);
      observador.disconnect();
    };
  }, [revisarBordes]);

  function desplazar(sentido: 1 | -1) {
    const pista = pistaRef.current;
    if (!pista) return;
    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Casi un ancho visible: avanza "de pagina" sin perder el hilo.
    pista.scrollBy({
      left: sentido * pista.clientWidth * 0.9,
      behavior: suave ? "smooth" : "auto",
    });
  }

  return (
    <div
      className={`ui-carrusel-productos ui-carrusel-productos--${densidad}`}
      role="region"
      aria-roledescription="carrusel"
      aria-label={etiqueta}
    >
      <div className="ui-carrusel-productos__pista" ref={pistaRef}>
        {children}
      </div>

      <button
        type="button"
        className="ui-carrusel-productos__flecha ui-carrusel-productos__flecha--prev"
        aria-label="Ver anteriores"
        onClick={() => desplazar(-1)}
        disabled={alInicio}
      >
        <Chevron sentido="izquierda" />
      </button>

      <button
        type="button"
        className="ui-carrusel-productos__flecha ui-carrusel-productos__flecha--next"
        aria-label="Ver siguientes"
        onClick={() => desplazar(1)}
        disabled={alFinal}
      >
        <Chevron sentido="derecha" />
      </button>
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
