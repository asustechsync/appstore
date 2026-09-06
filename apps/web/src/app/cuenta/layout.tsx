import { redirect } from "next/navigation";

import { leerSesion } from "@/lib/sesion";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CLASE C — Mi cuenta. Presupuesto: 0 ms de navegacion.
 *
 *  Aqui esta el arreglo del problema principal del proyecto anterior.
 *
 *  ANTES: cada clic en "Mis pedidos" o "Direcciones" era un render de
 *  servidor completo — middleware, validacion de sesion contra Supabase,
 *  consulta a la base, HTML nuevo. Unos 300-400 ms por clic.
 *
 *  AHORA: este layout se ejecuta UNA vez. Verifica el JWT en local con la
 *  clave publica (cero viajes de red) y monta el shell. A partir de ahi la
 *  navegacion entre secciones es del router del cliente y los datos salen
 *  de la cache de TanStack Query: 0 ms, sin tocar el servidor.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default async function LayoutCuenta({ children }: { children: React.ReactNode }) {
  const sesion = await leerSesion();

  if (!sesion) redirect("/ingresar?destino=/cuenta");

  return (
    <div>
      {/* F2: <MenuCuenta /> — se pinta una vez y no se vuelve a montar */}
      {children}
    </div>
  );
}
