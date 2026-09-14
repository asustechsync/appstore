"use client";

import { TOPE_POR_LINEA, calcularTotales, topeDeLinea } from "@appstore/core";
import {
  BotonVaciar,
  DisposicionCompra,
  EstadoVacio,
  LineaCarrito,
  ListaCarrito,
  ResumenCompra,
} from "@appstore/ui";

import { aItemsDeCarrito, useCarrito, useHidratarCarrito } from "@/lib/carrito";

/**
 * Isla del carrito — CLASE B.
 *
 * El shell de la pagina es estatico; esto se hidrata encima. Las lineas salen
 * de localStorage y los totales de `calcularTotales` de @appstore/core: la
 * MISMA funcion que usara el checkout y el cierre del pedido.
 *
 * No define ningun estilo: solo compone primitivos de @appstore/ui.
 */
export function CarritoCliente() {
  const hidratado = useHidratarCarrito();
  const lineas = useCarrito((estado) => estado.lineas);
  const codigoCupon = useCarrito((estado) => estado.codigoCupon);
  const cambiarCantidad = useCarrito((estado) => estado.cambiarCantidad);
  const quitar = useCarrito((estado) => estado.quitar);
  const vaciar = useCarrito((estado) => estado.vaciar);
  const guardarCupon = useCarrito((estado) => estado.guardarCupon);
  const quitarCupon = useCarrito((estado) => estado.quitarCupon);

  // Hasta que se lee localStorage no hay lineas que pintar.
  if (!hidratado) return null;

  if (lineas.length === 0) {
    return (
      <EstadoVacio
        titulo="Tu carrito está vacío"
        detalle="Cuando agregues productos aparecerán aquí, con el total y el envío calculados al instante."
        icono={<IconoBolsa />}
        accionHref="/"
        accionTexto="Ver el catálogo"
      />
    );
  }

  const totales = calcularTotales({ items: aItemsDeCarrito(lineas) });
  const problemas = new Map(totales.problemas.map((problema) => [problema.varianteId, problema]));
  const hayProblemas = totales.problemas.length > 0;

  return (
    <DisposicionCompra
      titulo="Tu carrito"
      detalle={`${lineas.length} ${lineas.length === 1 ? "producto" : "productos"} · ${totales.unidades} ${
        totales.unidades === 1 ? "unidad" : "unidades"
      }`}
      volverHref="/"
      lateral={
        <ResumenCompra
          unidades={totales.unidades}
          subtotal={totales.subtotal}
          descuento={totales.descuento}
          descuentoCupon={totales.descuentoCupon}
          // El envio depende de la direccion: se resuelve en el checkout.
          costoEnvio={null}
          total={totales.total}
          cupon={codigoCupon}
          cuponAplicado={Boolean(codigoCupon)}
          mensajeCupon={
            codigoCupon ? "Validaremos el cupón al finalizar la compra." : null
          }
          onAplicarCupon={guardarCupon}
          onQuitarCupon={quitarCupon}
          bloqueo={
            hayProblemas
              ? "Ajusta las líneas marcadas para continuar: cambió el stock disponible."
              : null
          }
          pie={
            <>
              <span>Pagas con Yape, Plin, transferencia o contra entrega.</span>
              <span>Cambios y devoluciones dentro de los 7 días.</span>
            </>
          }
        />
      }
    >
      <ListaCarrito acciones={<BotonVaciar onClick={vaciar} />}>
        {lineas.map((linea) => {
          const calculada = totales.lineas.find((l) => l.varianteId === linea.varianteId);
          const problema = problemas.get(linea.varianteId);
          const maximo = topeDeLinea(linea, TOPE_POR_LINEA);

          return (
            <LineaCarrito
              key={linea.varianteId}
              nombre={linea.nombreProducto}
              enlace={`/productos/${linea.productoSlug}`}
              imagenUrl={linea.imagenUrl}
              variante={linea.descripcionVar}
              sku={linea.skuVariante}
              precioUnit={calculada?.precioUnit ?? linea.precio}
              precioLista={calculada?.precioLista ?? null}
              total={calculada?.total ?? linea.precio * linea.cantidad}
              cantidad={linea.cantidad}
              maximo={maximo}
              agotada={problema?.motivo === "SIN_STOCK"}
              aviso={avisoDe(problema)}
              onCantidad={(cantidad) => cambiarCantidad(linea.varianteId, cantidad)}
              onQuitar={() => quitar(linea.varianteId)}
            />
          );
        })}
      </ListaCarrito>
    </DisposicionCompra>
  );
}

/** Traduce el problema de stock que reporta el core a texto para el cliente. */
function avisoDe(
  problema: { motivo: "SIN_STOCK" | "STOCK_INSUFICIENTE"; disponible: number } | undefined,
): string | null {
  if (!problema) return null;
  if (problema.motivo === "SIN_STOCK") return "Se agotó. Quítalo para continuar.";
  return `Solo quedan ${problema.disponible} ${problema.disponible === 1 ? "unidad" : "unidades"}.`;
}

function IconoBolsa() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
