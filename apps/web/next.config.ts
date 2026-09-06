import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { config } from "dotenv";
import type { NextConfig } from "next";

// El .env.local unico vive en la raiz del monorepo. Next solo mira su propia
// carpeta, asi que lo cargamos a mano aqui, antes de compilar.
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env.local") });

const nextConfig: NextConfig = {
  /**
   * Cache Components: el modelo de cache de Next 16.
   *
   * Los datos son DINAMICOS por defecto y uno elige que cachear con la
   * directiva `use cache`. Ademas activa PPR como comportamiento por defecto,
   * que es justo lo que necesita la Clase B: shell estatico inmediato y lo
   * dinamico llegando por streaming.
   *
   * Requiere runtime Node.js — ninguna ruta debe exportar runtime = "edge".
   */
  cacheComponents: true,

  // Los paquetes del monorepo se compilan con la app, no vienen pre-construidos.
  transpilePackages: [
    "@appstore/core",
    "@appstore/db",
    "@appstore/api",
    "@appstore/ui",
    "@appstore/tipos",
  ],

  // Prisma y pg no se empaquetan: se cargan como modulos nativos del servidor.
  serverExternalPackages: ["@prisma/client", "pg"],

  images: {
    // AVIF primero: pesa ~50 % menos que JPEG con la misma calidad.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
    // Tamanos alineados con la rejilla del catalogo, para no generar de mas.
    deviceSizes: [360, 640, 828, 1080, 1200, 1920],
    imageSizes: [96, 160, 240, 320],
  },

  experimental: {
    optimizePackageImports: ["@appstore/ui"],
  },

  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
