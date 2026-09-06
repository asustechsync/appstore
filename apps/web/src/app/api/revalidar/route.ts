import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Puente de invalidacion: panel -> tienda.
 *
 *  El panel y la tienda son dos aplicaciones distintas, asi que el panel no
 *  puede invalidar la cache de la tienda directamente. Cuando se guarda un
 *  producto, el panel llama aqui con las etiquetas afectadas.
 *
 *  Se usa `revalidateTag(etiqueta, "max")` y no `updateTag` porque:
 *    · `updateTag` SOLO funciona dentro de Server Actions, no en rutas.
 *    · Con perfil "max" se sirve lo cacheado mientras se regenera detras
 *      (stale-while-revalidate): nadie ve una pagina en blanco esperando.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export async function POST(peticion: Request) {
  const secreto = peticion.headers.get("x-revalidar-secreto");

  if (!secreto || secreto !== process.env["REVALIDATE_SECRET"]) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let cuerpo: { etiquetas?: unknown };
  try {
    cuerpo = (await peticion.json()) as { etiquetas?: unknown };
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON invalido." }, { status: 400 });
  }

  const etiquetas = cuerpo.etiquetas;

  if (!Array.isArray(etiquetas) || etiquetas.some((e) => typeof e !== "string")) {
    return NextResponse.json(
      { error: "Envia { etiquetas: string[] }." },
      { status: 400 },
    );
  }

  // Las etiquetas tienen un limite de 256 caracteres.
  const validas = (etiquetas as string[]).filter((e) => e.length > 0 && e.length <= 256);

  for (const etiqueta of validas) {
    revalidateTag(etiqueta, "max");
  }

  return NextResponse.json({ invalidadas: validas.length, etiquetas: validas });
}
