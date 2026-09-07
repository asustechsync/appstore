/**
 * Convierte tokens.ts en las dos salidas que consumen las plataformas.
 *
 *   npm run ui:tokens
 *
 * Salidas:
 *   src/theme.css        -> variables CSS para web y panel
 *   src/tokens.native.ts -> objeto plano para React Native (F7)
 *
 * Este script de ~90 lineas es el puente al movil: el mismo archivo de tokens
 * alimenta el navegador y la app.
 */

import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { tokens, tokensOscuro } from "./tokens";

const AQUI = dirname(fileURLToPath(import.meta.url));

type Valor = string | number;
type Nodo = { [clave: string]: Valor | Nodo };

/** { color: { marca: { 500: "#..." } } } -> [["color-marca-500", "#..."]] */
function aplanar(nodo: Nodo, prefijo: string[] = []): Array<[string, Valor]> {
  const salida: Array<[string, Valor]> = [];

  for (const [clave, valor] of Object.entries(nodo)) {
    const ruta = [...prefijo, kebab(clave)];
    if (typeof valor === "object" && valor !== null) {
      salida.push(...aplanar(valor as Nodo, ruta));
    } else {
      salida.push([ruta.join("-"), valor]);
    }
  }

  return salida;
}

function kebab(s: string): string {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function camel(s: string): string {
  return s.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

/** Las medidas llevan px; los numeros sin unidad (peso, altura, z) no. */
function conUnidad(nombre: string, valor: Valor): string {
  if (typeof valor !== "number") return String(valor);
  const sinUnidad = /^(tipo-peso|tipo-altura|z-|espacio-0$)/.test(nombre);
  return sinUnidad ? String(valor) : `${valor}px`;
}

async function main(): Promise<void> {
  const claros = aplanar(tokens as unknown as Nodo);
  const oscuros = aplanar(tokensOscuro as unknown as Nodo);

  // ── theme.css ─────────────────────────────────────────────────────────────
  const varsClaras = claros
    .map(([n, v]) => `  --${n}: ${conUnidad(n, v)};`)
    .join("\n");

  const varsOscuras = oscuros
    .map(([n, v]) => `    --${n}: ${conUnidad(n, v)};`)
    .join("\n");

  const css = `/* GENERADO POR generar-theme.ts — NO EDITAR A MANO.
   Cambia packages/ui/src/tokens.ts y corre: npm run ui:tokens */

:root {
${varsClaras}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-tema="claro"]) {
${varsOscuras}
  }
}

:root[data-tema="oscuro"] {
${varsOscuras}
}
`;

  await writeFile(join(AQUI, "theme.css"), css, "utf8");

  // ── tokens.native.ts ──────────────────────────────────────────────────────
  const entradasNativas = claros
    .map(([n, v]) => `  ${camel(n)}: ${typeof v === "number" ? v : JSON.stringify(v)},`)
    .join("\n");

  const entradasNativasOscuro = oscuros
    .map(([n, v]) => `  ${camel(n)}: ${typeof v === "number" ? v : JSON.stringify(v)},`)
    .join("\n");

  const nativo = `// GENERADO POR generar-theme.ts — NO EDITAR A MANO.
// Lo consume apps/mobile (F7). Las medidas van sin unidad porque
// React Native trabaja en puntos, no en pixeles CSS.

export const t = {
${entradasNativas}
} as const;

export const tOscuro = {
  ...t,
${entradasNativasOscuro}
} as const;

export type TokensNativos = typeof t;
`;

  await writeFile(join(AQUI, "tokens.native.ts"), nativo, "utf8");

  console.log(`theme.css        ${claros.length} variables`);
  console.log(`tokens.native.ts ${claros.length} tokens`);
}

main().catch((error: unknown) => {
  console.error("Fallo al generar el tema:\n", error);
  process.exit(1);
});
