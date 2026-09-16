/**
 * Catalogo de PRUEBA — 2 productos por departamento (Hombre, Mujer, Juvenil, Niños).
 * Idempotente: se puede correr las veces que haga falta.
 *
 *   npm run db:seed:catalogo
 *
 * Ojo: mientras no exista packages/core/src/lectura/refrescar.ts, este script
 * es tambien quien arma la fila de `catalogo_lectura`. Cuando ese modulo
 * exista, esta parte se borra y se llama a el.
 */

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";

config({ path: join(dirname(fileURLToPath(import.meta.url)), "../../../.env.local") });

const { db } = await import("../src/index.js");
const { calcularPrecio, planificarInventario } = await import("@appstore/core");

const TALLAS_ADULTO = ["S", "M", "L"] as const;
const TALLAS_KIDS = ["4", "6", "8"] as const;

interface ProductoSemilla {
  categoriaSlug: string;
  marcaSlug: string;
  nombre: string;
  slug: string;
  sku: string;
  descripcion: string;
  descripcionCorta: string;
  precio: number;
  precioOferta?: number;
  etiqueta?: "Nuevo";
  color: string;
  tallas: readonly string[];
  stockPorTalla: number;
}

const MARCAS = [
  { nombre: "Amanecer", slug: "amanecer" },
  { nombre: "Pesail", slug: "pesail" },
  { nombre: "Ciervo Dorado", slug: "ciervo-dorado" },
  { nombre: "Qiling", slug: "qiling" },
  { nombre: "Fila", slug: "fila" },
  { nombre: "Boston", slug: "boston" },
] as const;

const PRODUCTOS: ProductoSemilla[] = [
  // ── Hombre ────────────────────────────────────────────────────────────────
  {
    categoriaSlug: "hombre",
    marcaSlug: "amanecer",
    nombre: "Polo basico de algodon",
    slug: "polo-basico-algodon-hombre",
    sku: "POLO-H-001",
    descripcion: "Polo de algodon peinado, corte regular, cuello redondo reforzado. Un basico para todos los dias.",
    descripcionCorta: "Algodon peinado, corte regular",
    precio: 49.9,
    color: "Negro",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 20,
  },
  {
    categoriaSlug: "hombre",
    marcaSlug: "pesail",
    nombre: "Jean slim azul",
    slug: "jean-slim-azul-hombre",
    sku: "JEAN-H-001",
    descripcion: "Jean de mezclilla elastizada, tiro medio y pierna slim. Azul indigo con lavado ligero.",
    descripcionCorta: "Mezclilla elastizada, tiro medio",
    precio: 139.9,
    precioOferta: 99.9,
    color: "Azul indigo",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 12,
  },

  // ── Mujer ─────────────────────────────────────────────────────────────────
  {
    categoriaSlug: "mujer",
    marcaSlug: "ciervo-dorado",
    nombre: "Blusa manga larga",
    slug: "blusa-manga-larga-mujer",
    sku: "BLUS-M-001",
    descripcion: "Blusa fluida de manga larga con punos abotonados. Cae suelta, ideal para oficina o salir.",
    descripcionCorta: "Tejido fluido, punos abotonados",
    precio: 89.9,
    color: "Blanco hueso",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 15,
  },
  {
    categoriaSlug: "mujer",
    marcaSlug: "qiling",
    nombre: "Vestido casual floral",
    slug: "vestido-casual-floral-mujer",
    sku: "VEST-M-001",
    descripcion: "Vestido midi con estampado floral, cintura ajustable y falda con vuelo. Tela fresca de viscosa.",
    descripcionCorta: "Midi, viscosa, cintura ajustable",
    precio: 169.9,
    precioOferta: 129.9,
    color: "Floral verde",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 10,
  },

  // ── Juvenil ───────────────────────────────────────────────────────────────
  {
    categoriaSlug: "juvenil",
    marcaSlug: "fila",
    nombre: "Hoodie oversize",
    slug: "hoodie-oversize-teen",
    sku: "HOOD-T-001",
    descripcion: "Buzo con capucha de corte oversize, felpa perchada por dentro, bolsillo canguro. Unisex.",
    descripcionCorta: "Corte oversize, felpa perchada",
    precio: 119.9,
    precioOferta: 89.9,
    color: "Gris jaspe",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 18,
  },
  {
    categoriaSlug: "juvenil",
    marcaSlug: "boston",
    nombre: "Polera estampada",
    slug: "polera-estampada-teen",
    sku: "POLE-T-001",
    descripcion: "Polera de algodon con estampado frontal serigrafiado. Corte recto, cuello redondo.",
    descripcionCorta: "Algodon, estampado serigrafiado",
    precio: 69.9,
    color: "Verde militar",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 22,
  },

  // ── Niños ─────────────────────────────────────────────────────────────────
  {
    categoriaSlug: "ninos",
    marcaSlug: "amanecer",
    nombre: "Polo estampado dinosaurio",
    slug: "polo-dinosaurio-kids",
    sku: "POLO-K-001",
    descripcion: "Polo de algodon suave con estampado de dinosaurio. Costuras planas que no irritan la piel.",
    descripcionCorta: "Algodon suave, costuras planas",
    precio: 34.9,
    color: "Celeste",
    tallas: TALLAS_KIDS,
    stockPorTalla: 25,
  },
  {
    categoriaSlug: "ninos",
    marcaSlug: "ciervo-dorado",
    nombre: "Conjunto deportivo",
    slug: "conjunto-deportivo-kids",
    sku: "CONJ-K-001",
    descripcion: "Conjunto de polera y pantalon de buzo en algodon french terry. Punos y pretina elasticados.",
    descripcionCorta: "Polera + pantalon, french terry",
    precio: 79.9,
    precioOferta: 59.9,
    etiqueta: "Nuevo",
    color: "Azul marino",
    tallas: TALLAS_KIDS,
    stockPorTalla: 14,
  },
];

