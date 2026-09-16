import { Contenedor, HeroPortada, MarcasCarrusel, Pila, Seccion } from "@appstore/ui";
import { SeccionesProductosCliente } from "@/componentes/carrito/SeccionesProductosCliente";
import { promocionesPortada } from "@/lib/contenido";
import {
  categoriasDestacadas,
  destacadosPortada,
  masVendidosPortada,
  nuevosPortada,
  productosEnOferta,
  resumenPortada,
} from "@/lib/consultas";

export default async function Portada() {
  const [categorias, destacados, resumen, ofertas, nuevos, masVendidos] = await Promise.all([
    categoriasDestacadas(12),
    destacadosPortada(6),
    resumenPortada(),
    productosEnOferta(8),
    nuevosPortada(8),
    masVendidosPortada(8),
  ]);
  const diapositivas = categorias.slice(0, 1).map((c) => ({ titulo: c.nombre, texto: "Encuentra tus básicos favoritos por talla y estilo.", enlace: `/categorias/${c.slug}`, imagenUrl: c.imagenUrl })).concat(destacados.slice(0, 2).map((p) => ({ titulo: p.nombre, texto: "Prendas esenciales para completar tu guardarropa.", enlace: `/productos/${p.slug}`, imagenUrl: p.imagenUrl })));
  return <Seccion><Contenedor><Pila gap={6}>
    <HeroPortada totalProductos={resumen.totalProductos} totalCategorias={resumen.totalCategorias} categorias={categorias.map((c) => ({ nombre: c.nombre, enlace: `/categorias/${c.slug}` }))} diapositivas={diapositivas} banners={promocionesPortada.slice(0, 2)} />
    <MarcasCarrusel />
    <SeccionesProductosCliente
      ofertas={ofertas}
      nuevos={nuevos}
      masVendidos={masVendidos}
      bannerOferta={promocionesPortada[0] ?? null}
    />
  </Pila></Contenedor></Seccion>;
}
