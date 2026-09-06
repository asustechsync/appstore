import type { ReactNode } from "react";

import { AlternarTema } from "./AlternarTema";
import { MenuMovil } from "./MenuMovil";

import "./primitivos.css";

export interface EnlaceNav {
  etiqueta: string;
  href: string;
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
}

/**
 * Cabecera de la tienda — parte del shell estatico (Clase A).
 *
 * Es un componente de servidor: los enlaces se pintan en el HTML. Lo unico
 * interactivo son dos islas cliente que se hidratan aparte: el cajon movil
 * (`MenuMovil`) y el interruptor de tema (`AlternarTema`).
 */
export function Cabecera({ marca, marcaHref = "/", enlaces, acciones }: PropsCabecera) {
  return (
    <header className="ui-cabecera">
      <div className="ui-cabecera__contenido ui-contenedor">
        <MenuMovil marca={marca} marcaHref={marcaHref} enlaces={enlaces} />

        <a className="ui-cabecera__marca" href={marcaHref}>
          {marca}
        </a>

        <nav className="ui-cabecera__nav" aria-label="Principal">
          {enlaces.map((enlace) => (
            <a key={enlace.href} className="ui-cabecera__enlace" href={enlace.href}>
              {enlace.etiqueta}
            </a>
          ))}
        </nav>

        <div className="ui-cabecera__acciones">
          {acciones}
          <AlternarTema />
        </div>
      </div>
    </header>
  );
}
