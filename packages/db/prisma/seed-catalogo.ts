/**
 * Catalogo de PRUEBA — 6 productos por departamento (Hombre, Mujer, Juvenil,
 * Niños, Bebés). SKUs con prefijo TEMP- porque aun no hay codigos definitivos.
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
const TALLAS_BEBE = ["0-3M", "3-6M", "6-12M"] as const;

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
    nombre: "Polo basico de algodon para hombre",
    slug: "polo-basico-algodon-hombre",
    sku: "TEMP-HOM-001",
    descripcion: "Polo de algodon peinado, corte regular, cuello redondo reforzado. Un basico para todos los dias.",
    descripcionCorta: "Algodon peinado, corte regular",
    precio: 49.9,
    color: "Negro",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 18,
  },
  {
    categoriaSlug: "hombre",
    marcaSlug: "pesail",
    nombre: "Jean slim azul de mezclilla premium",
    slug: "jean-slim-azul-hombre",
    sku: "TEMP-HOM-002",
    descripcion: "Jean de mezclilla elastizada, tiro medio y pierna slim. Azul indigo con lavado ligero.",
    descripcionCorta: "Mezclilla elastizada, tiro medio",
    precio: 139.9,
    precioOferta: 99.9,
    color: "Azul indigo",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 9,
  },
  {
    categoriaSlug: "hombre",
    marcaSlug: "qiling",
    nombre: "Casaca cortavientos impermeable hombre",
    slug: "casaca-cortavientos-hombre",
    sku: "TEMP-HOM-003",
    descripcion: "Casaca ligera resistente al viento, capucha plegable y bolsillos con cierre. Para uso diario.",
    descripcionCorta: "Ligera, resistente al viento",
    precio: 159.9,
    etiqueta: "Nuevo",
    color: "Verde oliva",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 25,
  },
  {
    categoriaSlug: "hombre",
    marcaSlug: "boston",
    nombre: "Camisa a cuadros manga larga hombre",
    slug: "camisa-cuadros-manga-larga-hombre",
    sku: "TEMP-HOM-004",
    descripcion: "Camisa de algodon con estampado a cuadros, corte regular y botones de nacar. Combina en casual y semiformal.",
    descripcionCorta: "Algodon a cuadros, corte regular",
    precio: 79.9,
    color: "Rojo y negro",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 20,
  },
  {
    categoriaSlug: "hombre",
    marcaSlug: "fila",
    nombre: "Pantalon cargo resistente para hombre",
    slug: "pantalon-cargo-hombre",
    sku: "TEMP-HOM-005",
    descripcion: "Pantalon cargo de tela resistente con bolsillos laterales y cintura ajustable con cordon.",
    descripcionCorta: "Tela resistente, bolsillos cargo",
    precio: 129.9,
    precioOferta: 99.9,
    color: "Verde militar",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 15,
  },
  {
    categoriaSlug: "hombre",
    marcaSlug: "amanecer",
    nombre: "Chompa de lana cuello redondo hombre",
    slug: "chompa-lana-cuello-redondo-hombre",
    sku: "TEMP-HOM-006",
    descripcion: "Chompa tejida en lana suave, cuello redondo y puños elasticados. Abriga sin pesar.",
    descripcionCorta: "Lana suave, cuello redondo",
    precio: 99.9,
    color: "Gris melange",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 12,
  },

  // ── Mujer ─────────────────────────────────────────────────────────────────
  {
    categoriaSlug: "mujer",
    marcaSlug: "ciervo-dorado",
    nombre: "Blusa de manga larga elegante mujer",
    slug: "blusa-manga-larga-mujer",
    sku: "TEMP-MUJ-001",
    descripcion: "Blusa fluida de manga larga con punos abotonados. Cae suelta, ideal para oficina o salir.",
    descripcionCorta: "Tejido fluido, punos abotonados",
    precio: 89.9,
    color: "Blanco hueso",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 14,
  },
  {
    categoriaSlug: "mujer",
    marcaSlug: "qiling",
    nombre: "Vestido casual floral de verano mujer",
    slug: "vestido-casual-floral-mujer",
    sku: "TEMP-MUJ-002",
    descripcion: "Vestido midi con estampado floral, cintura ajustable y falda con vuelo. Tela fresca de viscosa.",
    descripcionCorta: "Midi, viscosa, cintura ajustable",
    precio: 169.9,
    precioOferta: 129.9,
    color: "Floral verde",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 7,
  },
  {
    categoriaSlug: "mujer",
    marcaSlug: "fila",
    nombre: "Legging deportivo de compresion mujer",
    slug: "legging-deportivo-mujer",
    sku: "TEMP-MUJ-003",
    descripcion: "Legging de tiro alto con tela compresiva y bolsillo lateral. Ideal para entrenar o salir.",
    descripcionCorta: "Tiro alto, tela compresiva",
    precio: 59.9,
    color: "Negro",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 30,
  },
  {
    categoriaSlug: "mujer",
    marcaSlug: "ciervo-dorado",
    nombre: "Falda midi plisada elegante mujer",
    slug: "falda-midi-plisada-mujer",
    sku: "TEMP-MUJ-004",
    descripcion: "Falda midi plisada con cintura elasticada, cae con movimiento. Facil de combinar.",
    descripcionCorta: "Midi plisada, cintura elasticada",
    precio: 79.9,
    color: "Terracota",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 18,
  },
  {
    categoriaSlug: "mujer",
    marcaSlug: "boston",
    nombre: "Chaqueta de cuero sintetico mujer",
    slug: "chaqueta-cuero-sintetico-mujer",
    sku: "TEMP-MUJ-005",
    descripcion: "Chaqueta biker en cuero sintetico con cierres metalicos y forro interior. Corte entallado.",
    descripcionCorta: "Cuero sintetico, corte entallado",
    precio: 189.9,
    precioOferta: 149.9,
    etiqueta: "Nuevo",
    color: "Negro",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 8,
  },
  {
    categoriaSlug: "mujer",
    marcaSlug: "fila",
    nombre: "Top deportivo con soporte medio mujer",
    slug: "top-deportivo-soporte-medio-mujer",
    sku: "TEMP-MUJ-006",
    descripcion: "Top deportivo de soporte medio, tela transpirable de secado rapido. Ideal para entrenar.",
    descripcionCorta: "Soporte medio, secado rapido",
    precio: 49.9,
    color: "Fucsia",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 26,
  },

  // ── Juvenil ───────────────────────────────────────────────────────────────
  {
    categoriaSlug: "juvenil",
    marcaSlug: "fila",
    nombre: "Hoodie oversize con capucha juvenil",
    slug: "hoodie-oversize-teen",
    sku: "TEMP-JUV-001",
    descripcion: "Buzo con capucha de corte oversize, felpa perchada por dentro, bolsillo canguro. Unisex.",
    descripcionCorta: "Corte oversize, felpa perchada",
    precio: 119.9,
    precioOferta: 89.9,
    color: "Gris jaspe",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 16,
  },
  {
    categoriaSlug: "juvenil",
    marcaSlug: "boston",
    nombre: "Polera estampada serigrafiada juvenil",
    slug: "polera-estampada-teen",
    sku: "TEMP-JUV-002",
    descripcion: "Polera de algodon con estampado frontal serigrafiado. Corte recto, cuello redondo.",
    descripcionCorta: "Algodon, estampado serigrafiado",
    precio: 69.9,
    color: "Verde militar",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 22,
  },
  {
    categoriaSlug: "juvenil",
    marcaSlug: "pesail",
    nombre: "Short jogger deportivo juvenil urbano",
    slug: "short-jogger-teen",
    sku: "TEMP-JUV-003",
    descripcion: "Short de buzo con jareta ajustable y bolsillos laterales. Tela ligera para el dia a dia.",
    descripcionCorta: "Jareta ajustable, tela ligera",
    precio: 79.9,
    color: "Gris grafito",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 11,
  },
  {
    categoriaSlug: "juvenil",
    marcaSlug: "boston",
    nombre: "Camiseta basica de algodon juvenil",
    slug: "camiseta-basica-algodon-teen",
    sku: "TEMP-JUV-004",
    descripcion: "Camiseta basica de algodon suave, corte recto y cuello redondo. Un comodin para el clóset.",
    descripcionCorta: "Algodon suave, corte recto",
    precio: 39.9,
    color: "Blanco",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 30,
  },
  {
    categoriaSlug: "juvenil",
    marcaSlug: "fila",
    nombre: "Casaca bomber juvenil unisex urbana",
    slug: "casaca-bomber-teen",
    sku: "TEMP-JUV-005",
    descripcion: "Casaca bomber con puños y cuello elasticados, cierre frontal y bolsillos laterales. Unisex.",
    descripcionCorta: "Bomber, puños elasticados",
    precio: 149.9,
    precioOferta: 119.9,
    color: "Negro",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 10,
  },
  {
    categoriaSlug: "juvenil",
    marcaSlug: "pesail",
    nombre: "Pantalon jogger deportivo juvenil",
    slug: "pantalon-jogger-teen",
    sku: "TEMP-JUV-006",
    descripcion: "Jogger de tela ligera con jareta y puños ajustados en el tobillo. Bolsillos con cierre.",
    descripcionCorta: "Tela ligera, puños ajustados",
    precio: 89.9,
    color: "Azul marino",
    tallas: TALLAS_ADULTO,
    stockPorTalla: 24,
  },

  // ── Niños ─────────────────────────────────────────────────────────────────
  {
    categoriaSlug: "ninos",
    marcaSlug: "amanecer",
    nombre: "Polo estampado de dinosaurio niños",
    slug: "polo-dinosaurio-kids",
    sku: "TEMP-NIN-001",
    descripcion: "Polo de algodon suave con estampado de dinosaurio. Costuras planas que no irritan la piel.",
    descripcionCorta: "Algodon suave, costuras planas",
    precio: 34.9,
    color: "Celeste",
    tallas: TALLAS_KIDS,
    stockPorTalla: 28,
  },
  {
    categoriaSlug: "ninos",
    marcaSlug: "ciervo-dorado",
    nombre: "Conjunto deportivo de dos piezas niños",
    slug: "conjunto-deportivo-kids",
    sku: "TEMP-NIN-002",
    descripcion: "Conjunto de polera y pantalon de buzo en algodon french terry. Punos y pretina elasticados.",
    descripcionCorta: "Polera + pantalon, french terry",
    precio: 79.9,
    precioOferta: 59.9,
    etiqueta: "Nuevo",
    color: "Azul marino",
    tallas: TALLAS_KIDS,
    stockPorTalla: 13,
  },
  {
    categoriaSlug: "ninos",
    marcaSlug: "boston",
    nombre: "Casaca impermeable con capucha niños",
    slug: "casaca-impermeable-kids",
    sku: "TEMP-NIN-003",
    descripcion: "Casaca impermeable con capucha y cierre frontal. Liviana para llevar en la mochila.",
    descripcionCorta: "Impermeable, liviana",
    precio: 69.9,
    color: "Amarillo",
    tallas: TALLAS_KIDS,
    stockPorTalla: 19,
  },
  {
    categoriaSlug: "ninos",
    marcaSlug: "amanecer",
    nombre: "Pijama de algodon estampado niños",
    slug: "pijama-algodon-estampado-kids",
    sku: "TEMP-NIN-004",
    descripcion: "Pijama de dos piezas en algodon suave con estampado divertido. Costuras planas antirroce.",
    descripcionCorta: "Dos piezas, algodon suave",
    precio: 44.9,
    color: "Azul cielo",
    tallas: TALLAS_KIDS,
    stockPorTalla: 33,
  },
  {
    categoriaSlug: "ninos",
    marcaSlug: "ciervo-dorado",
    nombre: "Chaleco acolchado abrigador para niños",
    slug: "chaleco-acolchado-kids",
    sku: "TEMP-NIN-005",
    descripcion: "Chaleco acolchado sin mangas, relleno termico y cierre frontal. Abriga sin limitar el movimiento.",
    descripcionCorta: "Acolchado, relleno termico",
    precio: 69.9,
    precioOferta: 54.9,
    color: "Rojo",
    tallas: TALLAS_KIDS,
    stockPorTalla: 17,
  },
  {
    categoriaSlug: "ninos",
    marcaSlug: "boston",
    nombre: "Zapatillas urbanas comodas para niños",
    slug: "zapatillas-urbanas-kids",
    sku: "TEMP-NIN-006",
    descripcion: "Zapatillas urbanas con suela flexible y cierre de velcro. Comodas para el dia escolar.",
    descripcionCorta: "Suela flexible, cierre velcro",
    precio: 89.9,
    color: "Blanco y azul",
    tallas: TALLAS_KIDS,
    stockPorTalla: 21,
  },

  // ── Bebés ─────────────────────────────────────────────────────────────────
  {
    categoriaSlug: "bebes",
    marcaSlug: "amanecer",
    nombre: "Body de manga corta para bebés",
    slug: "body-manga-corta-bebes",
    sku: "TEMP-BEB-001",
    descripcion: "Body de algodon pima con broches en la entrepierna, manga corta. Suave para piel sensible.",
    descripcionCorta: "Algodon pima, broches faciles",
    precio: 29.9,
    color: "Blanco",
    tallas: TALLAS_BEBE,
    stockPorTalla: 40,
  },
  {
    categoriaSlug: "bebes",
    marcaSlug: "ciervo-dorado",
    nombre: "Conjunto de algodón suave para bebés",
    slug: "conjunto-algodon-bebes",
    sku: "TEMP-BEB-002",
    descripcion: "Conjunto de dos piezas en algodon suave, con abertura para facilitar el cambio de panal.",
    descripcionCorta: "Dos piezas, algodon suave",
    precio: 49.9,
    precioOferta: 39.9,
    color: "Rosa palo",
    tallas: TALLAS_BEBE,
    stockPorTalla: 20,
  },
  {
    categoriaSlug: "bebes",
    marcaSlug: "qiling",
    nombre: "Gorro y mitones tejidos para bebés",
    slug: "gorro-mitones-bebes",
    sku: "TEMP-BEB-003",
    descripcion: "Set de gorro y mitones tejidos, elastico suave que no marca. Abriga sin apretar.",
    descripcionCorta: "Set tejido, elastico suave",
    precio: 19.9,
    etiqueta: "Nuevo",
    color: "Beige",
    tallas: TALLAS_BEBE,
    stockPorTalla: 35,
  },
  {
    categoriaSlug: "bebes",
    marcaSlug: "amanecer",
    nombre: "Pijama enteriza de algodon para bebés",
    slug: "pijama-enteriza-algodon-bebes",
    sku: "TEMP-BEB-004",
    descripcion: "Pijama enteriza con broches de pie a cuello, algodon suave y transpirable. Facil cambio de panal.",
    descripcionCorta: "Enteriza, algodon transpirable",
    precio: 34.9,
    color: "Celeste",
    tallas: TALLAS_BEBE,
    stockPorTalla: 45,
  },
  {
    categoriaSlug: "bebes",
    marcaSlug: "qiling",
    nombre: "Babero impermeable con broches bebés",
    slug: "babero-impermeable-bebes",
    sku: "TEMP-BEB-005",
    descripcion: "Babero impermeable con broches ajustables y reverso absorbente. Facil de limpiar.",
    descripcionCorta: "Impermeable, reverso absorbente",
    precio: 14.9,
    precioOferta: 11.9,
    color: "Amarillo",
    tallas: TALLAS_BEBE,
    stockPorTalla: 50,
  },
  {
    categoriaSlug: "bebes",
    marcaSlug: "ciervo-dorado",
    nombre: "Mameluco manga larga suave para bebés",
    slug: "mameluco-manga-larga-bebes",
    sku: "TEMP-BEB-006",
    descripcion: "Mameluco de manga larga en algodon perchado, broches en la entrepierna. Abriga y no irrita.",
    descripcionCorta: "Algodon perchado, manga larga",
    precio: 39.9,
    color: "Gris perla",
    tallas: TALLAS_BEBE,
    stockPorTalla: 28,
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
