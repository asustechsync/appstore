"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Selector } from "./Selector";

import "./primitivos.css";

const CLAVE_UBICACION = "appstore:ubicacion-actual:v3";
const DURACION_UBICACION = 24 * 60 * 60 * 1_000;
const PRECISION_MAXIMA_METROS = 2_000;

interface Departamento {
  id: number;
  departamento: string;
  ubigeo: string;
}

interface Provincia {
  id: number;
  provincia: string;
  departamento_id: number;
}

interface Distrito {
  id: number;
  distrito: string;
  provincia_id: number;
  ubigeo: string;
}

let departamentosCache: Promise<Departamento[]> | null = null;
let provinciasCache: Promise<Provincia[]> | null = null;
let distritosCache: Promise<Distrito[]> | null = null;

async function cargarCatalogo<T>(ruta: string, llave: string): Promise<T[]> {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) throw new Error("No se pudo cargar el catálogo de ubicaciones");
  const datos = (await respuesta.json()) as Record<string, T[]>;
  return datos[llave] ?? [];
}

function cargarDepartamentos(): Promise<Departamento[]> {
  departamentosCache ??= cargarCatalogo(
    "/datos/ubigeos/1_ubigeo_departamentos.json",
    "ubigeo_departamentos",
  );
  return departamentosCache;
}

function cargarProvincias(): Promise<Provincia[]> {
  provinciasCache ??= cargarCatalogo(
    "/datos/ubigeos/2_ubigeo_provincias.json",
    "ubigeo_provincias",
  );
  return provinciasCache;
}

function cargarDistritos(): Promise<Distrito[]> {
  distritosCache ??= cargarCatalogo(
    "/datos/ubigeos/3_ubigeo_distritos.json",
    "ubigeo_distritos",
  );
  return distritosCache;
}

interface UbicacionGuardada {
  texto: string;
  atribucion?: string;
  guardadaEn: number;
}

export interface PropsUbicacionActual {
  textoPredeterminado?: string;
}

/**
 * Isla cliente que solicita la ubicacion al navegador y muestra distrito/ciudad.
 * La coordenada no se persiste: solo se guarda el nombre visible durante 24 h.
 */
