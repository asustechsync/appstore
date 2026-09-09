"use client";

import { useEffect, useState } from "react";

import "./primitivos.css";

interface PropsCuentaRegresivaOferta {
  finalizaEn: string;
}

interface TiempoRestante {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

function calcularTiempoRestante(finalizaEn: string): TiempoRestante {
  const milisegundos = Math.max(0, new Date(finalizaEn).getTime() - Date.now());
  const totalSegundos = Math.floor(milisegundos / 1000);

  return {
    dias: Math.floor(totalSegundos / 86_400),
    horas: Math.floor((totalSegundos % 86_400) / 3_600),
    minutos: Math.floor((totalSegundos % 3_600) / 60),
    segundos: totalSegundos % 60,
  };
}

/** Contador pequeño, aislado del HTML estático de la portada. */
export function CuentaRegresivaOferta({ finalizaEn }: PropsCuentaRegresivaOferta) {
  const [restante, setRestante] = useState<TiempoRestante | null>(null);

  useEffect(() => {
    function actualizar() {
      setRestante(calcularTiempoRestante(finalizaEn));
    }

    actualizar();
    const intervalo = window.setInterval(actualizar, 1_000);
    return () => window.clearInterval(intervalo);
  }, [finalizaEn]);

  const bloques = [
    [restante?.dias, "Días"],
    [restante?.horas, "Hrs"],
    [restante?.minutos, "Min"],
    [restante?.segundos, "Seg"],
  ] as const;

  return (
    <div className="ui-oferta-flash__contador" aria-label="Tiempo restante de la oferta">
      {bloques.map(([valor, etiqueta]) => (
        <span key={etiqueta}>
          <strong>{valor === undefined ? "--" : String(valor).padStart(2, "0")}</strong>
          <small>{etiqueta}</small>
        </span>
      ))}
    </div>
  );
}
