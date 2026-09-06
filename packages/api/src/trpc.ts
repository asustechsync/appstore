// ═══════════════════════════════════════════════════════════════════════════
//  Base de tRPC: contexto y tipos de procedimiento.
//
//  Este es el contrato que comparten la web, el panel y la app movil (F7).
//  El movil no reimplementa nada: importa el mismo `AppRouter` y obtiene
//  autocompletado y tipos de extremo a extremo.
// ═══════════════════════════════════════════════════════════════════════════

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { db } from "@appstore/db";

export interface SesionUsuario {
  usuarioId: string;
  authId: string;
  email: string;
  rol: string;
  permisos: Set<string>;
}

export interface Contexto {
  db: typeof db;
  /** `null` cuando el visitante no ha iniciado sesion. */
  sesion: SesionUsuario | null;
  /** Identifica el carrito de invitado en Redis. */
  idInvitado: string | null;
  ip: string | null;
}

/**
 * Construye el contexto de cada peticion.
 *
 * `resolverSesion` verifica el JWT en local con la clave publica: cero viajes
 * de red. Es lo que quita los 80-200 ms por request del proyecto anterior.
 */
export async function crearContexto(opciones: {
  sesion: SesionUsuario | null;
  idInvitado?: string | null;
  ip?: string | null;
}): Promise<Contexto> {
  return {
    db,
    sesion: opciones.sesion,
    idInvitado: opciones.idInvitado ?? null,
    ip: opciones.ip ?? null,
  };
}

const t = initTRPC.context<Contexto>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Los errores de zod se devuelven campo a campo para que el formulario
        // los pinte donde corresponde.
        errores: error.cause instanceof Error && "issues" in error.cause
          ? (error.cause as { issues: unknown }).issues
          : null,
      },
    };
  },
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

/** Publico: catalogo, busqueda, carrito de invitado. */
export const publico = t.procedure;

/** Exige sesion iniciada. */
export const privado = t.procedure.use(({ ctx, next }) => {
  if (!ctx.sesion) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Inicia sesion para continuar." });
  }
  return next({ ctx: { ...ctx, sesion: ctx.sesion } });
});

/** Exige un permiso concreto del panel. */
export function conPermiso(clave: string) {
  return privado.use(({ ctx, next }) => {
    if (!ctx.sesion.permisos.has(clave)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Tu rol no tiene el permiso "${clave}".`,
      });
    }
    return next();
  });
}