export function UbicacionActual({ textoPredeterminado = "Ubicación" }: PropsUbicacionActual) {
  const deteccionAutomaticaIniciada = useRef(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const [texto, setTexto] = useState(textoPredeterminado);
  const [consultando, setConsultando] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState("Detectar mi ubicación");
  const [abierto, setAbierto] = useState(false);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [departamentoId, setDepartamentoId] = useState("");
  const [provinciaId, setProvinciaId] = useState("");
  const [distritoId, setDistritoId] = useState("");
  const [errorCatalogo, setErrorCatalogo] = useState("");

  const detectar = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setMensajeEstado("La geolocalización no está disponible en este navegador");
      return;
    }

    setConsultando(true);
    setMensajeEstado("Detectando ubicación…");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (coords.accuracy > PRECISION_MAXIMA_METROS) {
          const margen = Math.ceil(coords.accuracy / 1_000);
          setConsultando(false);
          setMensajeEstado(`La ubicación del dispositivo tiene un margen aproximado de ${margen} km`);
          setErrorCatalogo(
            `La ubicación automática tiene un margen aproximado de ${margen} km. Confirma tu distrito manualmente.`,
          );
          setAbierto(true);
          cargarDepartamentos()
            .then(setDepartamentos)
            .catch(() => setErrorCatalogo("No pudimos cargar las ubicaciones."));
          return;
        }

        try {
          const parametros = new URLSearchParams({
            lat: coords.latitude.toFixed(5),
            lon: coords.longitude.toFixed(5),
          });
          const respuesta = await fetch(`/api/ubicacion?${parametros.toString()}`, {
            headers: { Accept: "application/json" },
          });

          if (!respuesta.ok) throw new Error("No se pudo resolver la ubicación");

          const datos = (await respuesta.json()) as { ubicacion?: string; atribucion?: string };
          if (!datos.ubicacion) throw new Error("La respuesta no contiene una ubicación");

          const atribucion = datos.atribucion ?? "Límites distritales locales";
          setTexto(datos.ubicacion);
          setMensajeEstado(`${datos.ubicacion}. ${atribucion}`);
          setAbierto(false);
          try {
            const ubicacionGuardada: UbicacionGuardada = {
              texto: datos.ubicacion,
              atribucion,
              guardadaEn: Date.now(),
            };
            localStorage.setItem(CLAVE_UBICACION, JSON.stringify(ubicacionGuardada));
          } catch {
            // El navegador puede bloquear el almacenamiento; la ubicacion aun sirve en esta visita.
          }
        } catch {
          setMensajeEstado("No pudimos obtener el nombre de tu ubicación. Inténtalo nuevamente");
        } finally {
          setConsultando(false);
        }
      },
      (error) => {
        setConsultando(false);
        setMensajeEstado(
          error.code === error.PERMISSION_DENIED
            ? "Permiso de ubicación denegado. Puedes habilitarlo en tu navegador"
            : "No pudimos detectar tu ubicación. Inténtalo nuevamente",
        );
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    );
  }, []);

  useEffect(() => {
    try {
      const guardada = localStorage.getItem(CLAVE_UBICACION);
      if (guardada) {
        const ubicacion = JSON.parse(guardada) as UbicacionGuardada;
        if (ubicacion.texto && Date.now() - ubicacion.guardadaEn < DURACION_UBICACION) {
          setTexto(ubicacion.texto);
          setMensajeEstado(`${ubicacion.texto}. ${ubicacion.atribucion ?? "Ubicación guardada"}`);
          return;
        }
      }
    } catch {
      localStorage.removeItem(CLAVE_UBICACION);
    }

    if (!deteccionAutomaticaIniciada.current) {
      deteccionAutomaticaIniciada.current = true;
      detectar();
    }
  }, [detectar]);

  useEffect(() => {
    if (!abierto) return;

    function cerrarAlInteractuarFuera(evento: MouseEvent) {
      if (evento.target instanceof Node && !contenedor.current?.contains(evento.target)) {
        setAbierto(false);
      }
    }

    function cerrarConEscape(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAbierto(false);
    }

    document.addEventListener("mousedown", cerrarAlInteractuarFuera);
    document.addEventListener("keydown", cerrarConEscape);
    return () => {
      document.removeEventListener("mousedown", cerrarAlInteractuarFuera);
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [abierto]);

  const abrirSelector = useCallback(() => {
    setAbierto((valor) => !valor);
    setErrorCatalogo("");
    if (departamentos.length === 0) {
      cargarDepartamentos()
        .then(setDepartamentos)
        .catch(() => setErrorCatalogo("No pudimos cargar las ubicaciones."));
    }
  }, [departamentos.length]);

  function elegirDepartamento(valor: string) {
    setDepartamentoId(valor);
    setProvinciaId("");
    setDistritoId("");
    setDistritos([]);
    if (!valor) {
      setProvincias([]);
      return;
    }
    cargarProvincias()
      .then((datos) => setProvincias(datos.filter((item) => item.departamento_id === Number(valor))))
      .catch(() => setErrorCatalogo("No pudimos cargar las provincias."));
  }

  function elegirProvincia(valor: string) {
    setProvinciaId(valor);
    setDistritoId("");
    if (!valor) {
      setDistritos([]);
      return;
    }
    cargarDistritos()
      .then((datos) => setDistritos(datos.filter((item) => item.provincia_id === Number(valor))))
      .catch(() => setErrorCatalogo("No pudimos cargar los distritos."));
  }

  function guardarUbicacionManual() {
    const departamento = departamentos.find((item) => item.id === Number(departamentoId));
    const distrito = distritos.find((item) => item.id === Number(distritoId));
    if (!departamento || !distrito) return;

    const ubicacion = `${distrito.distrito}, ${departamento.departamento}`;
    setTexto(ubicacion);
    setMensajeEstado(`${ubicacion}. Ubicación elegida manualmente`);
    setAbierto(false);
    try {
      const ubicacionGuardada: UbicacionGuardada = {
        texto: ubicacion,
        atribucion: "Ubicación elegida manualmente",
        guardadaEn: Date.now(),
      };
      localStorage.setItem(CLAVE_UBICACION, JSON.stringify(ubicacionGuardada));
    } catch {
      // La seleccion sigue activa durante esta visita aunque no haya almacenamiento.
    }
  }

  return (
    <div ref={contenedor} className="ui-ubicacion">
      <button
        type="button"
        className="ui-cabecera__envio"
        onClick={abrirSelector}
        aria-expanded={abierto}
        aria-haspopup="dialog"
        aria-label={mensajeEstado}
        title={mensajeEstado}
      >
        <span className="ui-cabecera__icono ui-cabecera__icono--ubicacion" aria-hidden="true" />
        <span className="ui-cabecera__envio-texto">{texto}</span>
      </button>

      {abierto ? (
        <div className="ui-ubicacion__panel" role="dialog" aria-label="Elegir ubicación de entrega">
          <div className="ui-ubicacion__cabecera">
            <strong>Ubicación de entrega</strong>
            <button type="button" className="ui-ubicacion__cerrar" onClick={() => setAbierto(false)} aria-label="Cerrar">
              ×
            </button>
          </div>

          <button type="button" className="ui-ubicacion__detectar" onClick={detectar} disabled={consultando}>
            {consultando ? "Detectando…" : "Usar mi ubicación actual"}
          </button>

          <span className="ui-ubicacion__separador">o elige manualmente</span>

          <label className="ui-ubicacion__campo">
            <span>Departamento</span>
            <Selector
              valor={departamentoId}
              opciones={departamentos.map((item) => ({ valor: String(item.id), etiqueta: item.departamento }))}
              marcador="Selecciona departamento"
              alCambiar={elegirDepartamento}
            />
          </label>

          <label className="ui-ubicacion__campo">
            <span>Provincia</span>
            <Selector
              valor={provinciaId}
              opciones={provincias.map((item) => ({ valor: String(item.id), etiqueta: item.provincia }))}
              marcador="Selecciona provincia"
              deshabilitado={!departamentoId}
              alCambiar={elegirProvincia}
            />
          </label>

          <label className="ui-ubicacion__campo">
            <span>Distrito</span>
            <Selector
              valor={distritoId}
              opciones={distritos.map((item) => ({ valor: String(item.id), etiqueta: item.distrito }))}
              marcador="Selecciona distrito"
              deshabilitado={!provinciaId}
              alCambiar={setDistritoId}
            />
          </label>

          {errorCatalogo ? <p className="ui-ubicacion__error" role="alert">{errorCatalogo}</p> : null}

          <button type="button" className="ui-ubicacion__guardar" onClick={guardarUbicacionManual} disabled={!distritoId}>
            Guardar ubicación
          </button>
        </div>
      ) : null}
    </div>
  );
}
