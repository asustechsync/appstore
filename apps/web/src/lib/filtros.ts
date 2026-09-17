// ═══════════════════════════════════════════════════════════════════════════
//  Filtros del catalogo <-> URL.
//
//  Los filtros viven en la URL y no en estado de cliente: cada combinacion es
//  una pagina cacheable y compartible, y el panel funciona con enlaces, sin
//  JavaScript. Marcar una opcion es navegar.
//
//  Formato: /categorias/hombre?marca=fila,boston&talla=M&color=Negro&oferta=1
// ═══════════════════════════════════════════════════════════════════════════

import type { FiltrosCatalogo } from "./consultas";

/** Lo que Next entrega en `searchParams` para esta ruta. */
export interface ParametrosCatalogo {
  pagina?: string;
  marca?: string;
  talla?: string;
  color?: string;
  oferta?: string;
}

/** Grupos multiseleccion. El valor de la URL es una lista separada por comas. */
export type GrupoFiltro = "marca" | "talla" | "color";

function separar(valor: string | undefined): string[] {
  if (!valor) return [];
  return [...new Set(valor.split(",").map((v) => v.trim()).filter(Boolean))];
}

export function leerFiltros(parametros: ParametrosCatalogo): FiltrosCatalogo {
  return {
    marcas: separar(parametros.marca),
    tallas: separar(parametros.talla),
    colores: separar(parametros.color),
    soloOfertas: parametros.oferta === "1",
  };
}

export function hayFiltrosActivos(filtros: FiltrosCatalogo): boolean {
  return (
    filtros.marcas.length > 0 ||
    filtros.tallas.length > 0 ||
    filtros.colores.length > 0 ||
    filtros.soloOfertas
  );
}

function armarUrl(base: string, parametros: ParametrosCatalogo): string {
  const busqueda = new URLSearchParams();

  for (const [clave, valor] of Object.entries(parametros)) {
    if (valor) busqueda.set(clave, valor);
  }

  const cadena = busqueda.toString();
  return cadena ? `${base}?${cadena}` : base;
}

const CLAVE_POR_GRUPO = {
  marca: "marcas",
  talla: "tallas",
  color: "colores",
} as const;

/**
 * URL que resulta de marcar o desmarcar una opcion. Cambiar un filtro devuelve
 * el listado a la primera pagina: la pagina 5 del resultado anterior casi nunca
 * existe en el nuevo.
 */
export function urlAlternar(
  base: string,
  filtros: FiltrosCatalogo,
  grupo: GrupoFiltro,
  valor: string,
): string {
  const clave = CLAVE_POR_GRUPO[grupo];
  const actuales = filtros[clave];
  const siguientes = actuales.includes(valor)
    ? actuales.filter((v) => v !== valor)
    : [...actuales, valor];

  return armarUrl(base, parametrosDe({ ...filtros, [clave]: siguientes }));
}

/** URL que activa o apaga el filtro de ofertas, conservando el resto. */
export function urlOfertas(base: string, filtros: FiltrosCatalogo): string {
  return armarUrl(base, parametrosDe({ ...filtros, soloOfertas: !filtros.soloOfertas }));
}

/** URL de una pagina del listado conservando los filtros activos. */
export function urlPagina(base: string, filtros: FiltrosCatalogo, pagina: number): string {
  return armarUrl(base, {
    ...parametrosDe(filtros),
    ...(pagina > 1 ? { pagina: String(pagina) } : {}),
  });
}

function parametrosDe(filtros: FiltrosCatalogo): ParametrosCatalogo {
  return {
    marca: filtros.marcas.join(","),
    talla: filtros.tallas.join(","),
    color: filtros.colores.join(","),
    oferta: filtros.soloOfertas ? "1" : "",
  };
}
