import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--fuente-poppins",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Shell del panel. Se ejecuta UNA vez por sesion de trabajo.
 * A partir de aqui todo es cliente: el servidor solo entrega JSON por tRPC.
 */
export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
