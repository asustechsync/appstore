import "./primitivos.css";

export interface PropsBuscador {
  textoBuscar?: string;
}

/** Buscador del catálogo que aparece en la cabecera de la tienda. */
export function Buscador({ textoBuscar = "Buscar productos, marcas y más" }: PropsBuscador) {
  return (
    <form className="ui-cabecera__buscador" action="/buscar" role="search">
      <label className="ui-solo-lectores" htmlFor="busqueda-cabecera">
        Buscar en el catálogo
      </label>
      <input id="busqueda-cabecera" name="q" type="search" placeholder={textoBuscar} />
      <button type="submit" aria-label="Buscar">
        <span className="ui-cabecera__icono ui-cabecera__icono--buscar" aria-hidden="true" />
      </button>
    </form>
  );
}
