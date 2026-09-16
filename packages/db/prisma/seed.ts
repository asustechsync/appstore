/**
 * Semillas: lo minimo para que el sistema arranque operable.
 * Es idempotente — se puede correr las veces que haga falta.
 *
 *   npm run db:seed
 */

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";

config({ path: join(dirname(fileURLToPath(import.meta.url)), "../../../.env.local") });

const { db } = await import("../src/index.js");

// ── Permisos ────────────────────────────────────────────────────────────────
const PERMISOS: Array<{ clave: string; grupo: string; descripcion: string }> = [
  { clave: "productos.ver", grupo: "Catalogo", descripcion: "Ver productos" },
  { clave: "productos.crear", grupo: "Catalogo", descripcion: "Crear productos" },
  { clave: "productos.editar", grupo: "Catalogo", descripcion: "Editar productos" },
  { clave: "productos.eliminar", grupo: "Catalogo", descripcion: "Eliminar productos" },
  { clave: "categorias.gestionar", grupo: "Catalogo", descripcion: "Gestionar categorias y marcas" },

  { clave: "stock.ver", grupo: "Inventario", descripcion: "Ver stock y kardex" },
  { clave: "stock.editar", grupo: "Inventario", descripcion: "Ajustar stock" },

  { clave: "pedidos.ver", grupo: "Ventas", descripcion: "Ver pedidos" },
  { clave: "pedidos.editar", grupo: "Ventas", descripcion: "Cambiar estado de pedidos" },
  { clave: "pedidos.despachar", grupo: "Ventas", descripcion: "Despachar y asignar guia" },
  { clave: "pedidos.cancelar", grupo: "Ventas", descripcion: "Cancelar pedidos" },

  { clave: "pagos.ver", grupo: "Finanzas", descripcion: "Ver pagos" },
  { clave: "pagos.conciliar", grupo: "Finanzas", descripcion: "Confirmar pagos manuales" },
  { clave: "pagos.reembolsar", grupo: "Finanzas", descripcion: "Emitir reembolsos" },
  { clave: "comprobantes.emitir", grupo: "Finanzas", descripcion: "Emitir boletas y facturas" },
  { clave: "comprobantes.anular", grupo: "Finanzas", descripcion: "Anular comprobantes" },

  { clave: "promociones.gestionar", grupo: "Marketing", descripcion: "Promociones y cupones" },

  { clave: "clientes.ver", grupo: "Clientes", descripcion: "Ver clientes" },
  { clave: "resenas.moderar", grupo: "Clientes", descripcion: "Aprobar y responder resenas" },

  { clave: "usuarios.gestionar", grupo: "Sistema", descripcion: "Usuarios, roles y permisos" },
  { clave: "reportes.ver", grupo: "Sistema", descripcion: "Reportes de venta y margen" },
  { clave: "auditoria.ver", grupo: "Sistema", descripcion: "Bitacora de cambios" },
];

// ── Roles y que permisos lleva cada uno ─────────────────────────────────────
const ROLES: Array<{ nombre: string; descripcion: string; permisos: "*" | string[] }> = [
  { nombre: "ADMIN", descripcion: "Control total", permisos: "*" },
  { nombre: "CLIENTE", descripcion: "Comprador de la tienda", permisos: [] },
  {
    nombre: "VENTAS",
    descripcion: "Atiende pedidos y clientes",
    permisos: [
      "productos.ver", "stock.ver", "pedidos.ver", "pedidos.editar",
      "pedidos.cancelar", "pagos.ver", "pagos.conciliar",
      "clientes.ver", "resenas.moderar", "promociones.gestionar",
    ],
  },
  {
    nombre: "ALMACEN",
    descripcion: "Controla inventario",
    permisos: ["productos.ver", "stock.ver", "stock.editar", "pedidos.ver"],
  },
  {
    nombre: "DESPACHO",
    descripcion: "Prepara y despacha envios",
    permisos: ["pedidos.ver", "pedidos.despachar", "stock.ver"],
  },
];

// ── Zonas de envio (Peru) ───────────────────────────────────────────────────
const ZONAS: Array<{ nombre: string; departamentos: string[] }> = [
  { nombre: "Lima Metropolitana", departamentos: ["Lima", "Callao"] },
  { nombre: "Costa Norte", departamentos: ["Tumbes", "Piura", "Lambayeque", "La Libertad"] },
  { nombre: "Costa Sur", departamentos: ["Ica", "Arequipa", "Moquegua", "Tacna"] },
  {
    nombre: "Sierra",
    departamentos: [
      "Ancash", "Cajamarca", "Huanuco", "Pasco", "Junin",
      "Huancavelica", "Ayacucho", "Apurimac", "Cusco", "Puno",
    ],
  },
  {
    nombre: "Selva",
    departamentos: ["Amazonas", "San Martin", "Loreto", "Ucayali", "Madre de Dios"],
  },
];

// ── Categorias raiz (departamentos de la tienda) ────────────────────────────
const CATEGORIAS: Array<{
  nombre: string;
  slug: string;
  orden: number;
  descripcion: string;
}> = [
  { nombre: "Hombre", slug: "hombre", orden: 1, descripcion: "Ropa y accesorios para hombre" },
  { nombre: "Mujer", slug: "mujer", orden: 2, descripcion: "Ropa y accesorios para mujer" },
  { nombre: "Juvenil", slug: "juvenil", orden: 3, descripcion: "Moda juvenil" },
  { nombre: "Niños", slug: "ninos", orden: 4, descripcion: "Ropa para ninas y ninos" },
  { nombre: "Bebés", slug: "bebes", orden: 5, descripcion: "Ropa y accesorios para bebés" },
];

