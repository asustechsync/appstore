import type { ReactNode } from "react";

import "./primitivos.css";

export interface PropsAcordeon {
  titulo: string;
  /** Abre la seccion en el primer render. */
  abierto?: boolean;
  children: ReactNode;
}

/**
 * Seccion plegable. Usa `<details>` nativo: el contenido esta SIEMPRE en el
 * HTML (lo indexa el buscador y se sirve en el shell estatico de Clase A),
 * solo cambia si se ve. Sin JavaScript propio.
 */
export function Acordeon({ titulo, abierto = false, children }: PropsAcordeon) {
  return (
    <details className="ui-acordeon" open={abierto || undefined}>
      <summary className="ui-acordeon__cabecera">
        <span className="ui-acordeon__titulo">{titulo}</span>
        <svg
          className="ui-acordeon__chevron"
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
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="ui-acordeon__cuerpo">{children}</div>
    </details>
  );
}
