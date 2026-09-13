"""Convierte la capa DISTRITO del INEI a JSON compacto para la aplicación.

No requiere GDAL: lee directamente las geometrías WKB guardadas en GeoPackage.
Uso:
  python scripts/convertir-limites-inei.py origen.gpkg destino.json
"""

from __future__ import annotations

import json
import sqlite3
import struct
import sys
from pathlib import Path

TOLERANCIA_GRADOS = 0.0001


def leer_entero(datos: memoryview, posicion: int, endian: str) -> tuple[int, int]:
    return struct.unpack_from(f"{endian}I", datos, posicion)[0], posicion + 4


def leer_punto(datos: memoryview, posicion: int, endian: str) -> tuple[list[float], int]:
    longitud, latitud = struct.unpack_from(f"{endian}dd", datos, posicion)
    return [round(longitud, 6), round(latitud, 6)], posicion + 16


def leer_poligono(datos: memoryview, posicion: int) -> tuple[list[list[list[float]]], int]:
    endian = "<" if datos[posicion] == 1 else ">"
    posicion += 1
    tipo, posicion = leer_entero(datos, posicion, endian)
    if tipo != 3:
        raise ValueError(f"Se esperaba Polygon WKB y se recibió el tipo {tipo}")

    cantidad_anillos, posicion = leer_entero(datos, posicion, endian)
    anillos: list[list[list[float]]] = []
    for _ in range(cantidad_anillos):
        cantidad_puntos, posicion = leer_entero(datos, posicion, endian)
        anillo: list[list[float]] = []
        for _ in range(cantidad_puntos):
            punto, posicion = leer_punto(datos, posicion, endian)
            anillo.append(punto)
        anillos.append(anillo)
    return anillos, posicion


def leer_multipoligono(datos_crudos: bytes) -> list[list[list[list[float]]]]:
    datos = memoryview(datos_crudos)
    if bytes(datos[:2]) != b"GP":
        raise ValueError("La geometría no tiene una cabecera GeoPackage válida")

    banderas = datos[3]
    indicador_envolvente = (banderas >> 1) & 0b111
    dobles_envolvente = {0: 0, 1: 4, 2: 6, 3: 6, 4: 8}.get(indicador_envolvente)
    if dobles_envolvente is None:
        raise ValueError("Tipo de envolvente GeoPackage desconocido")

    posicion = 8 + dobles_envolvente * 8
    endian = "<" if datos[posicion] == 1 else ">"
    posicion += 1
    tipo, posicion = leer_entero(datos, posicion, endian)
    if tipo != 6:
        raise ValueError(f"Se esperaba MultiPolygon WKB y se recibió el tipo {tipo}")

    cantidad_poligonos, posicion = leer_entero(datos, posicion, endian)
    poligonos: list[list[list[list[float]]]] = []
    for _ in range(cantidad_poligonos):
        poligono, posicion = leer_poligono(datos, posicion)
        poligonos.append(poligono)
    return poligonos


def limites(poligonos: list[list[list[list[float]]]]) -> list[float]:
    puntos = (punto for poligono in poligonos for anillo in poligono for punto in anillo)
    primer_punto = next(puntos)
    min_lon = max_lon = primer_punto[0]
    min_lat = max_lat = primer_punto[1]
    for longitud, latitud in puntos:
        min_lon = min(min_lon, longitud)
        min_lat = min(min_lat, latitud)
        max_lon = max(max_lon, longitud)
        max_lat = max(max_lat, latitud)
    return [min_lon, min_lat, max_lon, max_lat]


def distancia_segmento_cuadrada(punto: list[float], inicio: list[float], fin: list[float]) -> float:
    dx = fin[0] - inicio[0]
    dy = fin[1] - inicio[1]
    if dx == 0 and dy == 0:
        return (punto[0] - inicio[0]) ** 2 + (punto[1] - inicio[1]) ** 2
    proporcion = max(
        0.0,
        min(1.0, ((punto[0] - inicio[0]) * dx + (punto[1] - inicio[1]) * dy) / (dx * dx + dy * dy)),
    )
    cercano_x = inicio[0] + proporcion * dx
    cercano_y = inicio[1] + proporcion * dy
    return (punto[0] - cercano_x) ** 2 + (punto[1] - cercano_y) ** 2


def simplificar_linea(puntos: list[list[float]]) -> list[list[float]]:
    if len(puntos) <= 2:
        return puntos
    maxima = 0.0
    indice = 0
    for actual in range(1, len(puntos) - 1):
        distancia = distancia_segmento_cuadrada(puntos[actual], puntos[0], puntos[-1])
        if distancia > maxima:
            maxima = distancia
            indice = actual
    if maxima <= TOLERANCIA_GRADOS**2:
        return [puntos[0], puntos[-1]]
    izquierda = simplificar_linea(puntos[: indice + 1])
    derecha = simplificar_linea(puntos[indice:])
    return izquierda[:-1] + derecha


def simplificar_anillo(anillo: list[list[float]]) -> list[list[float]]:
    abiertos = anillo[:-1] if anillo[0] == anillo[-1] else anillo
    if len(abiertos) <= 3:
        return abiertos + [abiertos[0]]
    ancla = abiertos[0]
    opuesto = max(
        range(1, len(abiertos)),
        key=lambda indice: (abiertos[indice][0] - ancla[0]) ** 2 + (abiertos[indice][1] - ancla[1]) ** 2,
    )
    primera = simplificar_linea(abiertos[: opuesto + 1])
    segunda = simplificar_linea(abiertos[opuesto:] + [ancla])
    simplificado = primera + segunda[1:]
    return simplificado if len(simplificado) >= 4 else anillo


def simplificar(poligonos: list[list[list[list[float]]]]) -> list[list[list[list[float]]]]:
    return [[simplificar_anillo(anillo) for anillo in poligono] for poligono in poligonos]


def convertir(origen: Path, destino: Path) -> None:
    conexion = sqlite3.connect(origen)
    filas = conexion.execute(
        "SELECT geom, ubigeo, nombdist, nombprov, nombdep FROM DISTRITO ORDER BY ubigeo"
    ).fetchall()
    conexion.close()

    distritos = []
    for geometria, ubigeo, distrito, provincia, departamento in filas:
        poligonos = simplificar(leer_multipoligono(geometria))
        distritos.append(
            {
                "u": ubigeo,
                "d": distrito,
                "p": provincia,
                "r": departamento,
                "b": limites(poligonos),
                "g": poligonos,
            }
        )

    destino.parent.mkdir(parents=True, exist_ok=True)
    salida = {
        "fuente": "INEI - Límites distritales actualizados al 2023",
        "precision_aproximada_metros": 12,
        "distritos": distritos,
    }
    destino.write_text(json.dumps(salida, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(distritos)} distritos escritos en {destino} ({destino.stat().st_size:,} bytes)")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Uso: convertir-limites-inei.py origen.gpkg destino.json")
    convertir(Path(sys.argv[1]), Path(sys.argv[2]))
