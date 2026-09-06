import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, crearContexto } from "@appstore/api";

import { leerSesion } from "@/lib/sesion";

/**
 * Punto de entrada de la API tipada.
 *
 * Lo consumen:
 *   · apps/web    — las partes cliente (carrito, cuenta)
 *   · apps/admin  — todo el panel (Clase C)
 *   · apps/mobile — F7, sin escribir un cliente nuevo
 *
 * Las paginas de servidor NO pasan por aqui: llaman a @appstore/core
 * directamente y se ahorran el salto HTTP.
 */

function manejar(peticion: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: peticion,
    router: appRouter,
    createContext: async () =>
      crearContexto({
        sesion: await leerSesion(),
        idInvitado: peticion.headers.get("x-id-invitado"),
        ip: peticion.headers.get("x-forwarded-for"),
      }),
    onError({ error, path }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`tRPC ${path ?? "<sin ruta>"}:`, error);
      }
    },
  });
}

export { manejar as GET, manejar as POST };
