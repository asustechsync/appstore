import { Insignia } from "./Insignia";
import { Precio } from "./Precio";
import { Tarjeta } from "./Tarjeta";
import { Corazon } from "../iconos/Corazon";

import "./primitivos.css";

export interface PropsTarjetaProducto {
  /** Nombre del producto. */
  nombre: string;
  /** Ruta a la ficha, ej. `/productos/polo-basico`. */
  enlace: string;
  imagenUrl?: string | null;
  /** Texto alternativo de la imagen. Por defecto usa el nombre. */
  imagenAlt?: string;
  /** Precio que paga el cliente (precio efectivo "desde"). */
  precio: number;
  /** Precio de lista tachado. Solo se pinta si hay oferta. */
  precioLista?: number | null;
  enOferta?: boolean;
  descuentoPct?: number | null;
  disponible?: boolean;
  /** Marca que aparece sobre el nombre del producto. */
  marca?: string | null;
  categoria?: string | null;
}

/**
 * Tarjeta del catalogo. Compone `Tarjeta`, `Precio`, `Insignia` y `Boton`;
 * no define ningun color ni medida propia.
 *
 * La imagen y el nombre enlazan a la ficha. El corazon de favoritos es visual:
 * se conecta en F2. La ficha concentra la eleccion de variante y la accion de
 * compra, para que el catalogo pueda mostrar mas productos sin perder claridad.
 */
export function TarjetaProducto({
  nombre,
  enlace,
  imagenUrl,
  imagenAlt,
  precio,
  precioLista,
  enOferta = false,
  descuentoPct,
  disponible = true,
  marca,
}: PropsTarjetaProducto) {
  const clases = ["ui-tarjeta-producto", disponible ? "" : "ui-tarjeta-producto--agotado"]
    .filter(Boolean)
    .join(" ");

  const etiqueta = marca;
  const hayOferta = enOferta && typeof precioLista === "number" && precioLista > precio;

  return (
    <div className={clases}>
      <Tarjeta variante="borde" interactiva conCuerpo={false}>
        <div className="ui-tarjeta-producto__figura">
          <a className="ui-tarjeta-producto__enlace-imagen" href={enlace} aria-label={nombre}>
            {imagenUrl ? (
              <img
                src={imagenUrl}
                alt={imagenAlt ?? nombre}
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="ui-tarjeta-producto__sin-imagen" aria-hidden="true" />
            )}
          </a>

          {enOferta && descuentoPct ? (
            <span className="ui-tarjeta-producto__insignia">
              <Insignia tono="oferta">-{descuentoPct}%</Insignia>
            </span>
          ) : null}

          {!disponible ? (
            <span className="ui-tarjeta-producto__agotado">
              <Insignia tono="neutro">Agotado</Insignia>
            </span>
          ) : null}

          <button
            type="button"
            className="ui-tarjeta-producto__favorito"
            aria-label={`Anadir ${nombre} a favoritos`}
          >
            <Corazon width={16} height={16} />
          </button>
        </div>

        <div className="ui-tarjeta-producto__panel">
          {etiqueta ? <span className="ui-tarjeta-producto__categoria">{etiqueta}</span> : null}

          <a className="ui-tarjeta-producto__nombre" href={enlace}>
            {nombre}
          </a>

          <div className="ui-tarjeta-producto__datos">
            <div className="ui-tarjeta-producto__dato">
              <span className="ui-tarjeta-producto__etiqueta-dato">Precio</span>
              <Precio valor={precio} tamano="sm" />
            </div>
            <div className="ui-tarjeta-producto__dato">
              <span className="ui-tarjeta-producto__etiqueta-dato">
                {hayOferta ? "Antes" : "Estado"}
              </span>
              {hayOferta && typeof precioLista === "number" ? (
                <Precio valor={precioLista} tamano="sm" />
              ) : (
                <span className="ui-tarjeta-producto__estado">Disponible</span>
              )}
            </div>
          </div>
        </div>
      </Tarjeta>
    </div>
  );
}
