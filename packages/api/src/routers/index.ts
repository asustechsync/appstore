import { router } from "../trpc";

import { routerCatalogo } from "./catalogo";

/**
 * Router raiz. Este tipo es TODO el contrato de la API.
 *
 * apps/web, apps/admin y apps/mobile importan `AppRouter` y obtienen
 * autocompletado y tipos sin generar nada ni escribir un cliente a mano.
 */
export const appRouter = router({
  catalogo: routerCatalogo,

  // Se van sumando por fase:
  //   F2  cuenta   — perfil, direcciones, favoritos, notificaciones
  //   F3  carrito  — items, cupon, opciones de envio
  //   F3  checkout — cierre de pedido
  //   F4  admin    — productos, stock, pedidos, reportes
});

export type AppRouter = typeof appRouter;
