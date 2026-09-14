import { CabeceraTienda } from "@/componentes/CabeceraTienda";
import { navegacion } from "@/lib/consultas";

/**
 * Layout de la tienda publica — Clase A.
 *
 * La cabecera sale de una funcion cacheada con etiqueta `navegacion`, asi que
 * forma parte del shell estatico. El interruptor de tema y el contador del
 * carrito son islas cliente: se hidratan aparte y no obligan a renderizar el
 * layout en cada peticion.
 */

export default async function LayoutTienda({ children }: { children: React.ReactNode }) {
  const { marcas } = await navegacion();

  return (
    <>
      <CabeceraTienda />
      {children}
      {/* F1: <PieDePagina marcas={marcas} /> */}
      <span hidden>{marcas.length}</span>
    </>
  );
}