function claveTalla(talla: string): string {
  return `talla:${talla.toLowerCase()}`;
}

async function sembrarProducto(
  p: ProductoSemilla,
  categoriaId: string,
  marcaId: string,
  almacenId: string,
  marca: { slug: string; nombre: string },
): Promise<void> {
  // ── Producto ──────────────────────────────────────────────────────────────
  const producto = await db.producto.upsert({
    where: { slug: p.slug },
    update: {
      nombre: p.nombre,
      descripcion: p.descripcion,
      descripcionCorta: p.descripcionCorta,
      precio: p.precio,
      precioOferta: p.precioOferta ?? null,
      categoriaId,
      marcaId,
      borrador: false,
      activo: true,
      destacado: true,
      modoVariantes: true,
    },
    create: {
      nombre: p.nombre,
      slug: p.slug,
      sku: p.sku,
      descripcion: p.descripcion,
      descripcionCorta: p.descripcionCorta,
      precio: p.precio,
      precioOferta: p.precioOferta ?? null,
      categoriaId,
      marcaId,
      borrador: false,
      activo: true,
      destacado: true,
      modoVariantes: true,
      afectacionIgv: "GRAVADO",
    },
  });

  // ── Opcion "Talla" y sus valores ──────────────────────────────────────────
  const opcion = await db.opcionProducto.upsert({
    where: { productoId_clave: { productoId: producto.id, clave: "talla" } },
    update: { nombre: "Talla" },
    create: { productoId: producto.id, clave: "talla", nombre: "Talla", orden: 0 },
  });

  const valorPorTalla = new Map<string, string>();
  for (const [i, talla] of p.tallas.entries()) {
    const valor = await db.valorOpcionProducto.upsert({
      where: { opcionId_valor: { opcionId: opcion.id, valor: talla } },
      update: { orden: i },
      create: { opcionId: opcion.id, valor: talla, orden: i },
    });
    valorPorTalla.set(talla, valor.id);
  }

  // ── Variantes (una por talla) + kardex ────────────────────────────────────
  const variantesArmadas: Array<{ id: string; sku: string; talla: string; stock: number }> = [];

  for (const talla of p.tallas) {
    const clave = claveTalla(talla);
    const variante = await db.variante.upsert({
      where: { productoId_claveOpciones: { productoId: producto.id, claveOpciones: clave } },
      update: { activo: true, color: p.color },
      create: {
        productoId: producto.id,
        talla,
        color: p.color,
        claveOpciones: clave,
        sku: `${p.sku}-${talla}`,
        activo: true,
      },
    });

    // Enlace variante <-> valor de opcion
    const valorId = valorPorTalla.get(talla);
    if (valorId) {
      await db.valorVariante.upsert({
        where: { varianteId_valorId: { varianteId: variante.id, valorId } },
        update: {},
        create: { varianteId: variante.id, valorId },
      });
    }

    // Stock: nunca se toca `cantidad` sin registrar el movimiento (regla 4).
    // `planificarInventario` devuelve null si ya esta en el saldo objetivo,
    // asi que re-ejecutar el seed no genera movimientos de mas.
    const movimiento = planificarInventario(
      { varianteId: variante.id, cantidad: variante.cantidad, reservado: variante.reservado },
      p.stockPorTalla,
      "Carga inicial de catalogo de prueba",
    );

    if (movimiento) {
      await db.$transaction([
        db.movimientoStock.create({
          data: {
            varianteId: variante.id,
            almacenId,
            tipo: movimiento.tipo,
            motivo: movimiento.motivo,
            cantidad: movimiento.cantidad,
            saldoAnterior: movimiento.saldoAnterior,
            saldoNuevo: movimiento.saldoNuevo,
            referenciaTipo: movimiento.referenciaTipo ?? null,
            nota: movimiento.nota ?? null,
          },
        }),
        db.variante.update({
          where: { id: variante.id },
          data: { cantidad: movimiento.saldoNuevo },
        }),
      ]);
    }

    variantesArmadas.push({ id: variante.id, sku: variante.sku, talla, stock: p.stockPorTalla });
  }

  // ── catalogo_lectura (desnormalizado) ─────────────────────────────────────
  // El precio efectivo lo decide packages/core, no este script (regla 1).
  const precio = calcularPrecio({ precio: p.precio, precioOferta: p.precioOferta });
  const stockTotal = variantesArmadas.reduce((suma, v) => suma + v.stock, 0);
  const categoria = await db.categoria.findUniqueOrThrow({ where: { id: categoriaId } });

  await db.catalogoLectura.upsert({
    where: { productoId: producto.id },
    update: {
      slug: p.slug,
      nombre: p.nombre,
      sku: p.sku,
      descripcionCorta: p.descripcionCorta,
      descripcion: p.descripcion,
      categoriaId,
      categoriaSlug: categoria.slug,
      marcaId,
      marcaSlug: marca.slug,
      marcaNombre: marca.nombre,
      categoriaRuta: [categoria.slug],
      precioDesde: precio.unitario,
      precioHasta: precio.unitario,
      precioLista: p.precio,
      enOferta: precio.enOferta,
      descuentoPct: precio.descuentoPct,
      etiqueta: p.etiqueta ?? null,
      imagenUrl: "/images/BXBL.webp",
      imagenes: [],
      stockTotal,
      disponible: stockTotal > 0,
      destacado: true,
      activo: true,
      variantes: variantesArmadas.map((v) => ({
        id: v.id,
        sku: v.sku,
        talla: v.talla,
        color: p.color,
        precio: precio.unitario,
        stock: v.stock,
      })),
      opciones: [
        { clave: "talla", nombre: "Talla", valores: p.tallas.map((t) => ({ valor: t })) },
      ],
      facetas: { talla: [...p.tallas], color: [p.color] },
    },
    create: {
      productoId: producto.id,
      slug: p.slug,
      nombre: p.nombre,
      sku: p.sku,
      descripcionCorta: p.descripcionCorta,
      descripcion: p.descripcion,
      categoriaId,
      categoriaSlug: categoria.slug,
      marcaId,
      marcaSlug: marca.slug,
      marcaNombre: marca.nombre,
      categoriaRuta: [categoria.slug],
      precioDesde: precio.unitario,
      precioHasta: precio.unitario,
      precioLista: p.precio,
      enOferta: precio.enOferta,
      descuentoPct: precio.descuentoPct,
      etiqueta: p.etiqueta ?? null,
      imagenUrl: "/images/BXBL.webp",
      imagenes: [],
      stockTotal,
      disponible: stockTotal > 0,
      destacado: true,
      activo: true,
      variantes: variantesArmadas.map((v) => ({
        id: v.id,
        sku: v.sku,
        talla: v.talla,
        color: p.color,
        precio: precio.unitario,
        stock: v.stock,
      })),
      opciones: [
        { clave: "talla", nombre: "Talla", valores: p.tallas.map((t) => ({ valor: t })) },
      ],
      facetas: { talla: [...p.tallas], color: [p.color] },
    },
  });
}

