// ═══════════════════════════════════════════════════════════════════════════
//  @appstore/core — el corazon del sistema
//
//  TypeScript puro: sin React, sin Next, sin acceso a la base de datos.
//  Por eso lo pueden usar igual la web (RSC), el panel (SPA), la API (tRPC)
//  y la app movil (F7).
//
//  Toda regla de negocio vive aqui y SOLO aqui. Si una regla se escribe en
//  una pagina, la app movil tendra que reescribirla — y con el tiempo las dos
//  copias van a discrepar.
// ═══════════════════════════════════════════════════════════════════════════

// ── Puertos: lo que se implementa despues (F5 Izipay, F6 facturacion) ──────
export * from "./puertos/index";

// ── Precios ────────────────────────────────────────────────────────────────
export { TASA_IGV, redondear, desglosar, totalizar, type DesgloseIgv } from "./precios/igv";
export {
  calcularPrecio,
  rangoDePrecios,
  type PrecioEfectivo,
  type EntradaPrecio,
  type PromocionAplicable,
  type TipoPromocion,
} from "./precios/efectivo";

// ── Promociones ────────────────────────────────────────────────────────────
export {
  estaVigente,
  alcanza,
  promocionesPara,
  hayEnvioGratis,
  type PromocionConAlcance,
  type Alcance,
  type TipoAlcance,
  type Objetivo,
} from "./promociones/vigentes";

// ── Carrito ────────────────────────────────────────────────────────────────
export {
  calcularTotales,
  fusionarCarritos,
  type Totales,
  type ItemCarrito,
  type LineaCalculada,
  type CuponAplicable,
} from "./carrito/calcular";

// ── Pedidos ────────────────────────────────────────────────────────────────
export {
  puedeTransicionar,
  siguientesEstados,
  esFinal,
  tieneStockReservado,
  exigirTransicion,
  TransicionInvalida,
  ETIQUETA_ESTADO,
  type EstadoPedido,
} from "./pedidos/estados";

// ── Stock ──────────────────────────────────────────────────────────────────
export {
  disponible,
  planificarReserva,
  planificarDespacho,
  planificarLiberacion,
  planificarInventario,
  StockInsuficiente,
  type MovimientoPlaneado,
  type SaldoVariante,
  type TipoMovimiento,
  type MotivoMovimiento,
} from "./stock/movimientos";

// ── Envios ─────────────────────────────────────────────────────────────────
export {
  opcionesDeEnvio,
  faltaParaEnvioGratis,
  type OpcionEnvio,
  type TarifaZona,
  type ConsultaEnvio,
} from "./envios/tarifas";

// ── Ubicacion ─────────────────────────────────────────────────────────────
export {
  resolverDistritoPorCoordenadas,
  type LimiteDistrital,
  type DistritoResuelto,
} from "./ubicacion/resolver-distrito";
