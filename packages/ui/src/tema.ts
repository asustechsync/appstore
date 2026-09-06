// ═══════════════════════════════════════════════════════════════════════════
//  Tema claro / oscuro
//
//  theme.css aplica el tema segun el atributo `data-tema` en <html>:
//    · sin atributo        -> sigue a `prefers-color-scheme` del sistema
//    · data-tema="claro"   -> fuerza claro
//    · data-tema="oscuro"  -> fuerza oscuro
//
//  La eleccion del usuario se guarda en localStorage. El layout raiz NO puede
//  leer cookies (volveria dinamico todo el arbol), asi que la preferencia se
//  aplica en el cliente con un script sincrono anti-parpadeo (GUION_TEMA).
// ═══════════════════════════════════════════════════════════════════════════

export type Tema = "claro" | "oscuro";

export const TEMA_LLAVE = "appstore-tema";

/**
 * Script anti-parpadeo. Se inserta sincrono en el documento ANTES del primer
 * pintado: lee la preferencia guardada y fija `data-tema` en <html> para que
 * theme.css pinte el tema correcto sin flash.
 */
export const GUION_TEMA =
  `(function(){try{var t=localStorage.getItem(${JSON.stringify(TEMA_LLAVE)});` +
  `if(t==="claro"||t==="oscuro"){document.documentElement.dataset.tema=t;}}` +
  `catch(e){}})();`;
