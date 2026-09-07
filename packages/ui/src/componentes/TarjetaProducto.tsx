import { Insignia } from "./Insignia";
import { Precio } from "./Precio";
import { Tarjeta } from "./Tarjeta";

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
  /** Marca en versalitas sobre el nombre. */
  marca?: string | null;
  /** Segunda linea bajo el nombre (categoria, SKU, variante...). */
  categoria?: string | null;
  /** Distintivo opcional sobre la imagen, por ejemplo en "Nuevos ingresos". */
  etiqueta?: "nuevo";
  /** Adelanta la carga de la imagen en las tarjetas visibles al abrir la pagina. */
  prioridad?: boolean;
  /**
   * "tarjeta" encierra el producto en una caja (listados). "limpia" deja solo
   * la imagen y el texto: la lectura minimalista de la portada.
   */
  variante?: "tarjeta" | "limpia";
}

/**
 * Tarjeta del catalogo. Compone `Tarjeta`, `Precio` e `Insignia`; no define
 * ningun color ni medida propia.
 *
 * Toda la tarjeta enlaza a la ficha mediante un enlace que la cubre; el corazon
 * de favoritos queda por encima y es visual (se conecta en F2). La ficha
 * concentra la eleccion de variante y la compra, para que el catalogo muestre
 * mas productos sin perder claridad.
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
  etiqueta,
  prioridad = false,
  variante = "tarjeta",
}: PropsTarjetaProducto) {
  const clases = [
    "ui-tarjeta-producto",
    variante === "limpia" ? "ui-tarjeta-producto--limpia" : "",
    disponible ? "" : "ui-tarjeta-producto--agotado",
  ]
    .filter(Boolean)
    .join(" ");

  const hayOferta = enOferta && typeof precioLista === "number" && precioLista > precio;

  return (
    <div className={clases}>
      <Tarjeta variante="borde" interactiva conCuerpo={false}>
        <div className="ui-tarjeta-producto__figura">
          {imagenUrl ? (
            <img
              src={imagenUrl}
              alt={imagenAlt ?? nombre}
              width={400}
              height={320}
              loading={prioridad ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={prioridad ? "high" : undefined}
            />
          ) : (
            <div className="ui-tarjeta-producto__sin-imagen" aria-hidden="true">
              Sin imagen
            </div>
          )}

          <div className="ui-tarjeta-producto__etiquetas">
            {etiqueta === "nuevo" ? <Insignia tono="marca">Nuevo</Insignia> : null}
            {!disponible ? <Insignia tono="neutro">Agotado</Insignia> : null}
          </div>
        </div>

        <div className="ui-tarjeta-producto__panel">
          {marca ? <p className="ui-tarjeta-producto__marca">{marca}</p> : null}
          <h3 className="ui-tarjeta-producto__nombre">{nombre}</h3>
          <div className="ui-tarjeta-producto__precios">
            <div className="ui-tarjeta-producto__precio-info">
              <div className="ui-tarjeta-producto__precio-anterior">
                <Precio
                  valor={precio}
                  antes={hayOferta ? precioLista : null}
                  tamano="md"
                  disposicion="resumen"
                  descuento={
                    hayOferta && descuentoPct ? (
                      <Insignia tono="marca">-{descuentoPct}%</Insignia>
                    ) : null
                  }
                />
              </div>
            </div>
            <button
              type="button"
              className="ui-tarjeta-producto__carrito"
              aria-label={`Agregar ${nombre} al carrito`}
            >
              <span className="ui-tarjeta-producto__carrito-icono" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Tarjeta>

      <a className="ui-tarjeta-producto__enlace-cubre" href={enlace} aria-label={nombre} />

      <button
        type="button"
        className="ui-tarjeta-producto__favorito"
        aria-label={`Anadir ${nombre} a favoritos`}
      >
        <span className="ui-tarjeta-producto__favorito-icono" aria-hidden="true" />
      </button>
    </div>
  );
}
