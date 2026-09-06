/**
 * Aplica los archivos de prisma/sql/ en orden alfabetico.
 *
 * Prisma no puede expresar columnas tsvector, indices GIN ni indices parciales,
 * asi que ese SQL se escribe a mano y se aplica despues de cada migracion.
 * Todos los archivos deben ser idempotentes.
 *
 *   npm run sql -w @appstore/db
 */

import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";
import { Client } from "pg";

config({ path: join(dirname(fileURLToPath(import.meta.url)), "../../../.env.local") });

const CARPETA_SQL = join(dirname(fileURLToPath(import.meta.url)), "sql");

async function main(): Promise<void> {
  // Conexion directa: los DDL no deben pasar por el pooler.
  const connectionString = process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"];

  if (!connectionString) {
    throw new Error("Falta DIRECT_URL (o DATABASE_URL) en .env.local");
  }

  const archivos = (await readdir(CARPETA_SQL))
    .filter((n) => n.endsWith(".sql"))
    .sort();

  if (archivos.length === 0) {
    console.log("No hay archivos .sql que aplicar.");
    return;
  }

  const cliente = new Client({ connectionString });
  await cliente.connect();

  try {
    for (const archivo of archivos) {
      const sql = await readFile(join(CARPETA_SQL, archivo), "utf8");
      process.stdout.write(`  ${archivo} ... `);
      await cliente.query(sql);
      console.log("ok");
    }
    console.log(`\n${archivos.length} archivo(s) aplicados.`);
  } finally {
    await cliente.end();
  }
}

main().catch((error: unknown) => {
  console.error("\nFallo al aplicar el SQL:\n", error);
  process.exit(1);
});
