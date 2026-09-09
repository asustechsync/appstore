// ═══════════════════════════════════════════════════════════════════════════
//  Contenido editorial de la portada.
//
//  Las promociones de la portada son contenido, no reglas de negocio: no
//  calculan precios ni deciden descuentos, solo enlazan a un listado. Por eso
//  viven aqui y no en `packages/core`.
//
//  Cuando el panel gestione banners (modelo propio en la base), esta constante
//  se sustituye por una consulta cacheada con la etiqueta `portada`.
// ═══════════════════════════════════════════════════════════════════════════

export interface PromocionPortada {
  gancho: string;
  titulo: string;
  enlace: string;
  imagenUrl?: string | null;
  tono: "frio" | "calido";
}

export const promocionesPortada: PromocionPortada[] = [
  {
    gancho: "Hasta 30% de descuento",
    titulo: "Lo nuevo de la temporada",
    enlace: "/ofertas",
    imagenUrl: "/images/promo-temporada-denim.png",
    tono: "frio",
  },
  {
    gancho: "Hasta 50% de descuento",
    titulo: "Ultimas unidades en liquidacion",
    enlace: "/ofertas",
    imagenUrl: "/images/BXBL.webp",
    tono: "calido",
  },
];

/** Fecha editorial de cierre para la oferta breve de la portada. */
export const finalizaOfertaFlash = "2026-09-30T23:59:59-05:00";
