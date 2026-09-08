import type { CSSProperties } from "react";

import "./primitivos.css";

export interface PropsEstrellas {
  /** Calificacion de 0 a 5. Se pinta con relleno parcial, sin redondear. */
  valor: number;
  /** Numero de resenas. Si viene, se muestra entre parentesis. */
  total?: number | null;
  tamano?: "sm" | "md";
}

/**
 * Valoracion en estrellas. Dos capas superpuestas: las cinco vacias y las
 * cinco llenas recortadas al porcentaje. Sin JS y sin medias imagenes.
 */
export function Estrellas({ valor, total, tamano = "sm" }: PropsEstrellas) {
  const acotado = Math.min(5, Math.max(0, valor));
  const relleno = (acotado / 5) * 100;
  const etiqueta =
    total && total > 0
      ? `${acotado.toFixed(1)} de 5 segun ${total} resenas`
      : `${acotado.toFixed(1)} de 5`;

  return (
    <span className={`ui-estrellas ui-estrellas--${tamano}`}>
      <span
        className="ui-estrellas__marco"
        role="img"
        aria-label={etiqueta}
        style={{ "--relleno": `${relleno}%` } as CSSProperties}
      >
        <span className="ui-estrellas__capa ui-estrellas__capa--vacia" aria-hidden="true">
          <Cinco />
        </span>
        <span className="ui-estrellas__capa ui-estrellas__capa--llena" aria-hidden="true">
          <Cinco />
        </span>
      </span>
      {total && total > 0 ? <span className="ui-estrellas__total">({total})</span> : null}
    </span>
  );
}

function Cinco() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="m10 1.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
        </svg>
      ))}
    </>
  );
}
