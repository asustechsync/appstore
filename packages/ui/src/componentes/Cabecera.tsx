import type { ReactNode } from "react";

import { AlternarTema } from "./AlternarTema";
import { MenuMovil } from "./MenuMovil";

import "./primitivos.css";

export interface EnlaceNav {
  etiqueta: string;
  href: string;
  icono?: "usuario" | "caja" | "favorito" | "carrito";
}

export interface PropsCabecera {
  /** Nombre de marca que se muestra a la izquierda. */
  marca: string;
  /** Destino del logo. Por defecto la portada. */
  marcaHref?: string;
  /** Enlaces de navegacion principal (departamentos, ofertas...). */
  enlaces: EnlaceNav[];
  /** Acciones extra a la derecha (sesion, carrito). El boton de tema ya va. */
  acciones?: ReactNode;
  /** Texto orientativo del buscador del catalogo. */
  textoBuscar?: string;
  /** Mensaje breve de despacho mostrado junto a la navegación. */
  mensajeEnvio?: string;
  /** Enlaces secundarios: cuenta, pedidos, favoritos o carrito. */
  enlacesUtilidad?: EnlaceNav[];
  /** Mensaje promocional de la esquina superior derecha. */
  mensajePromocion?: string;
  /** Destino del mensaje promocional. */
  promocionHref?: string;
}

/**
 * Cabecera de la tienda — parte del shell estatico (Clase A).
 *
 * Es un componente de servidor: los enlaces se pintan en el HTML. Lo unico
 * interactivo son dos islas cliente que se hidratan aparte: el cajon movil
 * (`MenuMovil`) y el interruptor de tema (`AlternarTema`).
 */
export function Cabecera({
  marca,
  marcaHref = "/",
  enlaces,
  acciones,
  textoBuscar = "Buscar productos, marcas y más",
  mensajeEnvio = "Ubicación",
  enlacesUtilidad = [],
  mensajePromocion = "Conoce nuestras ofertas de temporada",
  promocionHref = "/ofertas",
}: PropsCabecera) {
  return (
    <header className="ui-cabecera">
      <div className="ui-cabecera__aviso">
        <div className="ui-contenedor ui-cabecera__aviso-contenido">
          <span className="ui-cabecera__aviso-envio">
            <IconoCamion />
            Envíos a todo el Perú
          </span>
          <a className="ui-cabecera__aviso-promocion" href={promocionHref}>
            <IconoDestello />
            {mensajePromocion}
          </a>
        </div>
      </div>
      <div className="ui-cabecera__contenido ui-contenedor">
        <div className="ui-cabecera__principal">
          <MenuMovil marca={marca} marcaHref={marcaHref} enlaces={enlaces} />

          <a className="ui-cabecera__marca" href={marcaHref}>
            <span className="ui-cabecera__marca-sello" aria-hidden="true">S</span>
            <span>{marca}</span>
          </a>

          <form className="ui-cabecera__buscador" action="/buscar" role="search">
            <label className="ui-solo-lectores" htmlFor="busqueda-cabecera">
              Buscar en el catálogo
            </label>
            <input id="busqueda-cabecera" name="q" type="search" placeholder={textoBuscar} />
            <button type="submit" aria-label="Buscar">
              <span className="ui-cabecera__icono ui-cabecera__icono--buscar" aria-hidden="true" />
            </button>
          </form>

          <div className="ui-cabecera__acciones">
            {acciones}
            <AlternarTema />
          </div>
        </div>

        <div className="ui-cabecera__secundaria">
          <a className="ui-cabecera__envio" href="/ofertas">
            <span className="ui-cabecera__icono ui-cabecera__icono--ubicacion" aria-hidden="true" />
            <span>{mensajeEnvio}</span>
          </a>

          <nav className="ui-cabecera__nav" aria-label="Principal">
            {enlaces.map((enlace) => (
              <a key={enlace.href} className="ui-cabecera__enlace" href={enlace.href}>
                {enlace.etiqueta}
              </a>
            ))}
          </nav>

          <nav className="ui-cabecera__utilidades" aria-label="Acciones de cuenta">
            {enlacesUtilidad.map((enlace) => (
              <a key={enlace.href} className="ui-cabecera__utilidad" href={enlace.href}>
                {enlace.icono ? (
                  <span className={`ui-cabecera__icono ui-cabecera__icono--${enlace.icono}`} aria-hidden="true" />
                ) : null}
                {enlace.etiqueta}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function IconoCamion() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 17H5V5h9v12Z M14 9h4l3 3v5h-2 M14 17h2 M7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    </svg>
  );
}

function IconoDestello() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z" />
    </svg>
  );
}
