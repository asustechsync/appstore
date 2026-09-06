import { CarruselProductos, Contenedor, Pila, Seccion, TarjetaProducto } from "@appstore/ui";

import { destacadosPortada } from "@/lib/consultas";

/** CLASE A — portada. Etiqueta `portada`. Presupuesto: 20-40 ms. */

export default async function Portada() {
  const destacados = await destacadosPortada(8);

  return (
    <Seccion>
      <Contenedor>
        <Pila gap={6}>
          <h1>Destacados</h1>
          {/* F1: <HeroPortada />, <CategoriasDestacadas /> */}
          <CarruselProductos etiqueta="Productos destacados">
            {destacados.map((p) => (
              <TarjetaProducto
                key={p.slug}
                enlace={`/productos/${p.slug}`}
                nombre={p.nombre}
                imagenUrl={p.imagenUrl}
                marca={p.marcaNombre}
                categoria={p.categoriaSlug}
                precio={p.precioDesde}
                precioLista={p.precioLista}
                enOferta={p.enOferta}
                descuentoPct={p.descuentoPct}
                disponible={p.disponible}
              />
            ))}
          </CarruselProductos>
        </Pila>
      </Contenedor>
    </Seccion>
  );
}
