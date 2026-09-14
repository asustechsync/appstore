"use client";

import { useEffect } from "react";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  agregarLinea,
  contarUnidades,
  fijarCantidad,
  quitarLinea,
  type ItemCarrito,
} from "@appstore/core";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Carrito del invitado — CLASE B.
 *
 *  Vive solo en el navegador (localStorage). El servidor no lo conoce, asi
 *  que el carrito no vuelve dinamico ni el layout ni el catalogo.
 *
 *  Este archivo NO decide nada: los topes, la fusion de lineas repetidas y
 *  los totales estan en @appstore/core, que comparten web, panel y la app
 *  movil de F7. Aqui solo se guarda el resultado.
 *
 *  La lectura de localStorage esta diferida a proposito (`skipHydration`):
 *  el primer render del cliente tiene que dar el mismo HTML que el del
 *  servidor. `useHidratarCarrito` la dispara despues de montar.
 *
 *  Al iniciar sesion (F3) se llama a `fusionarCarritos` con lo que hay en la
 *  base y se sube el resultado por tRPC.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const LLAVE = "appstore:carrito";
/** Sube cuando cambie la forma de lo guardado; descarta lo viejo sin romper. */
const VERSION = 1;

/** Una linea tal como se guarda: la variante mas lo justo para pintarla. */
export interface LineaGuardadaWeb {
  varianteId: string;
  cantidad: number;
  /** Disponible real al momento de agregar. Se refresca al volver a agregar. */
  stockDisponible: number;

  productoSlug: string;
  nombreProducto: string;
  /** Descripcion de la variante, ej. "M · Negro". */
  descripcionVar: string;
  skuVariante: string;
  imagenUrl?: string | null;

  precio: number;
  precioOferta?: number | null;
}

interface EstadoCarrito {
  lineas: LineaGuardadaWeb[];
  /**
   * Codigo escrito por el cliente. No se valida aqui: el descuento lo resuelve
   * el servidor al cerrar el pedido, porque un cupon depende de vigencia,
   * monto minimo y usos restantes.
   */
  codigoCupon: string | null;
  /** Ya se leyo localStorage. Antes de eso no hay nada que pintar. */
  hidratado: boolean;

  agregar: (linea: LineaGuardadaWeb) => void;
  cambiarCantidad: (varianteId: string, cantidad: number) => void;
  quitar: (varianteId: string) => void;
  vaciar: () => void;
  guardarCupon: (codigo: string) => void;
  quitarCupon: () => void;
}

export const useCarrito = create<EstadoCarrito>()(
  persist(
    (set) => ({
      lineas: [],
      codigoCupon: null,
      hidratado: false,

      agregar: (linea) => set((estado) => ({ lineas: agregarLinea(estado.lineas, linea) })),
      cambiarCantidad: (varianteId, cantidad) =>
        set((estado) => ({ lineas: fijarCantidad(estado.lineas, varianteId, cantidad) })),
      quitar: (varianteId) => set((estado) => ({ lineas: quitarLinea(estado.lineas, varianteId) })),
      vaciar: () => set({ lineas: [], codigoCupon: null }),
      guardarCupon: (codigo) => set({ codigoCupon: codigo }),
      quitarCupon: () => set({ codigoCupon: null }),
    }),
    {
      name: LLAVE,
      version: VERSION,
      skipHydration: true,
      // `hidratado` describe esta sesion del navegador: no se guarda.
      partialize: (estado) => ({ lineas: estado.lineas, codigoCupon: estado.codigoCupon }),
      onRehydrateStorage: () => () => useCarrito.setState({ hidratado: true }),
    },
  ),
);

/**
 * Lee localStorage una vez montado el arbol. Es sincronizar React con un
 * sistema externo, que es justo para lo que existe el efecto.
 */
export function useHidratarCarrito(): boolean {
  useEffect(() => {
    void useCarrito.persist.rehydrate();
  }, []);

  return useCarrito((estado) => estado.hidratado);
}

/** Unidades totales. Es el numero del contador de la cabecera. */
export function unidadesDe(lineas: LineaGuardadaWeb[]): number {
  return contarUnidades(lineas);
}

/** Traduce lo guardado a la entrada de `calcularTotales`. */
export function aItemsDeCarrito(lineas: LineaGuardadaWeb[]): ItemCarrito[] {
  return lineas.map((linea) => ({
    varianteId: linea.varianteId,
    cantidad: linea.cantidad,
    precio: linea.precio,
    precioOferta: linea.precioOferta ?? null,
    nombreProducto: linea.nombreProducto,
    descripcionVar: linea.descripcionVar,
    skuVariante: linea.skuVariante,
    stockDisponible: linea.stockDisponible,
  }));
}
