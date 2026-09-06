// ═══════════════════════════════════════════════════════════════════════════
//  Esquemas compartidos (zod).
//
//  Un solo esquema valida el formulario en el navegador, la mutacion en la
//  API y la pantalla de la app movil. Si cambia una regla, cambia en los tres.
// ═══════════════════════════════════════════════════════════════════════════

import { z } from "zod";

// ── Documentos de identidad (Peru) ─────────────────────────────────────────

export const dni = z
  .string()
  .regex(/^\d{8}$/, "El DNI debe tener 8 digitos.");

export const ruc = z
  .string()
  .regex(/^(10|15|17|20)\d{9}$/, "El RUC debe tener 11 digitos y empezar en 10, 15, 17 o 20.");

export const carnetExtranjeria = z
  .string()
  .regex(/^[A-Za-z0-9]{9,12}$/, "Carnet de extranjeria invalido.");

export const telefonoPeru = z
  .string()
  .regex(/^9\d{8}$/, "El celular debe tener 9 digitos y empezar en 9.");

// ── Direccion ──────────────────────────────────────────────────────────────

export const esquemaDireccion = z.object({
  destinatario: z.string().min(3, "Escribe el nombre de quien recibe."),
  telefono: telefonoPeru,
  departamento: z.string().min(1, "Elige un departamento."),
  provincia: z.string().min(1, "Elige una provincia."),
  distrito: z.string().min(1, "Elige un distrito."),
  direccion: z.string().min(5, "Escribe la direccion completa."),
  codigoPostal: z.string().optional(),
  referencia: z.string().max(200).optional(),
  predeterminada: z.boolean().default(false),
});

export type Direccion = z.infer<typeof esquemaDireccion>;

// ── Datos de facturacion ───────────────────────────────────────────────────
// Se piden en el checkout DESDE F3, aunque la emision llegue en F6.

export const esquemaFacturacion = z
  .discriminatedUnion("tipoComprobante", [
    z.object({
      tipoComprobante: z.literal("BOLETA"),
      receptorTipoDoc: z.literal("DNI"),
      receptorNumDoc: dni,
      receptorNombre: z.string().min(3, "Escribe tu nombre completo."),
    }),
    z.object({
      tipoComprobante: z.literal("FACTURA"),
      receptorTipoDoc: z.literal("RUC"),
      receptorNumDoc: ruc,
      receptorNombre: z.string().min(3, "Escribe la razon social."),
      receptorDireccion: z.string().min(5, "La factura necesita el domicilio fiscal."),
    }),
  ]);

export type DatosFacturacion = z.infer<typeof esquemaFacturacion>;

// ── Carrito y checkout ─────────────────────────────────────────────────────

export const esquemaItemCarrito = z.object({
  varianteId: z.string().uuid(),
  cantidad: z.number().int().min(1).max(99),
});

export const esquemaCheckout = z.object({
  items: z.array(esquemaItemCarrito).min(1, "El carrito esta vacio."),
  direccionId: z.string().uuid().optional(),
  direccionNueva: esquemaDireccion.optional(),
  metodoEnvioId: z.string().uuid(),
  metodoPago: z.enum(["TARJETA", "YAPE", "PLIN", "TRANSFERENCIA", "EFECTIVO", "CONTRAENTREGA"]),
  cupon: z.string().trim().toUpperCase().optional(),
  facturacion: esquemaFacturacion,
  notaCliente: z.string().max(500).optional(),
})
  .refine((d) => d.direccionId || d.direccionNueva, {
    message: "Elige una direccion de envio.",
    path: ["direccionId"],
  });

export type EntradaCheckout = z.infer<typeof esquemaCheckout>;

// ── Catalogo (filtros de la tienda) ────────────────────────────────────────

export const esquemaFiltrosCatalogo = z.object({
  categoria: z.string().optional(),
  marca: z.string().optional(),
  q: z.string().max(120).optional(),
  precioMin: z.coerce.number().min(0).optional(),
  precioMax: z.coerce.number().min(0).optional(),
  soloOfertas: z.coerce.boolean().default(false),
  soloDisponibles: z.coerce.boolean().default(true),
  /** { talla: ["S","M"], color: ["Negro"] } */
  facetas: z.record(z.string(), z.array(z.string())).default({}),
  orden: z.enum(["relevancia", "precio_asc", "precio_desc", "nuevos", "descuento"]).default("relevancia"),
  pagina: z.coerce.number().int().min(1).default(1),
  porPagina: z.coerce.number().int().min(1).max(60).default(24),
});

export type FiltrosCatalogo = z.infer<typeof esquemaFiltrosCatalogo>;

// ── Panel: producto ────────────────────────────────────────────────────────

export const esquemaProducto = z.object({
  nombre: z.string().min(3, "El nombre es obligatorio."),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Solo minusculas, numeros y guiones."),
  descripcion: z.string().min(10, "Escribe una descripcion."),
  descripcionCorta: z.string().max(200).optional(),
  sku: z.string().min(1, "El SKU es obligatorio."),
  precio: z.number().positive("El precio debe ser mayor que cero."),
  precioOferta: z.number().positive().nullable().optional(),
  costo: z.number().nonnegative().nullable().optional(),
  categoriaId: z.string().uuid("Elige una categoria."),
  marcaId: z.string().uuid().nullable().optional(),
  afectacionIgv: z.enum(["GRAVADO", "EXONERADO", "INAFECTO"]).default("GRAVADO"),
  activo: z.boolean().default(true),
  destacado: z.boolean().default(false),
  borrador: z.boolean().default(true),
})
  .refine((p) => !p.precioOferta || p.precioOferta < p.precio, {
    message: "La oferta tiene que ser menor que el precio de lista.",
    path: ["precioOferta"],
  });

export type EntradaProducto = z.infer<typeof esquemaProducto>;

// ── Cuenta ─────────────────────────────────────────────────────────────────

export const esquemaRegistro = z.object({
  nombre: z.string().min(2, "Escribe tu nombre."),
  apellidoPaterno: z.string().min(2, "Escribe tu apellido.").optional(),
  email: z.email("Correo invalido."),
  password: z.string().min(8, "Minimo 8 caracteres."),
  telefono: telefonoPeru.optional(),
});

export const esquemaIngreso = z.object({
  email: z.email("Correo invalido."),
  password: z.string().min(1, "Escribe tu contrasena."),
});

export type EntradaRegistro = z.infer<typeof esquemaRegistro>;
export type EntradaIngreso = z.infer<typeof esquemaIngreso>;
