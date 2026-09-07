import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Contenedor, FichaProducto, Seccion, type EspecificacionFicha, type OpcionCompra } from "@appstore/ui";

import { productoPorSlug, slugsDeProductos, type VistaCatalogo } from "@/lib/consultas";

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
 *  Lo unico dinamico (seleccion de talla, cantidad, boton de carrito) vive en
 *  las islas cliente `GaleriaProducto` y `PanelCompra`, dentro de la ficha;
 *  se hidratan aparte sin bloquear.
 *
 *  La pagina no define estilos: solo mapea los datos ya resueltos de
 *  `catalogo_lectura` a los primitivos de `@appstore/ui`.
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

/** Slug de categoria -> texto legible para las migas ("kids" -> "Kids"). */
function titular(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/** Tallas con su stock sumado, en el orden en que aparecen las variantes. */
function opcionesDeCompra(producto: VistaCatalogo): OpcionCompra[] {
  const porTalla = new Map<string, number>();
  for (const variante of producto.variantes) {
    porTalla.set(variante.talla, (porTalla.get(variante.talla) ?? 0) + variante.stock);
  }
  return [...porTalla].map(([valor, stock]) => ({ valor, stock }));
}

function especificaciones(producto: VistaCatalogo): EspecificacionFicha[] {
  const colores = [...new Set(producto.variantes.map((v) => v.color).filter(Boolean))];
  const tallas = [...new Set(producto.variantes.map((v) => v.talla))];

  return [
    producto.marcaNombre ? { termino: "Marca", detalle: producto.marcaNombre } : null,
    colores.length > 0 ? { termino: "Color", detalle: colores.join(", ") } : null,
    tallas.length > 0 ? { termino: "Tallas", detalle: tallas.join(" · ") } : null,
  ].filter((e): e is EspecificacionFicha => e !== null);
}

export default async function PaginaProducto({ params }: Props) {
  const { slug } = await params;
  const producto = await productoPorSlug(slug);

  if (!producto) notFound();

  const imagenes = producto.imagenes.length > 0
    ? producto.imagenes
    : [producto.imagenUrl].filter((url): url is string => Boolean(url));

  const migas = [
    { etiqueta: "Inicio", href: "/" },
    { etiqueta: titular(producto.categoriaSlug), href: `/categorias/${producto.categoriaSlug}` },
    { etiqueta: producto.nombre },
  ];

  return (
    <Seccion>
      <Contenedor ancho="lg">
        <FichaProducto
          nombre={producto.nombre}
          marca={producto.marcaNombre}
          marcaHref={producto.marcaSlug ? `/marcas/${producto.marcaSlug}` : null}
          sku={producto.sku}
          migas={migas}
          imagenes={imagenes}
          precio={producto.precioDesde}
          precioLista={producto.precioLista}
          enOferta={producto.enOferta}
          descuentoPct={producto.descuentoPct}
          etiqueta={producto.etiqueta}
          disponible={producto.disponible}
          stockTotal={producto.stockTotal}
          calificacion={producto.calificacion}
          totalResenas={producto.totalResenas}
          descripcion={producto.descripcion}
          descripcionCorta={producto.descripcionCorta}
          opciones={opcionesDeCompra(producto)}
          nombreOpcion={producto.opciones[0]?.nombre ?? "Talla"}
          especificaciones={especificaciones(producto)}
        />
      </Contenedor>
    </Seccion>
  );
}
