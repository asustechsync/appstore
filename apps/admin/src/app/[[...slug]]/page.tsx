/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CLASE C — el panel entero en una sola ruta.
 *
 *  Esta es la razon por la que el panel se sentia pesado en el proyecto
 *  anterior: cada seccion era una ruta de servidor y cada clic pagaba
 *  middleware + sesion + consulta + HTML.
 *
 *  Aqui el servidor entrega el mismo shell para todas las rutas. Quien decide
 *  que pantalla pintar es el router del cliente, y los datos salen de la
 *  cache de TanStack Query. Cambiar de "Productos" a "Pedidos" no toca el
 *  servidor: 0 ms.
 *
 *  Secciones (src/pantallas/), por fase:
 *    F2  productos · categorias · marcas · atributos · variantes
 *    F4  pedidos · stock · kardex · clientes · promociones · cupones
 *    F4  reportes · usuarios · roles · auditoria
 *    F5  pagos y conciliacion
 *    F6  comprobantes y series
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default function PaginaPanel() {
  // F2: <AplicacionPanel /> — componente cliente con el router interno,
  //     el menu lateral y el proveedor de TanStack Query.
  return null;
}
