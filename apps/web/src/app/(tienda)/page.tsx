import { Contenedor, HeroPortada, MarcasCarrusel, Pila, ProductosDestacados, PromocionesPortada, Seccion } from "@appstore/ui";
import { promocionesPortada } from "@/lib/contenido";
import { categoriasDestacadas, destacadosPortada, resumenPortada } from "@/lib/consultas";

export default async function Portada() {
  const [categorias, destacados, resumen] = await Promise.all([categoriasDestacadas(12), destacadosPortada(6), resumenPortada()]);
  const diapositivas = categorias.slice(0, 1).map((c) => ({ titulo: c.nombre, texto: "Encuentra tus básicos favoritos por talla y estilo.", enlace: `/categorias/${c.slug}`, imagenUrl: c.imagenUrl })).concat(destacados.slice(0, 2).map((p) => ({ titulo: p.nombre, texto: "Prendas esenciales para completar tu guardarropa.", enlace: `/productos/${p.slug}`, imagenUrl: p.imagenUrl })));
  return <Seccion><Contenedor><Pila gap={6}>
    <HeroPortada totalProductos={resumen.totalProductos} totalCategorias={resumen.totalCategorias} categorias={categorias.map((c) => ({ nombre: nombreCategoria(c.slug, c.nombre), enlace: `/categorias/${c.slug}` })).concat({ nombre: "Bebés", enlace: "/buscar?q=bebes" })} diapositivas={diapositivas} banners={promocionesPortada.slice(0, 2)} />
    <MarcasCarrusel />
    <ProductosDestacados productos={destacados} banner={promocionesPortada[0] ?? null} />
    <PromocionesPortada promociones={promocionesPortada} />
  </Pila></Contenedor></Seccion>;
}

function nombreCategoria(slug: string, nombre: string) {
  if (slug === "teen") return "Juvenil";
  if (slug === "kids") return "Niños";
  return nombre;
}
