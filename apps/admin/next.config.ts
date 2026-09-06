import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { config } from "dotenv";
import type { NextConfig } from "next";

// El .env.local unico vive en la raiz del monorepo. Next solo mira su propia
// carpeta, asi que lo cargamos a mano aqui, antes de compilar.
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env.local") });

/**
 * El panel es una SPA: no necesita SEO ni generacion estatica.
 * Su unico objetivo es que, despues de la primera carga, navegar entre
 * secciones sea instantaneo y no vuelva al servidor a renderizar HTML.
 */
const nextConfig: NextConfig = {
  cacheComponents: true,

  transpilePackages: [
    "@appstore/core",
    "@appstore/db",
    "@appstore/api",
    "@appstore/ui",
    "@appstore/tipos",
  ],

  serverExternalPackages: ["@prisma/client", "pg"],

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },

  // El panel no se indexa nunca.
  async headers() {
    return [
      {
        source: "/:ruta*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
