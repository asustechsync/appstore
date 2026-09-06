// ═══════════════════════════════════════════════════════════════════════════
//  FUENTE UNICA DE VERDAD DEL SISTEMA VISUAL
//
//  Este archivo controla la identidad visual completa: web, panel y app movil.
//  Cambias un valor aqui y cambia en iOS, Android y navegador.
//
//  Regla que sostiene todo el sistema:
//
//    Ningun archivo de pagina define color, espaciado, tipografia, radio ni
//    sombra. Las paginas SOLO componen primitivos y disponen layout.
//
//    Si una pantalla necesita un color -> falta un token, se anade aqui.
//    Si una pantalla necesita un estilo -> falta un primitivo, se anade en
//    src/componentes/.
//
//  Al guardar este archivo hay que regenerar las salidas:
//      npm run ui:tokens
//
//  Genera:
//      src/theme.css        -> :root { --color-marca-500: ... }   (web)
//      src/tokens.native.ts -> { colorMarca500: '...' }           (React Native, F7)
// ═══════════════════════════════════════════════════════════════════════════

export const tokens = {
  // ── Color ────────────────────────────────────────────────────────────────
  // Escalas de 50 a 900. 500 es el tono base de cada familia.
  color: {
    // Acento sobrio azul grisaceo, inspirado en formularios y paneles claros.
    // Se usa con moderacion: botones primarios, foco y estados de marca.
    marca: {
      50: "#EEF3F7",
      100: "#DCE6ED",
      200: "#C1D1DC",
      300: "#9EB4C4",
      400: "#7894A8",
      500: "#5B7890", // base
      600: "#4C687E",
      700: "#3F586B",
      800: "#344957",
      900: "#293A46",
    },
    // Gris neutro (sin tinte azul). Es el 90 % de la interfaz.
    neutro: {
      0: "#FFFFFF",
      50: "#FAFAFA",
      100: "#F4F4F5",
      200: "#E9E9EC",
      300: "#D8D8DC",
      400: "#A1A1AA",
      500: "#71717A",
      600: "#52525B",
      700: "#3F3F46",
      800: "#27272A",
      900: "#171719",
    },

    // Semanticos: estado, no marca. Nunca se usan como color decorativo.
    exito: "#1F9D57",
    alerta: "#C07A12",
    error: "#DA5157",
    info: "#2F7DB8",

    // De negocio: el precio y la oferta tienen color propio porque su
    // significado no cambia aunque cambie la marca.
    precio: "#344D62",
    oferta: "#DA5157",
    agotado: "#A1A1AA",
    favorito: "#EF7A1E", // acento calido del boton de favoritos (corazon)

    // Roles de superficie. Son los que usan los componentes, no los de arriba.
    // El fondo claro se separa levemente de las superficies: asi tarjetas,
    // campos y paneles blancos conservan su contorno sin sombras pesadas.
    fondo: "#F7F8FA",
    fondoSutil: "#F1F4F6",
    superficie: "#FFFFFF",
    borde: "#DCE2E8",
    bordeFuerte: "#CBD4DC",
    texto: "#425A70",
    textoSuave: "#637B8F",
    textoTenue: "#91A1AE",
    textoInverso: "#FFFFFF",
  },

  // ── Espaciado ────────────────────────────────────────────────────────────
  // Escala de 4 px. Se usa para padding, margin y gap.
  espacio: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
  },

  // ── Radio ────────────────────────────────────────────────────────────────
  // Generoso: la estetica minimalista se apoya en esquinas suaves.
  radio: {
    ninguno: 0,
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    completo: 9999,
  },

  // ── Tipografia ───────────────────────────────────────────────────────────
  tipo: {
    familia: {
      base: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
      display: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
      mono: "'IBM Plex Mono', ui-monospace, Consolas, monospace",
    },
    tamano: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 38,
      "5xl": 48,
    },
    peso: {
      normal: 400,
      medio: 500,
      fuerte: 600,
      negrita: 700,
    },
    altura: {
      apretada: 1.2,
      normal: 1.5,
      suelta: 1.7,
    },
  },

  // ── Sombra ───────────────────────────────────────────────────────────────
  // Muy suaves: separan sin ensuciar. En minimalismo la sombra casi no se ve.
  sombra: {
    ninguna: "none",
    sm: "0 1px 2px rgb(24 24 27 / 0.04)",
    md: "0 2px 10px rgb(24 24 27 / 0.06)",
    lg: "0 10px 30px -8px rgb(24 24 27 / 0.10)",
  },

  // ── Layout ───────────────────────────────────────────────────────────────
  contenedor: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    ancho: 1400,
  },

  // Puntos de quiebre. FIRST MOBILE: los estilos base son de movil y estos
  // solo anaden desde arriba.
  quiebre: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // ── Movimiento ───────────────────────────────────────────────────────────
  transicion: {
    rapida: "120ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    lenta: "320ms cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // ── Capas ────────────────────────────────────────────────────────────────
  z: {
    base: 0,
    cabecera: 100,
    desplegable: 200,
    superposicion: 300,
    modal: 400,
    aviso: 500,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
//  Tema oscuro — SOLO redefine roles de superficie.
//  Las escalas de color no se tocan: se reasignan los roles.
// ═══════════════════════════════════════════════════════════════════════════

export const tokensOscuro = {
  color: {
    fondo: "#0B0B0C",
    fondoSutil: "#141416",
    superficie: "#19191C",
    borde: "#2A2A2E",
    bordeFuerte: "#3A3A40",
    texto: "#F4F4F5",
    textoSuave: "#A1A1AA",
    textoTenue: "#6B6B74",
    textoInverso: "#18181B",

    precio: "#F4F4F5",
    oferta: "#F07C81",
    agotado: "#6B6B74",
    favorito: "#F79544",

    exito: "#3ED68C",
    alerta: "#EAB143",
    error: "#F07C81",
    info: "#4FA6E0",
  },
  sombra: {
    ninguna: "none",
    sm: "0 1px 2px rgb(0 0 0 / 0.4)",
    md: "0 2px 10px rgb(0 0 0 / 0.5)",
    lg: "0 12px 34px -8px rgb(0 0 0 / 0.65)",
  },
} as const;

export type Tokens = typeof tokens;
