"use client";

import { useEffect, useState } from "react";

import { TEMA_LLAVE, type Tema } from "../tema";

import "./primitivos.css";

function temaVigente(): Tema {
  const explicito = document.documentElement.dataset.tema;
  if (explicito === "claro" || explicito === "oscuro") return explicito;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro";
}

/**
 * Boton para alternar entre modo claro y oscuro. Parte del tema que se ve
 * ahora mismo (respetando la preferencia del sistema si no hay eleccion) y al
 * pulsar fija la contraria en <html> y en localStorage.
 */
export function AlternarTema() {
  // `null` hasta montar: el servidor y el primer render del cliente coinciden
  // (icono vacio) y no hay aviso de hidratacion.
  const [tema, setTema] = useState<Tema | null>(null);

  useEffect(() => {
    setTema(temaVigente());
  }, []);

  function alternar() {
    const siguiente: Tema = tema === "oscuro" ? "claro" : "oscuro";
    document.documentElement.dataset.tema = siguiente;
    try {
      localStorage.setItem(TEMA_LLAVE, siguiente);
    } catch {
      /* almacenamiento no disponible: el cambio dura lo que dure la pestana */
    }
    setTema(siguiente);
  }

  const esOscuro = tema === "oscuro";

  return (
    <button
      type="button"
      className="ui-boton-icono"
      onClick={alternar}
      aria-label={esOscuro ? "Activar modo claro" : "Activar modo oscuro"}
      title={esOscuro ? "Modo claro" : "Modo oscuro"}
    >
      <span className="ui-boton-icono__glifo" aria-hidden="true">
        {tema === null ? null : esOscuro ? <IconoSol /> : <IconoLuna />}
      </span>
    </button>
  );
}

function IconoSol() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconoLuna() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
