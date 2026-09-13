export type PuntoGeografico = [longitud: number, latitud: number];
export type AnilloGeografico = PuntoGeografico[];
export type PoligonoGeografico = AnilloGeografico[];
export type MultiPoligonoGeografico = PoligonoGeografico[];

export interface LimiteDistrital {
  u: string;
  d: string;
  p: string;
  r: string;
  b: [minLongitud: number, minLatitud: number, maxLongitud: number, maxLatitud: number];
  g: MultiPoligonoGeografico;
}

export interface DistritoResuelto {
  ubigeo: string;
  distrito: string;
  provincia: string;
  departamento: string;
}

function puntoSobreSegmento(punto: PuntoGeografico, inicio: PuntoGeografico, fin: PuntoGeografico): boolean {
  const [x, y] = punto;
  const productoCruzado = (y - inicio[1]) * (fin[0] - inicio[0]) - (x - inicio[0]) * (fin[1] - inicio[1]);
  if (Math.abs(productoCruzado) > 1e-10) return false;
  return (
    x >= Math.min(inicio[0], fin[0]) &&
    x <= Math.max(inicio[0], fin[0]) &&
    y >= Math.min(inicio[1], fin[1]) &&
    y <= Math.max(inicio[1], fin[1])
  );
}

function puntoEnAnillo(punto: PuntoGeografico, anillo: AnilloGeografico): boolean {
  let dentro = false;
  for (let actual = 0, anterior = anillo.length - 1; actual < anillo.length; anterior = actual++) {
    const inicio = anillo[anterior];
    const fin = anillo[actual];
    if (!inicio || !fin) continue;
    if (puntoSobreSegmento(punto, inicio, fin)) return true;

    const cruza =
      inicio[1] > punto[1] !== fin[1] > punto[1] &&
      punto[0] < ((fin[0] - inicio[0]) * (punto[1] - inicio[1])) / (fin[1] - inicio[1]) + inicio[0];
    if (cruza) dentro = !dentro;
  }
  return dentro;
}

function puntoEnPoligono(punto: PuntoGeografico, poligono: PoligonoGeografico): boolean {
  const exterior = poligono[0];
  if (!exterior || !puntoEnAnillo(punto, exterior)) return false;
  return poligono.slice(1).every((hueco) => !puntoEnAnillo(punto, hueco));
}

function dentroDeCaja(punto: PuntoGeografico, caja: LimiteDistrital["b"]): boolean {
  return punto[0] >= caja[0] && punto[0] <= caja[2] && punto[1] >= caja[1] && punto[1] <= caja[3];
}

export function resolverDistritoPorCoordenadas(
  latitud: number,
  longitud: number,
  limites: readonly LimiteDistrital[],
): DistritoResuelto | null {
  if (!Number.isFinite(latitud) || !Number.isFinite(longitud) || Math.abs(latitud) > 90 || Math.abs(longitud) > 180) {
    return null;
  }

  const punto: PuntoGeografico = [longitud, latitud];
  const limite = limites.find(
    (candidato) => dentroDeCaja(punto, candidato.b) && candidato.g.some((poligono) => puntoEnPoligono(punto, poligono)),
  );

  return limite
    ? { ubigeo: limite.u, distrito: limite.d, provincia: limite.p, departamento: limite.r }
    : null;
}
