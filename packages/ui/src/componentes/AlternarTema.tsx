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
      <span className={`ui-boton-icono__glifo ui-boton-icono__glifo--${esOscuro ? "sun" : "moon"}`} aria-hidden="true" />
    </button>
  );
}
