import type { MigaFicha } from "./FichaProducto";

import "./primitivos.css";

export interface PropsCabeceraCatalogo {
  /** Titulo del listado, ej. "Hombre". */
  titulo: string;
  /** Migas de pan: raiz -> categoria. La ultima va sin href. */
  migas?: MigaFicha[];
  descripcion?: string | null;
  /** Numero de productos que cubre el listado completo, no la pagina actual. */
  total?: number | null;
}

/**
 * Cabecera de un listado de catalogo: categoria, marca u ofertas. Da el titulo,
 * la ubicacion y cuantos productos hay antes de que empiece la rejilla.
 */
export function CabeceraCatalogo({
  titulo,
  migas = [],
  descripcion,
  total,
}: PropsCabeceraCatalogo) {
  return (
    <header className="ui-cabecera-catalogo">
      {migas.length > 0 ? (
        <nav className="ui-cabecera-catalogo__migas" aria-label="Ubicacion">
          <ol>
            {migas.map((miga, i) => (
              <li key={`${miga.etiqueta}-${i}`}>
                {miga.href && i < migas.length - 1 ? (
                  <a href={miga.href}>{miga.etiqueta}</a>
                ) : (
                  <span aria-current="page">{miga.etiqueta}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="ui-cabecera-catalogo__fila">
        <h1 className="ui-cabecera-catalogo__titulo">{titulo}</h1>
        {typeof total === "number" ? (
          <p className="ui-cabecera-catalogo__total">
            {total} {total === 1 ? "producto" : "productos"}
          </p>
        ) : null}
      </div>

      {descripcion ? <p className="ui-cabecera-catalogo__detalle">{descripcion}</p> : null}
    </header>
  );
}
