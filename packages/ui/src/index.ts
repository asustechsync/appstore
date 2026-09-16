export { tokens, tokensOscuro, type Tokens } from "./tokens";
export { GUION_TEMA, TEMA_LLAVE, type Tema } from "./tema";

// Primitivos. Las paginas importan de aqui y nunca escriben estilos propias.
export { Boton } from "./componentes/Boton";
export { Campo } from "./componentes/Campo";
export { Tarjeta } from "./componentes/Tarjeta";
export { Acordeon, type PropsAcordeon } from "./componentes/Acordeon";
export { Precio } from "./componentes/Precio";
export { Insignia } from "./componentes/Insignia";
export { Estrellas, type PropsEstrellas } from "./componentes/Estrellas";
export { Pila, Fila, Contenedor, Seccion } from "./componentes/Layout";
export { TarjetaProducto, type PropsTarjetaProducto } from "./componentes/TarjetaProducto";
export { RejillaProductos } from "./componentes/RejillaProductos";
export { RejillaBanners } from "./componentes/RejillaBanners";
export { PanelSeccion, type PropsPanelSeccion } from "./componentes/PanelSeccion";
export { TarjetaCategoria, type PropsTarjetaCategoria } from "./componentes/TarjetaCategoria";
export { TarjetaPromo, type PropsTarjetaPromo } from "./componentes/TarjetaPromo";
export { BannerPromo, type PropsBannerPromo } from "./componentes/BannerPromo";
export { OfertaFlash, type PropsOfertaFlash } from "./componentes/OfertaFlash";
export {
  HeroPortada,
  type PropsHeroPortada,
  type PiezaCategoriaHero,
  type PiezaProductoHero,
} from "./componentes/HeroPortada";
export { SlidePortada, type DiapositivaPortada } from "./componentes/SlidePortada";
export { CarruselProductos, type PropsCarruselProductos } from "./componentes/CarruselProductos";
export { GaleriaProducto, type PropsGaleriaProducto } from "./componentes/GaleriaProducto";
export { PanelCompra, type PropsPanelCompra, type OpcionCompra } from "./componentes/PanelCompra";
export {
  FichaProducto,
  type PropsFichaProducto,
  type MigaFicha,
  type EspecificacionFicha,
} from "./componentes/FichaProducto";
export { Cabecera, ContadorCabecera, type PropsCabecera, type EnlaceNav } from "./componentes/Cabecera";
export { Buscador, type PropsBuscador } from "./componentes/Buscador";
export { CategoriasDestacadas } from "./componentes/CategoriasDestacadas";
export { ProductosDestacados } from "./componentes/ProductosDestacados";
export {
  SeccionProductos,
  type ProductoDeSeccion,
  type PropsSeccionProductos,
} from "./componentes/SeccionProductos";
export { PromocionesPortada } from "./componentes/PromocionesPortada";
export { MarcasCarrusel } from "./componentes/MarcasCarrusel";
export { AlternarTema } from "./componentes/AlternarTema";
export { UbicacionActual, type PropsUbicacionActual } from "./componentes/UbicacionActual";
export { Selector, type OpcionSelector, type PropsSelector } from "./componentes/Selector";

// Compra (Clase B): carrito y checkout.
export { SelectorCantidad, type PropsSelectorCantidad } from "./componentes/SelectorCantidad";
export { LineaCarrito, type PropsLineaCarrito } from "./componentes/LineaCarrito";
export {
  ListaCarrito,
  BotonVaciar,
  type PropsListaCarrito,
  type PropsBotonVaciar,
} from "./componentes/ListaCarrito";
export { ResumenCompra, type PropsResumenCompra } from "./componentes/ResumenCompra";
export { DisposicionCompra, type PropsDisposicionCompra } from "./componentes/DisposicionCompra";
export { EstadoVacio, type PropsEstadoVacio } from "./componentes/EstadoVacio";
