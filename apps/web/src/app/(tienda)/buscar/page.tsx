/**
 * CLASE A (variante) — busqueda. Presupuesto: 60-90 ms.
 *
 * No se pre-genera porque el termino es libre, pero si se cachea por termino
 * con `cacheLife("minutes")`. No vale la pena invalidarla por evento.
 *
 * Usa el indice GIN sobre `catalogo_lectura.busqueda` (tsvector en espanol),
 * con `unaccent` para que "camison" encuentre "camisón".
 */

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = { title: "Buscar" };

export default async function PaginaBuscar({ searchParams }: Props) {
  const { q } = await searchParams;

  if (!q || q.trim().length < 2) {
    return (
      <main>
        <h1>Buscar</h1>
        <p>Escribe al menos 2 letras.</p>
      </main>
    );
  }

  // F1: const resultados = await buscarProductos(q)  ← funcion `use cache`
  return (
    <main>
      <h1>Resultados para &ldquo;{q}&rdquo;</h1>
    </main>
  );
}
