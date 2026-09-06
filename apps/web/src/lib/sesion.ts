import "server-only";

import { cookies } from "next/headers";

import type { SesionUsuario } from "@appstore/api";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Lectura de sesion SIN viaje de red.
 *
 *  El proyecto anterior usaba @supabase/ssr, que valida la sesion llamando a
 *  Supabase Auth en CADA peticion: 80-200 ms antes de que el codigo llegara
 *  siquiera a tocar la base.
 *
 *  Aqui el JWT se verifica en local con SUPABASE_JWT_SECRET. La firma se
 *  comprueba con criptografia, no preguntando a nadie. Coste: ~0 ms.
 *
 *  Solo se consulta la base para traer rol y permisos, y esa consulta se
 *  cachea por usuario durante la peticion.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export async function leerSesion(): Promise<SesionUsuario | null> {
  const galleta = await cookies();
  const token = galleta.get("sb-access-token")?.value;

  if (!token) return null;

  // F2: verificar el JWT con jose (jwtVerify) contra SUPABASE_JWT_SECRET,
  //     y traer rol + permisos de la base con React.cache para deduplicar.
  return null;
}

/** Igual que `leerSesion` pero lanza si no hay sesion. Para Server Actions. */
export async function exigirSesion(): Promise<SesionUsuario> {
  const sesion = await leerSesion();
  if (!sesion) throw new Error("Sesion requerida.");
  return sesion;
}
