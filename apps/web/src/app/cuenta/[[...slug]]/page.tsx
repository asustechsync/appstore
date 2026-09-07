/**
 * CLASE C — todas las secciones de "Mi cuenta" en una sola ruta.
 *
 * La ruta atrapa-todo hace que el servidor entregue el mismo shell para
 * /cuenta, /cuenta/pedidos, /cuenta/direcciones, etc. Quien decide que
 * pantalla pintar es el router del cliente, sin ida y vuelta al servidor.
 *
 * Secciones (F2):
 *   /cuenta                 resumen
 *   /cuenta/pedidos         historial y detalle
 *   /cuenta/direcciones     libreta de direcciones
 *   /cuenta/favoritos       lista de deseos
 *   /cuenta/notificaciones  campanita
 *   /cuenta/perfil          datos personales
 *   /cuenta/seguridad       contrasena y sesiones
 */

// La ruta opcional captura segmentos variables para el router cliente.
export const instant = false;

export default function PaginaCuenta() {
  // F2: <AplicacionCuenta /> — componente cliente con el router interno
  //     y TanStack Query prefetcheando las secciones vecinas.
  return null;
}
