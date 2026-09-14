import type { ReactNode } from "react";

import { Acordeon } from "./Acordeon";
import { GaleriaProducto } from "./GaleriaProducto";
import { Insignia } from "./Insignia";
import { PanelCompra, type OpcionCompra } from "./PanelCompra";
import { Precio } from "./Precio";

import "./primitivos.css";

export interface MigaFicha {
  etiqueta: string;
  href?: string;
}

export interface EspecificacionFicha {
  termino: string;
  detalle: string;
}

export interface PropsFichaProducto {
  nombre: string;
  marca?: string | null;
  marcaHref?: string | null;
  sku?: string | null;

  /** Migas de pan: raiz -> categoria -> producto. La ultima suele ir sin href. */
  migas?: MigaFicha[];

  /** Imagenes ya resueltas; la primera es la portada. */
  imagenes: string[];
  imagenAlt?: string;

  precio: number;
  precioLista?: number | null;
  enOferta?: boolean;
  descuentoPct?: number | null;
  /** Etiqueta de promocion ya resuelta (ej. "3x2", "Envio gratis"). */
  etiqueta?: string | null;

  disponible?: boolean;
  stockTotal?: number;
  calificacion?: number | null;
  totalResenas?: number;

  descripcion?: string | null;
  descripcionCorta?: string | null;

  /** Opciones seleccionables (hoy: tallas) con su stock. */
  opciones?: OpcionCompra[];
  nombreOpcion?: string;

  especificaciones?: EspecificacionFicha[];

  /**
   * Reemplaza el panel de compra por la isla del consumidor, que si conoce el
   * carrito. Si falta, se pinta el panel sin conexion.
   */
  panelCompra?: ReactNode;
}

/**
 * Ficha de producto. Compone galeria, precio, panel de compra, acordeones e
 * insignias; no define ni un color ni una medida propia — todo sale de los
 * tokens.
 *
 * Estructura (copiada de una ficha de retail y adaptada a nuestros datos):
 *   · columna izquierda: galeria + acordeones "Descripcion" y "Caracteristicas"
 *   · columna derecha (tarjeta pegajosa): marca/SKU, nombre, precio, compra y
 *     bloque de entrega
 *
 * Pensada para Clase A: el marcado es estatico salvo `GaleriaProducto` y
 * `PanelCompra`, que son islas cliente y se hidratan sin bloquear el resto.
 */
