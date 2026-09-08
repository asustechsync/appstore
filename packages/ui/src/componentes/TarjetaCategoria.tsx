import "./primitivos.css";

export interface PropsTarjetaCategoria {
  nombre: string;
  /** Ruta al listado, ej. `/categorias/hombre`. */
  enlace: string;
  imagenUrl?: string | null;
  /** Adelanta la carga en las primeras tarjetas visibles. */
  prioridad?: boolean;
}

/**
 * Acceso a una categoria: imagen centrada arriba y el nombre debajo. Cuando
 * la categoria aun no tiene imagen se pinta su inicial, para que la fila no
 * quede con huecos.
 */
export function TarjetaCategoria({
  nombre,
  enlace,
  imagenUrl,
  prioridad = false,
}: PropsTarjetaCategoria) {
  return (
    <a className="ui-tarjeta-categoria" href={enlace}>
      <span className="ui-tarjeta-categoria__figura">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt=""
            width={160}
            height={160}
            loading={prioridad ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <span className="ui-tarjeta-categoria__inicial" aria-hidden="true">
            {nombre.charAt(0)}
          </span>
        )}
      </span>
      <span className="ui-tarjeta-categoria__nombre">{nombre}</span>
    </a>
  );
}
