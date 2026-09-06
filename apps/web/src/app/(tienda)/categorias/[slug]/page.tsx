import { notFound } from "next/navigation";

import { productosDeCategoria } from "@/lib/consultas";

/**
 * CLASE A — listado de categoria. Etiqueta `categoria:{slug}`.
 *
 * Una sola consulta contra `catalogo_lectura` con el indice
 * (categoria_id, disponible, precio_desde). Antes eran 8 tablas unidas.
 */

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pagina?: string }>;
}

export default async function PaginaCategoria({ params, searchParams }: Props) {
  const { slug } = await params;
  const { pagina } = await searchParams;

  const { items, total, paginas } = await productosDeCategoria(slug, Number(pagina ?? 1));

  if (total === 0 && Number(pagina ?? 1) > 1) notFound();

  return (
    <main>
      {/* F1: <CabeceraCatalogo />, <FiltrosCatalogo />, <ProductosGrid />, <Paginacion /> */}
      <span hidden>
        {items.length} de {total} en {paginas} paginas
      </span>
    </main>
  );
}
