import type { ReactNode } from "react";

import "./primitivos.css";

type Tono = "neutro" | "marca" | "oferta" | "exito" | "alerta" | "error";

export interface PropsInsignia {
  tono?: Tono;
  children: ReactNode;
}

export function Insignia({ tono = "neutro", children }: PropsInsignia) {
  return <span className={`ui-insignia ui-insignia--${tono}`}>{children}</span>;
}
