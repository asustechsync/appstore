import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  CabeceraCatalogo,
  Contenedor,
  DisposicionCatalogo,
  EstadoVacio,
  Paginacion,
  PanelFiltros,
  Pila,
  Seccion,
  type GrupoFiltros,
} from "@appstore/ui";

import { RejillaCatalogoCliente } from "@/componentes/carrito/RejillaCatalogoCliente";
import {
  categoriaPorSlug,
  facetasDeCategoria,
  productosDeCategoria,
  slugsDeCategorias,
  type FiltrosCatalogo,
  type OpcionFaceta,
} from "@/lib/consultas";
import {
  hayFiltrosActivos,
  leerFiltros,
  urlAlternar,
  urlOfertas,
  urlPagina,
  type ParametrosCatalogo,
} from "@/lib/filtros";

/**
 * CLASE A — listado de categoria. Etiqueta `categoria:{slug}`.
 *
 * Una sola consulta contra `catalogo_lectura` con el indice
 * (categoria_id, disponible, precio_desde). Antes eran 8 tablas unidas.
 *
 * Los filtros viajan en la URL y entran como argumento de la funcion cacheada,
 * asi que cada combinacion es su propia entrada de cache bajo la misma
 * etiqueta. El panel son enlaces: no hay estado de cliente que hidratar.
 *
 * La pagina no define estilos: compone primitivos de `@appstore/ui` sobre los
 * datos ya resueltos del modelo de lectura.
 */

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ParametrosCatalogo>;
}

// La pagina del listado y los filtros llegan desde la URL: se resuelve por solicitud.
export const instant = false;

export async function generateStaticParams() {
  return slugsDeCategorias();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoria = await categoriaPorSlug(slug);

  if (!categoria) return { title: "Categoria no encontrada" };

  return {
    title: categoria.tituloSeo ?? categoria.nombre,
    description: categoria.descripcionSeo ?? categoria.descripcion,
  };
}

/** Una pagina fuera de rango o no numerica cae en la primera. */
function paginaPedida(valor: string | undefined): number {
  const numero = Number(valor ?? 1);
  return Number.isInteger(numero) && numero > 0 ? numero : 1;
}

export default async function PaginaCategoria({ params, searchParams }: Props) {
  const { slug } = await params;
  const parametros = await searchParams;
  const pagina = paginaPedida(parametros.pagina);
  const filtros = leerFiltros(parametros);

  const categoria = await categoriaPorSlug(slug);
  if (!categoria) notFound();

  const base = `/categorias/${slug}`;

  const [{ items, total, paginas }, facetas] = await Promise.all([
    productosDeCategoria(slug, pagina, filtros),
    facetasDeCategoria(slug),
  ]);

  if (total > 0 && pagina > paginas) notFound();

  const migas = [
    { etiqueta: "Inicio", href: "/" },
    ...(categoria.padre
      ? [{ etiqueta: categoria.padre.nombre, href: `/categorias/${categoria.padre.slug}` }]
      : []),
    { etiqueta: categoria.nombre },
  ];

  const grupo = (
    clave: "marca" | "talla" | "color",
    titulo: string,
    opciones: OpcionFaceta[],
    activas: string[],
  ): GrupoFiltros => ({
    clave,
    titulo,
    opciones: opciones.map((opcion) => ({
      etiqueta: opcion.etiqueta,
      total: opcion.total,
      activa: activas.includes(opcion.valor),
      href: urlAlternar(base, filtros, clave, opcion.valor),
    })),
  });

  const grupos: GrupoFiltros[] = [
    {
      clave: "oferta",
      titulo: "Promociones",
      opciones:
        facetas.ofertas > 0
          ? [
              {
                etiqueta: "Solo ofertas",
                total: facetas.ofertas,
                activa: filtros.soloOfertas,
                href: urlOfertas(base, filtros),
              },
            ]
          : [],
    },
    grupo("marca", "Marca", facetas.marcas, filtros.marcas),
    grupo("talla", "Talla", facetas.tallas, filtros.tallas),
    grupo("color", "Color", facetas.colores, filtros.colores),
  ];

  const conFiltros = hayFiltrosActivos(filtros);

  return (
    <Seccion>
      <Contenedor>
        <Pila gap={6}>
          <CabeceraCatalogo
            titulo={categoria.nombre}
            migas={migas}
            descripcion={categoria.descripcion}
            total={total}
          />

          <DisposicionCatalogo
            lateral={
              <PanelFiltros grupos={grupos} limpiarHref={base} hayFiltrosActivos={conFiltros} />
            }
          >
            {items.length === 0 ? (
              conFiltros ? (
                <EstadoVacio
                  titulo="Ningun producto coincide con esos filtros"
                  detalle="Prueba quitando alguno para ver mas resultados."
                  accionHref={base}
                  accionTexto="Quitar filtros"
                />
              ) : (
                <EstadoVacio
                  titulo="Todavia no hay productos en esta categoria"
                  detalle="Estamos sumando prendas nuevas. Mientras tanto, mira el resto del catalogo."
                  accionHref="/"
                  accionTexto="Ver todo el catalogo"
                />
              )
            ) : (
              <>
                <RejillaCatalogoCliente productos={items} />
                <Paginacion
                  pagina={pagina}
                  paginas={paginas}
                  href={(n) => urlPagina(base, filtros, n)}
                />
              </>
            )}
          </DisposicionCatalogo>
        </Pila>
      </Contenedor>
    </Seccion>
  );
}
