import { Cabecera, type EnlaceNav } from "@appstore/ui";

import { navegacion } from "@/lib/consultas";

/**
 * Layout de la tienda publica — Clase A.
 *
 * El menu sale de una funcion cacheada con etiqueta `navegacion`, asi que
 * forma parte del shell estatico. El interruptor de tema y (mas adelante) el
 * contador del carrito y "Mi cuenta" son islas cliente: se hidratan aparte y
 * no obligan a renderizar el layout en cada peticion.
 */

export default async function LayoutTienda({ children }: { children: React.ReactNode }) {
  const { categorias, marcas } = await navegacion();

  const enlaces: EnlaceNav[] = [
    ...categorias
      .filter((categoria) => categoria.padreId === null)
      .map((categoria) => ({
        etiqueta: categoria.nombre,
        href: `/categorias/${categoria.slug}`,
      })),
    { etiqueta: "Ofertas", href: "/ofertas" },
  ];

  return (
    <>
      <Cabecera marca="Tienda" enlaces={enlaces} />
      {children}
      {/* F1: <PieDePagina marcas={marcas} /> */}
      <span hidden>{marcas.length}</span>
    </>
  );
}
