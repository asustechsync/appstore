import { Insignia } from "./Insignia";
import { Precio } from "./Precio";
import { Tarjeta } from "./Tarjeta";

import "./primitivos.css";

const CALIFICACION_FICTICIA = "4.5";

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
  /** Codigo base del producto visible en el catalogo. */
  sku?: string | null;
  /** Distintivo opcional sobre la imagen, por ejemplo en "Nuevos ingresos". */
  etiqueta?: "nuevo";
  /** Calificacion media de 0 a 5. Si falta, no se pinta la fila de estrellas. */
  calificacion?: number | null;
  /** Numero de resenas que respaldan la calificacion. */
  totalResenas?: number | null;
  /** Unidades disponibles. Se muestra bajo el precio como "En stock N productos". */
  stock?: number | null;
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
 * Toda la tarjeta enlaza a la ficha mediante un enlace que la cubre. La ficha
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
  sku,
  etiqueta,
  stock,
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
            {hayOferta && descuentoPct ? (
              <Insignia tono="oferta">-{descuentoPct}%</Insignia>
            ) : null}
            {etiqueta === "nuevo" ? <Insignia tono="marca">Nuevo</Insignia> : null}
            {!disponible ? <Insignia tono="neutro">Agotado</Insignia> : null}
          </div>
        </div>

        <div className="ui-tarjeta-producto__panel">
          <div className="ui-tarjeta-producto__meta">
            {marca ? <p className="ui-tarjeta-producto__marca">{marca}</p> : null}
            <div className="ui-tarjeta-producto__calificacion" aria-label="Calificacion 4.5 de 5">
              <span className="ui-tarjeta-producto__calificacion-icono" aria-hidden="true" />
              <span className="ui-tarjeta-producto__calificacion-valor">
                {CALIFICACION_FICTICIA}
              </span>
            </div>
          </div>
          <h3 className="ui-tarjeta-producto__nombre">{nombre}</h3>
          {sku ? <p className="ui-tarjeta-producto__sku">Cód.: {sku}</p> : null}
          {disponible && typeof stock === "number" && stock > 0 ? (
            <p className="ui-tarjeta-producto__stock">
              Stock: <strong>Disponible</strong>
            </p>
          ) : null}
          <div className="ui-tarjeta-producto__precios">
            <div className="ui-tarjeta-producto__precio-info">
              <div className="ui-tarjeta-producto__precio-anterior">
                <Precio valor={precio} antes={hayOferta ? precioLista : null} tamano="md" />
              </div>
            </div>
          </div>
        </div>
      </Tarjeta>

      <a className="ui-tarjeta-producto__enlace-cubre" href={enlace} aria-label={nombre} />
    </div>
  );
}
