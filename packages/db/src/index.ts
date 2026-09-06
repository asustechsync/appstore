import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Cliente Prisma unico para todo el monorepo.
 *
 * En desarrollo se guarda en `globalThis` porque el recarga-en-caliente de Next
 * reevalua los modulos y, sin esto, cada recarga abre un pool nuevo hasta agotar
 * las conexiones del pooler.
 */

const globalParaPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function crearCliente(): PrismaClient {
  const connectionString = process.env["DATABASE_URL"];

  if (!connectionString) {
    throw new Error(
      "Falta DATABASE_URL. Copia .env.example a .env.local en la raiz del monorepo.",
    );
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env["NODE_ENV"] === "development"
        ? [{ emit: "stdout", level: "warn" }, { emit: "stdout", level: "error" }]
        : [{ emit: "stdout", level: "error" }],
  });
}

export const db: PrismaClient = globalParaPrisma.prisma ?? crearCliente();

if (process.env["NODE_ENV"] !== "production") {
  globalParaPrisma.prisma = db;
}

// Re-exporta tipos y enums generados para que las apps importen solo de aqui.
export * from "@prisma/client";