export function FichaProducto({
  nombre,
  marca,
  marcaHref,
  sku,
  migas = [],
  imagenes,
  imagenAlt,
  precio,
  precioLista,
  enOferta = false,
  descuentoPct,
  etiqueta,
  disponible = true,
  stockTotal,
  calificacion,
  totalResenas = 0,
  descripcion,
  descripcionCorta,
  opciones = [],
  nombreOpcion = "Talla",
  especificaciones = [],
  panelCompra,
}: PropsFichaProducto) {
  const hayOferta = enOferta && typeof precioLista === "number" && precioLista > precio;
  const parrafos = (descripcion ?? "").split(/\n{2,}/).map((t) => t.trim()).filter(Boolean);

  return (
    <article className="ui-ficha">
      {migas.length > 0 ? (
        <nav className="ui-ficha__migas" aria-label="Ubicacion">
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

      <div className="ui-ficha__cols">
        <div className="ui-ficha__principal">
          <GaleriaProducto
            imagenes={imagenes}
            alt={imagenAlt ?? nombre}
            distintivo={
              hayOferta && descuentoPct ? <Insignia tono="oferta">-{descuentoPct}%</Insignia> : null
            }
          />

          <div className="ui-ficha__acordeones">
            <Acordeon titulo="Descripcion" abierto>
              {parrafos.length > 0 ? (
                parrafos.map((parrafo, i) => (
                  <p key={i} className="ui-ficha__parrafo">
                    {parrafo}
                  </p>
                ))
              ) : (
                <p className="ui-ficha__parrafo">{descripcionCorta ?? "Sin descripcion por ahora."}</p>
              )}
            </Acordeon>

            {especificaciones.length > 0 ? (
              <Acordeon titulo="Caracteristicas del producto">
                <dl className="ui-ficha__especificaciones">
                  {especificaciones.map((especificacion) => (
                    <div key={especificacion.termino}>
                      <dt>{especificacion.termino}</dt>
                      <dd>{especificacion.detalle}</dd>
                    </div>
                  ))}
                </dl>
              </Acordeon>
            ) : null}
          </div>
        </div>

        <aside className="ui-ficha__compra">
          <p className="ui-ficha__encabezado">
            {marca ? (
              <span className="ui-ficha__marca">
                {marcaHref ? <a href={marcaHref}>{marca}</a> : marca}
              </span>
            ) : null}
            {sku ? <span className="ui-ficha__sku">SKU: {sku}</span> : null}
          </p>

          <h1 className="ui-ficha__nombre">{nombre}</h1>

          {typeof calificacion === "number" ? (
            <p className="ui-ficha__resenas">
              <Estrellas valor={calificacion} />
              <span>
                {calificacion.toFixed(1)}
                {totalResenas > 0 ? ` · ${totalResenas} ${totalResenas === 1 ? "resena" : "resenas"}` : ""}
              </span>
            </p>
          ) : null}

          <div className="ui-ficha__precio">
            <Precio
              valor={precio}
              antes={hayOferta ? precioLista : null}
              tamano="lg"
              disposicion="resumen"
              descuento={
                hayOferta && descuentoPct ? <Insignia tono="oferta">-{descuentoPct}%</Insignia> : null
              }
            />
            {etiqueta ? <Insignia tono="marca">{etiqueta}</Insignia> : null}
          </div>

          {descripcionCorta ? <p className="ui-ficha__resumen">{descripcionCorta}</p> : null}

          {panelCompra ?? (
            <PanelCompra
              opciones={opciones}
              nombreOpcion={nombreOpcion}
              disponible={disponible}
              stockTotal={stockTotal}
            />
          )}

          <ul className="ui-ficha__entrega">
            <EntregaFila
              icono={<IconoCamion />}
              titulo="Envio a domicilio"
              detalle="A todo el Peru. El costo se calcula en el checkout segun tu direccion."
            />
            <EntregaFila
              icono={<IconoTienda />}
              titulo="Retiro en tienda"
              detalle="Gratis, sujeto a disponibilidad de stock en el local."
            />
            <EntregaFila
              icono={<IconoTarjeta />}
              titulo="Medios de pago"
              detalle="Yape, Plin, transferencia o pago contra entrega."
            />
          </ul>
        </aside>
      </div>
    </article>
  );
}

function EntregaFila({ icono, titulo, detalle }: { icono: ReactNode; titulo: string; detalle: string }) {
  return (
    <li className="ui-ficha__entrega-fila">
      <span className="ui-ficha__entrega-icono" aria-hidden="true">
        {icono}
      </span>
      <span>
        <span className="ui-ficha__entrega-titulo">{titulo}</span>
        <span className="ui-ficha__entrega-detalle">{detalle}</span>
      </span>
    </li>
  );
}

/** Estrellas de calificacion (0 a 5). Puramente visual; el numero va al lado. */
function Estrellas({ valor }: { valor: number }) {
  const llenas = Math.round(Math.min(5, Math.max(0, valor)));
  return (
    <span className="ui-estrellas" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < llenas ? "ui-estrellas__llena" : "ui-estrellas__vacia"}>
          ★
        </span>
      ))}
    </span>
  );
}

function IconoCamion() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 17h4V5H2v12h3M15 17h5v-5l-3-3h-2M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0" />
    </svg>
  );
}

function IconoTienda() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9 4 4h16l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6" />
    </svg>
  );
}

function IconoTarjeta() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}