const METODOS_ENVIO = [
  { clave: "SHALOM", nombre: "Shalom", tipo: "AGENCIA" as const, orden: 1 },
  { clave: "OLVA", nombre: "Olva Courier", tipo: "AGENCIA" as const, orden: 2 },
  { clave: "DELIVERY_LIMA", nombre: "Delivery a domicilio", tipo: "DOMICILIO" as const, orden: 3 },
  { clave: "RECOJO", nombre: "Recojo en tienda", tipo: "RECOJO" as const, orden: 4 },
];

// Precio por metodo y zona. `null` = ese metodo no cubre esa zona.
const TARIFAS: Record<string, Record<string, number | null>> = {
  SHALOM: { "Lima Metropolitana": 12, "Costa Norte": 18, "Costa Sur": 18, Sierra: 22, Selva: 28 },
  OLVA: { "Lima Metropolitana": 15, "Costa Norte": 22, "Costa Sur": 22, Sierra: 26, Selva: 32 },
  DELIVERY_LIMA: { "Lima Metropolitana": 10, "Costa Norte": null, "Costa Sur": null, Sierra: null, Selva: null },
  RECOJO: { "Lima Metropolitana": 0, "Costa Norte": null, "Costa Sur": null, Sierra: null, Selva: null },
};

async function main(): Promise<void> {
  console.log("Sembrando...");

  // ── Permisos ──────────────────────────────────────────────────────────────
  for (const p of PERMISOS) {
    await db.permiso.upsert({
      where: { clave: p.clave },
      update: { grupo: p.grupo, descripcion: p.descripcion },
      create: p,
    });
  }
  console.log(`  permisos: ${PERMISOS.length}`);

  // ── Roles ─────────────────────────────────────────────────────────────────
  const todos = await db.permiso.findMany({ select: { id: true, clave: true } });
  const porClave = new Map(todos.map((p) => [p.clave, p.id]));

  for (const r of ROLES) {
    const rol = await db.rol.upsert({
      where: { nombre: r.nombre },
      update: { descripcion: r.descripcion },
      create: { nombre: r.nombre, descripcion: r.descripcion },
    });

    const claves = r.permisos === "*" ? todos.map((p) => p.clave) : r.permisos;

    await db.rolPermiso.deleteMany({ where: { rolId: rol.id } });
    if (claves.length > 0) {
      await db.rolPermiso.createMany({
        data: claves
          .map((c) => porClave.get(c))
          .filter((id): id is string => Boolean(id))
          .map((permisoId) => ({ rolId: rol.id, permisoId })),
        skipDuplicates: true,
      });
    }
  }
  console.log(`  roles: ${ROLES.length}`);

  // ── Almacen principal ─────────────────────────────────────────────────────
  await db.almacen.upsert({
    where: { clave: "PRINCIPAL" },
    update: {},
    create: {
      clave: "PRINCIPAL",
      nombre: "Almacen principal",
      esPrincipal: true,
      departamento: "Lima",
      provincia: "Lima",
    },
  });
  console.log("  almacen: PRINCIPAL");

  // ── Categorias raiz ───────────────────────────────────────────────────────
  for (const c of CATEGORIAS) {
    await db.categoria.upsert({
      where: { slug: c.slug },
      update: { nombre: c.nombre, orden: c.orden, descripcion: c.descripcion, destacada: true, activo: true },
      create: {
        nombre: c.nombre,
        slug: c.slug,
        orden: c.orden,
        descripcion: c.descripcion,
        destacada: true,
        tituloSeo: `${c.nombre} | appstore`,
      },
    });
  }
  console.log(`  categorias: ${CATEGORIAS.length}`);

  // ── Zonas y metodos de envio ──────────────────────────────────────────────
  const zonas = new Map<string, string>();
  for (const z of ZONAS) {
    const existente = await db.zonaEnvio.findFirst({ where: { nombre: z.nombre } });
    const zona = existente
      ? await db.zonaEnvio.update({
          where: { id: existente.id },
          data: { departamentos: z.departamentos },
        })
      : await db.zonaEnvio.create({ data: z });
    zonas.set(z.nombre, zona.id);
  }

  for (const m of METODOS_ENVIO) {
    const metodo = await db.metodoEnvio.upsert({
      where: { clave: m.clave },
      update: { nombre: m.nombre, tipo: m.tipo, orden: m.orden },
      create: m,
    });

    for (const [nombreZona, precio] of Object.entries(TARIFAS[m.clave] ?? {})) {
      const zonaId = zonas.get(nombreZona);
      if (!zonaId || precio === null) continue;

      await db.tarifaEnvio.upsert({
        where: { metodoId_zonaId: { metodoId: metodo.id, zonaId } },
        update: { precio },
        create: {
          metodoId: metodo.id,
          zonaId,
          precio,
          // Envio gratis sobre S/ 150 en Lima
          gratisDesde: nombreZona === "Lima Metropolitana" ? 150 : null,
          diasMin: nombreZona === "Lima Metropolitana" ? 1 : 3,
          diasMax: nombreZona === "Lima Metropolitana" ? 2 : 7,
        },
      });
    }
  }
  console.log(`  envios: ${ZONAS.length} zonas, ${METODOS_ENVIO.length} metodos`);

  // ── Series de comprobante (F6) ────────────────────────────────────────────
  for (const s of [
    { tipo: "BOLETA" as const, serie: "B001" },
    { tipo: "FACTURA" as const, serie: "F001" },
    { tipo: "NOTA_CREDITO" as const, serie: "BC01" },
  ]) {
    await db.serieComprobante.upsert({
      where: { tipo_serie: { tipo: s.tipo, serie: s.serie } },
      update: {},
      create: s,
    });
  }
  console.log("  series de comprobante: 3");

  console.log("\nListo.");
}

main()
  .catch((error: unknown) => {
    console.error("\nFallo al sembrar:\n", error);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });
