import type { ReactNode } from "react";

import { AlternarTema } from "./AlternarTema";
import { Buscador } from "./Buscador";

import "./primitivos.css";

export interface EnlaceNav {
  etiqueta: string;
  href: string;
  icono?: "usuario" | "caja" | "favorito" | "carrito";
  /** Isla cliente sobre el icono, ej. el contador del carrito. */
  insignia?: ReactNode;
}

export interface PropsCabecera {
  /** Nombre de marca que se muestra a la izquierda. */
  marca: string;
  /** Destino del logo. Por defecto la portada. */
  marcaHref?: string;
  /** Enlaces de navegacion principal mostrados en la segunda fila. */
  enlaces: EnlaceNav[];
  /** Acciones extra a la derecha (sesion, carrito). El boton de tema ya va. */
  acciones?: ReactNode;
  /** Texto orientativo del buscador del catalogo. */
  textoBuscar?: string;
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
 * interactivo es una isla cliente que se hidrata aparte: el interruptor de
 * tema.
 */
export function Cabecera({
  marca,
  marcaHref = "/",
  enlaces,
  acciones,
  textoBuscar = "Buscar productos, marcas y más",
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
          <a className="ui-cabecera__marca" href={marcaHref}>
            <span>{marca}</span>
          </a>

          <details className="ui-cabecera__categorias">
            <summary className="ui-cabecera__boton-categorias">Categorías</summary>
            <nav className="ui-cabecera__menu-categorias" aria-label="Categorías">
              {enlaces.map((enlace) => (
                <a key={enlace.href} href={enlace.href}>
                  {enlace.etiqueta}
                </a>
              ))}
            </nav>
          </details>

          <Buscador textoBuscar={textoBuscar} />

          <nav className="ui-cabecera__utilidades" aria-label="Acciones de cuenta">
            {enlacesUtilidad.map((enlace) => (
              <a
                key={enlace.href}
                className="ui-cabecera__utilidad"
                href={enlace.href}
                title={enlace.etiqueta}
                aria-label={enlace.etiqueta}
              >
                {enlace.icono ? (
                  <span className={`ui-cabecera__icono ui-cabecera__icono--${enlace.icono}`} aria-hidden="true" />
                ) : null}
                {enlace.insignia}
                <span className="ui-solo-lectores">{enlace.etiqueta}</span>
              </a>
            ))}
          </nav>

          <div className="ui-cabecera__acciones">
            {acciones}
            <AlternarTema />
          </div>
        </div>

      </div>
    </header>
  );
}

/**
 * Contador que se posa sobre el icono del carrito. Lo rellena una isla
 * cliente del consumidor, que es quien conoce el carrito.
 */
export function ContadorCabecera({ valor }: { valor: number }) {
  if (valor <= 0) return null;
  return (
    <span className="ui-cabecera__contador" aria-hidden="true">
      {valor > 99 ? "99+" : valor}
    </span>
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
