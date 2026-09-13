"use client";

import { useEffect, useRef, useState } from "react";

import "./primitivos.css";

export interface OpcionSelector {
  valor: string;
  etiqueta: string;
}

export interface PropsSelector {
  valor: string;
  opciones: OpcionSelector[];
  marcador: string;
  deshabilitado?: boolean;
  alCambiar: (valor: string) => void;
}

/** Selector desplegable con la apariencia del sistema visual. */
export function Selector({ valor, opciones, marcador, deshabilitado = false, alCambiar }: PropsSelector) {
  const contenedor = useRef<HTMLDivElement>(null);
  const referenciasOpciones = useRef(new Map<string, HTMLButtonElement>());
  const [abierto, setAbierto] = useState(false);
  const seleccionada = opciones.find((opcion) => opcion.valor === valor);

  function normalizar(texto: string): string {
    return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleUpperCase("es-PE");
  }

  function enfocarPorInicial(inicial: string) {
    const inicialNormalizada = normalizar(inicial);
    const indiceActual = opciones.findIndex((opcion) => opcion.valor === valor);
    const ordenadas = [...opciones.slice(indiceActual + 1), ...opciones.slice(0, indiceActual + 1)];
    const coincidencia = ordenadas.find((opcion) => normalizar(opcion.etiqueta).startsWith(inicialNormalizada));
    if (!coincidencia) return;

    setAbierto(true);
    requestAnimationFrame(() => referenciasOpciones.current.get(coincidencia.valor)?.focus());
  }

  useEffect(() => {
    function cerrarAlClicFuera(evento: MouseEvent) {
      if (evento.target instanceof Node && !contenedor.current?.contains(evento.target)) setAbierto(false);
    }

    document.addEventListener("mousedown", cerrarAlClicFuera);
    return () => document.removeEventListener("mousedown", cerrarAlClicFuera);
  }, []);

  return (
    <div ref={contenedor} className="ui-selector">
      <button
        type="button"
        className="ui-selector__disparador"
        onClick={() => setAbierto((valorActual) => !valorActual)}
        onKeyDown={(evento) => {
          if (evento.key.length !== 1 || evento.ctrlKey || evento.metaKey || evento.altKey) return;
          evento.preventDefault();
          enfocarPorInicial(evento.key);
        }}
        disabled={deshabilitado}
        aria-haspopup="listbox"
        aria-expanded={abierto}
      >
        <span className={seleccionada ? "" : "ui-selector__marcador"}>{seleccionada?.etiqueta ?? marcador}</span>
        <svg className="ui-selector__flecha" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {abierto ? (
        <div className="ui-selector__opciones" role="listbox">
          {opciones.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className="ui-selector__opcion"
              role="option"
              aria-selected={opcion.valor === valor}
              ref={(elemento) => {
                if (elemento) referenciasOpciones.current.set(opcion.valor, elemento);
                else referenciasOpciones.current.delete(opcion.valor);
              }}
              onClick={() => {
                alCambiar(opcion.valor);
                setAbierto(false);
              }}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
