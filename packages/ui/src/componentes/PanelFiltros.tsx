import "./primitivos.css";

export interface OpcionFiltro {
  etiqueta: string;
  /** Cuantos productos tienen esta opcion. Si falta, no se pinta el numero. */
  total?: number | null;
  activa: boolean;
  /** URL que marca o desmarca la opcion. El panel no calcula rutas. */
  href: string;
  /** Muestra del color, cuando el grupo es cromatico. */
  colorHex?: string | null;
}

export interface GrupoFiltros {
  clave: string;
  titulo: string;
  opciones: OpcionFiltro[];
}

export interface PropsPanelFiltros {
  grupos: GrupoFiltros[];
  /** Enlace que devuelve el listado sin filtros. */
  limpiarHref: string;
  hayFiltrosActivos?: boolean;
}

/**
 * Panel lateral de filtros del catalogo.
 *
 * Cada opcion es un enlace, no una casilla con JavaScript: el listado sigue
 * siendo Clase A y cada combinacion de filtros es una URL propia, cacheable y
 * compartible. `aria-pressed` comunica el estado a los lectores de pantalla.
 *
 * En movil el panel se pliega dentro de un `<details>` para no empujar la
 * rejilla fuera de la primera pantalla.
 */
export function PanelFiltros({ grupos, limpiarHref, hayFiltrosActivos = false }: PropsPanelFiltros) {
  const conOpciones = grupos.filter((grupo) => grupo.opciones.length > 0);

  if (conOpciones.length === 0) return null;

  return (
    <details className="ui-filtros">
      <summary className="ui-filtros__resumen">
        <span className="ui-filtros__resumen-texto">Filtros</span>
        <span className="ui-filtros__resumen-flecha" aria-hidden="true" />
      </summary>

      <div className="ui-filtros__cuerpo">
        {hayFiltrosActivos ? (
          <a className="ui-filtros__limpiar" href={limpiarHref}>
            Quitar filtros
          </a>
        ) : null}

        {conOpciones.map((grupo) => (
          <section className="ui-filtros__grupo" key={grupo.clave}>
            <h3 className="ui-filtros__titulo">{grupo.titulo}</h3>
            <ul className="ui-filtros__opciones">
              {grupo.opciones.map((opcion) => (
                <li key={`${grupo.clave}-${opcion.etiqueta}`}>
                  <a
                    className={[
                      "ui-filtros__opcion",
                      opcion.activa ? "ui-filtros__opcion--activa" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    href={opcion.href}
                    aria-pressed={opcion.activa}
                  >
                    <span className="ui-filtros__marca" aria-hidden="true" />
                    {opcion.colorHex ? (
                      <span
                        className="ui-filtros__muestra"
                        style={{ background: opcion.colorHex }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="ui-filtros__etiqueta">{opcion.etiqueta}</span>
                    {typeof opcion.total === "number" ? (
                      <span className="ui-filtros__total">{opcion.total}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </details>
  );
}
