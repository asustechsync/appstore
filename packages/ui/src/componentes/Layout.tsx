import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { tokens } from "../tokens";

import "./primitivos.css";

type ClaveEspacio = keyof typeof tokens.espacio;

interface PropsBase extends HTMLAttributes<HTMLDivElement> {
  /** Separacion entre hijos, en pasos de la escala de espaciado. */
  gap?: ClaveEspacio;
  children: ReactNode;
}

/**
 * El layout se hace con gap, nunca con margenes por elemento: los margenes
 * colapsan y se duplican, el gap no.
 */

export function Pila({ gap = 4, style, className, children, ...resto }: PropsBase) {
  return (
    <div
      className={["ui-pila", className ?? ""].filter(Boolean).join(" ")}
      style={{ gap: `${tokens.espacio[gap]}px`, ...style } as CSSProperties}
      {...resto}
    >
      {children}
    </div>
  );
}

export function Fila({ gap = 3, style, className, children, ...resto }: PropsBase) {
  return (
    <div
      className={["ui-fila", className ?? ""].filter(Boolean).join(" ")}
      style={{ gap: `${tokens.espacio[gap]}px`, ...style } as CSSProperties}
      {...resto}
    >
      {children}
    </div>
  );
}

/**
 * Franja vertical de la pagina. Aporta el ritmo vertical estandar para que
 * las paginas no tengan que definir `padding-block`.
 */
export function Seccion({ className, children, ...resto }: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section className={["ui-seccion", className ?? ""].filter(Boolean).join(" ")} {...resto}>
      {children}
    </section>
  );
}

export interface PropsContenedor extends HTMLAttributes<HTMLDivElement> {
  ancho?: "md" | "lg" | "completo";
  children: ReactNode;
}

export function Contenedor({ ancho = "completo", className, children, ...resto }: PropsContenedor) {
  const clases = [
    "ui-contenedor",
    ancho === "md" ? "ui-contenedor--md" : "",
    ancho === "lg" ? "ui-contenedor--lg" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={clases} {...resto}>
      {children}
    </div>
  );
}