async function main(): Promise<void> {
  console.log("Sembrando catalogo de prueba...");

  const almacen = await db.almacen.findUniqueOrThrow({ where: { clave: "PRINCIPAL" } });

  const categorias = await db.categoria.findMany({
    where: { slug: { in: ["hombre", "mujer", "juvenil", "ninos", "bebes"] } },
    select: { id: true, slug: true },
  });
  const idPorSlug = new Map(categorias.map((c) => [c.slug, c.id]));

  const marcas = await Promise.all(
    MARCAS.map((marca) =>
      db.marca.upsert({
        where: { slug: marca.slug },
        update: { nombre: marca.nombre, activo: true },
        create: { nombre: marca.nombre, slug: marca.slug, activo: true },
        select: { id: true, slug: true, nombre: true },
      }),
    ),
  );
  const marcaPorSlug = new Map(marcas.map((marca) => [marca.slug, marca]));

  const faltan = ["hombre", "mujer", "juvenil", "ninos", "bebes"].filter((s) => !idPorSlug.has(s));
  if (faltan.length > 0) {
    throw new Error(`Faltan categorias: ${faltan.join(", ")}. Corre antes: npm run db:seed`);
  }

  for (const p of PRODUCTOS) {
    const categoriaId = idPorSlug.get(p.categoriaSlug);
    const marca = marcaPorSlug.get(p.marcaSlug);
    if (!categoriaId || !marca) continue;
    await sembrarProducto(p, categoriaId, marca.id, almacen.id, marca);
    console.log(`  ${p.categoriaSlug.padEnd(6)} · ${p.nombre}`);
  }

  console.log(`\n${PRODUCTOS.length} productos listos.`);
}

main()
  .catch((error: unknown) => {
    console.error("\nFallo al sembrar el catalogo:\n", error);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });
