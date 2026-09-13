"use client";

import { useEffect, useState } from "react";

import type { EnlaceNav } from "./Cabecera";

import "./primitivos.css";

interface PropsMenuMovil {
  marca: string;
  marcaHref: string;
  enlaces: EnlaceNav[];
}

/**
 * Disparador de categorias + cajon lateral. En movil conserva solo el icono;
 * en escritorio muestra tambien su etiqueta. El cajon se monta al abrirse.
 */
export function MenuMovil({ marca, marcaHref, enlaces }: PropsMenuMovil) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;

    function alTeclado(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAbierto(false);
    }

    document.addEventListener("keydown", alTeclado);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", alTeclado);
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <>
      <button
        type="button"
        className="ui-menu-movil__disparador"
        aria-label="Abrir categorías"
        aria-expanded={abierto}
        onClick={() => setAbierto(true)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
        <span className="ui-menu-movil__disparador-etiqueta">Categorías</span>
      </button>

      {abierto ? (
        <div className="ui-menu-movil" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="ui-menu-movil__fondo" onClick={() => setAbierto(false)} />

          <div className="ui-menu-movil__panel">
            <div className="ui-menu-movil__barra">
              <a className="ui-cabecera__marca" href={marcaHref} onClick={() => setAbierto(false)}>
                {marca}
              </a>
              <button
                type="button"
                className="ui-boton-icono"
                aria-label="Cerrar menu"
                onClick={() => setAbierto(false)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="ui-menu-movil__nav" aria-label="Principal">
              {enlaces.map((enlace) => (
                <a
                  key={enlace.href}
                  className="ui-menu-movil__enlace"
                  href={enlace.href}
                  onClick={() => setAbierto(false)}
                >
                  {enlace.etiqueta}
                </a>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
