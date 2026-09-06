import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import "./primitivos.css";

type Variante = "solido" | "contorno" | "fantasma" | "peligro" | "inverso";
type Tamano = "sm" | "md" | "lg";

interface PropsComunes {
  variante?: Variante;
  tamano?: Tamano;
  ancho?: boolean;
  children: ReactNode;
}

type PropsEnlace = PropsComunes & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "children"
  >;

type PropsBotonNativo = PropsComunes & { href?: undefined; cargando?: boolean } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children"
  >;

export type PropsBoton = PropsEnlace | PropsBotonNativo;

function clasesDe(variante: Variante, tamano: Tamano, ancho: boolean, extra?: string): string {
  return [
    "ui-boton",
    `ui-boton--${variante}`,
    `ui-boton--${tamano}`,
    ancho ? "ui-boton--ancho" : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function Boton(props: PropsBoton) {
  // Enlace con apariencia de boton (ej. "ir a la ficha" desde una tarjeta).
  if (props.href !== undefined) {
    const { variante = "solido", tamano = "md", ancho = false, className, children, ...resto } = props;
    return (
      <a className={clasesDe(variante, tamano, ancho, className)} {...resto}>
        {children}
      </a>
    );
  }

  const {
    variante = "solido",
    tamano = "md",
    ancho = false,
    cargando = false,
    disabled,
    className,
    children,
    ...resto
  } = props;

  return (
    <button
      className={clasesDe(variante, tamano, ancho, className)}
      disabled={disabled ?? cargando}
      aria-busy={cargando || undefined}
      {...resto}
    >
      {children}
    </button>
  );
}
