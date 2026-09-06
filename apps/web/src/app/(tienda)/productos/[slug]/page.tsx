import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { productoPorSlug, slugsDeProductos } from "@/lib/consultas";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CLASE A — ficha de producto. Presupuesto: 20-40 ms de TTFB.
 *
 *  Como se logra:
 *    1. `generateStaticParams` pre-genera el HTML de cada ficha en el build.
 *    2. Los datos salen de `productoPorSlug`, que es una funcion `use cache`
 *       con `cacheLife("max")` y etiqueta `producto:{slug}`.
 *    3. Al guardar el producto en el panel se invalida esa etiqueta y solo
 *       esa ficha se vuelve a generar.
 *    4. La pagina no lee cookies ni headers, asi que entra entera en el
 *       shell estatico y la sirve el CDN.
 *
 *  Lo unico dinamico (stock al segundo, boton de carrito) va en componentes
 *  cliente dentro de <PanelCompra />, que se hidratan aparte sin bloquear.
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return slugsDeProductos();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await productoPorSlug(slug);

  if (!producto) return { title: "Producto no encontrado" };

  return {
    title: producto.nombre,
    description: producto.descripcionCorta ?? producto.nombre,
    openGraph: {
      title: producto.nombre,
      images: producto.imagenUrl ? [producto.imagenUrl] : [],
    },
  };
}

export default async function PaginaProducto({ params }: Props) {
  const { slug } = await params;
  const producto = await productoPorSlug(slug);

  if (!producto) notFound();

  return (
    <main>
      <h1>{producto.nombre}</h1>

      {/* F1: <GaleriaProducto />, <PanelCompra />, <DetallesProducto />
          Todo lo que necesitan (variantes, opciones, imagenes) ya viene
          pre-armado en `producto`: cero consultas adicionales. */}
    </main>
  );
}
