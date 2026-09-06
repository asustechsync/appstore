import { useId, type InputHTMLAttributes } from "react";

import "./primitivos.css";

export interface PropsCampo extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta: string;
  ayuda?: string;
  error?: string;
}

export function Campo({ etiqueta, ayuda, error, id, className, ...resto }: PropsCampo) {
  const generado = useId();
  const idCampo = id ?? generado;
  const idAyuda = ayuda ? `${idCampo}-ayuda` : undefined;
  const idError = error ? `${idCampo}-error` : undefined;

  return (
    <div className={["ui-campo", error ? "ui-campo--error" : "", className ?? ""].filter(Boolean).join(" ")}>
      <label className="ui-campo__etiqueta" htmlFor={idCampo}>
        {etiqueta}
      </label>

      <input
        id={idCampo}
        className="ui-campo__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={[idError, idAyuda].filter(Boolean).join(" ") || undefined}
        {...resto}
      />

      {ayuda && !error ? (
        <span id={idAyuda} className="ui-campo__ayuda">
          {ayuda}
        </span>
      ) : null}

      {error ? (
        <span id={idError} className="ui-campo__error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
