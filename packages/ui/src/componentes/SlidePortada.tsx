"use client";

import { useEffect, useState } from "react";

import "./primitivos.css";

export interface DiapositivaPortada {
  titulo: string;
  texto: string;
  enlace: string;
  imagenUrl?: string | null;
}

export function SlidePortada({ diapositivas }: { diapositivas: DiapositivaPortada[] }) {
  const [indice, setIndice] = useState(0);
  const slides = diapositivas.slice(0, 3);

  useEffect(() => {
    if (slides.length < 2) return;
    const temporizador = window.setInterval(() => {
      setIndice((actual) => (actual + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(temporizador);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="ui-slide-portada" aria-label="Promociones destacadas">
      <div className="ui-slide-portada__pista" style={{ transform: `translateX(-${indice * 100}%)` }}>
        {slides.map((slide, posicion) => (
          <a className="ui-slide-portada__diapositiva" href={slide.enlace} key={`${slide.enlace}-${posicion}`}>
            <span className="ui-slide-portada__contenido">
              <small>SOCKS · BÁSICOS PARA TODOS</small>
              <strong>{slide.titulo}</strong>
              <span>{slide.texto}</span>
            </span>
            <span className="ui-slide-portada__imagen">
              {slide.imagenUrl ? <img src={slide.imagenUrl} alt="" width={900} height={500} /> : <span aria-hidden="true">SOCKS</span>}
            </span>
          </a>
        ))}
      </div>
      <div className="ui-slide-portada__indicadores" aria-label="Seleccionar diapositiva">
        {slides.map((slide, posicion) => (
          <button key={slide.enlace} type="button" aria-label={`Ver diapositiva ${posicion + 1}`} aria-current={posicion === indice} onClick={() => setIndice(posicion)} />
        ))}
      </div>
    </div>
  );
}
