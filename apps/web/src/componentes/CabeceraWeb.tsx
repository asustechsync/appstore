import { Cabecera, type EnlaceNav } from "@appstore/ui";

import { ContadorCarrito } from "@/componentes/carrito/ContadorCarrito";
import { navegacion } from "@/lib/consultas";

/**
 * Cabecera compartida por la tienda (Clase A) y por las pantallas de compra
 * (Clase B).
 *
 * Es un componente de servidor: el menu sale de `navegacion()`, que esta
 * cacheada con etiqueta, asi que forma parte del shell estatico. Lo unico
 * que se hidrata son las islas: el interruptor de tema y el contador del
 * carrito.
 */
export async function CabeceraWeb() {
  const { categorias } = await navegacion();

  const enlaces: EnlaceNav[] = [
    ...categorias
      .filter((categoria) => categoria.padreId === null)
      .map((categoria) => ({
        etiqueta: categoria.nombre,
        href: `/categorias/${categoria.slug}`,
      })),
    { etiqueta: "Ofertas", href: "/ofertas" },
  ];

  const enlacesUtilidad: EnlaceNav[] = [
    { etiqueta: "Mi cuenta", href: "/cuenta", icono: "usuario" },
    { etiqueta: "Favoritos", href: "/cuenta/favoritos", icono: "favorito" },
    { etiqueta: "Carrito", href: "/carrito", icono: "carrito", insignia: <ContadorCarrito /> },
  ];

  return <Cabecera marca="SOCKS" enlaces={enlaces} enlacesUtilidad={enlacesUtilidad} />;
}
