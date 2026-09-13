import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { resolverDistritoPorCoordenadas, type LimiteDistrital } from "@appstore/core";
import { NextResponse } from "next/server";

interface DatosLimitesDistritales {
  fuente: string;
  precision_aproximada_metros: number;
  distritos: LimiteDistrital[];
}

let limitesCache: Promise<DatosLimitesDistritales> | null = null;

function cargarLimites(): Promise<DatosLimitesDistritales> {
  limitesCache ??= readFile(
    join(process.cwd(), "public", "datos", "ubigeos", "limites-distritales.json"),
    "utf8",
  ).then((contenido) => JSON.parse(contenido) as DatosLimitesDistritales);
  return limitesCache;
}

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const parametroLatitud = url.searchParams.get("lat");
  const parametroLongitud = url.searchParams.get("lon");
  const latitud = Number(parametroLatitud);
  const longitud = Number(parametroLongitud);

  if (
    parametroLatitud === null ||
    parametroLongitud === null ||
    !Number.isFinite(latitud) ||
    !Number.isFinite(longitud) ||
    Math.abs(latitud) > 90 ||
    Math.abs(longitud) > 180
  ) {
    return NextResponse.json({ error: "Coordenadas inválidas." }, { status: 400 });
  }

  try {
    const datos = await cargarLimites();
    const resultado = resolverDistritoPorCoordenadas(latitud, longitud, datos.distritos);

    if (!resultado) {
      return NextResponse.json(
        { error: "La coordenada no corresponde a un distrito registrado del Perú." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ...resultado,
      ubicacion: `${resultado.distrito}, ${resultado.departamento}`,
      atribucion: "Límites distritales del INEI",
    });
  } catch {
    return NextResponse.json({ error: "No se pudo consultar la ubicación local." }, { status: 500 });
  }
}
