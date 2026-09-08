import type { Metadata, Viewport } from "next";
import { Bai_Jamjuree, Urbanist } from "next/font/google";

import { GUION_TEMA } from "@appstore/ui";
import { tokens, tokensOscuro } from "@appstore/ui/tokens";

import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--fuente-urbanist",
  weight: ["300", "400", "500", "600", "700"],
});

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  display: "swap",
  variable: "--fuente-bai-jamjuree",
  weight: ["300", "400", "500", "600", "700"],
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  LAYOUT RAIZ — REGLA CRITICA
 *
 *  Aqui NO se leen cookies(), headers() ni la sesion.
 *
 *  Leer una cookie en el layout raiz vuelve dinamico TODO el arbol de rutas,
 *  incluidas portada y categorias, que deberian ser HTML fijo en el CDN. Ese
 *  fue uno de los seis motivos por los que el proyecto anterior iba lento.
 *
 *  El estado de sesion entra por un componente cliente aislado dentro de la
 *  cabecera (`<EstadoSesion />`), que se hidrata sin bloquear el resto.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const metadata: Metadata = {
  title: {
    default: "Tienda",
    template: "%s | Tienda",
  },
  description: "Tienda en linea",
  metadataBase: new URL(process.env["NEXT_PUBLIC_WEB_URL"] ?? "http://localhost:3000"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: tokens.color.fondo },
    { media: "(prefers-color-scheme: dark)", color: tokensOscuro.color.fondo },
  ],
};

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  // `suppressHydrationWarning`: el script del tema fija `data-tema` en <html>
  // antes de la hidratacion, asi que el atributo difiere del HTML del
  // servidor. Es el unico punto donde esa diferencia es intencional.
  return (
    <html lang="es-PE" suppressHydrationWarning>
      <head>
        {/* Anti-parpadeo: corre sincrono en <head>, antes del primer pintado. */}
        <script dangerouslySetInnerHTML={{ __html: GUION_TEMA }} />
      </head>
      <body className={`${baiJamjuree.variable} ${urbanist.variable}`}>{children}</body>
    </html>
  );
}
