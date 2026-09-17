import "./primitivos.css";

export interface PropsPaginacion {
  pagina: number;
  paginas: number;
  /** Construye la URL de cada pagina, ej. `(n) => \`/categorias/hombre?pagina=${n}\``. */
  href: (pagina: number) => string;
}

/**
 * Paginacion del catalogo. Son enlaces, no botones: el listado sigue siendo
 * Clase A y cada pagina se cachea por su propia URL.
 *
 * Cuando hay muchas paginas se muestra una ventana alrededor de la actual para
 * que la fila no crezca sin limite en un movil.
 */
export function Paginacion({ pagina, paginas, href }: PropsPaginacion) {
  if (paginas <= 1) return null;

  const desde = Math.max(1, Math.min(pagina - 2, paginas - 4));
  const hasta = Math.min(paginas, Math.max(pagina + 2, 5));
  const numeros = Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i);

  return (
    <nav className="ui-paginacion" aria-label="Paginacion del catalogo">
      {pagina > 1 ? (
        <a className="ui-paginacion__salto" href={href(pagina - 1)} rel="prev">
          Anterior
        </a>
      ) : (
        <span className="ui-paginacion__salto ui-paginacion__salto--inerte">Anterior</span>
      )}

      <ol className="ui-paginacion__numeros">
        {numeros.map((n) => (
          <li key={n}>
            {n === pagina ? (
              <span className="ui-paginacion__numero ui-paginacion__numero--actual" aria-current="page">
                {n}
              </span>
            ) : (
              <a className="ui-paginacion__numero" href={href(n)}>
                {n}
              </a>
            )}
          </li>
        ))}
      </ol>

      {pagina < paginas ? (
        <a className="ui-paginacion__salto" href={href(pagina + 1)} rel="next">
          Siguiente
        </a>
      ) : (
        <span className="ui-paginacion__salto ui-paginacion__salto--inerte">Siguiente</span>
      )}
    </nav>
  );
}
