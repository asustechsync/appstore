/** CLASE A — listado de marca. Etiqueta `marca:{slug}`. */

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PaginaMarca({ params }: Props) {
  const { slug } = await params;

  // F1: const { items } = await productosDeMarca(slug)
  return (
    <main>
      <h1>{slug}</h1>
    </main>
  );
}
