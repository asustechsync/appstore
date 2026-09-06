import { productosEnOferta } from "@/lib/consultas";

/** CLASE A — ofertas. Etiqueta `ofertas`. Se invalida al empezar o terminar una promocion. */

export const metadata = { title: "Ofertas" };

export default async function PaginaOfertas() {
  const items = await productosEnOferta(48);

  return (
    <main>
      <h1>Ofertas</h1>
      {/* F1: <ProductosGrid items={items} /> */}
      <span hidden>{items.length}</span>
    </main>
  );
}
