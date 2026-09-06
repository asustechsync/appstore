# Reglas del proyecto

Lee `README.md` antes de escribir código. Resumen de lo que no se negocia:

## Las tres clases de velocidad

Antes de crear una pantalla, decide su clase. La clase decide render y caché.

- **Clase A** — catálogo público. `use cache` + `cacheLife("max")` + `cacheTag`.
  20–40 ms. No toca la base en el request del visitante.
- **Clase B** — carrito y checkout. PPR (por defecto en Next 16). Shell estático
  + streaming.
- **Clase C** — `/cuenta` y el panel. SPA cliente + TanStack Query.
  Navegación en 0 ms; el servidor solo entrega JSON.

## Reglas duras

1. **La lógica de negocio va en `packages/core`.** Nunca dentro de una página.
   Precios, carrito, promociones, stock, estados, envíos.
2. **Ninguna página define estilos.** Ni color, ni espaciado, ni tipografía, ni
   radio, ni sombra. Si falta un color → token en `packages/ui/src/tokens.ts`.
   Si falta un estilo → primitivo en `packages/ui/src/componentes/`.
3. **El layout raíz de `apps/web` no lee cookies.** Vuelve dinámico todo el árbol.
4. **El stock no se toca sin escribir en `movimientos_stock`.**
5. **El catálogo se lee de `catalogo_lectura`**, nunca de `productos` con joins.
6. **Toda invalidación pasa por las etiquetas de `apps/web/src/lib/cache.ts`.**

## Base de datos

- El SQL que Prisma no expresa (tsvector, GIN, índices parciales) se escribe a
  mano en `packages/db/prisma/sql/` y debe ser idempotente.
- `schema.prisma` se mantiene a mano. **No usar `prisma db pull`**: se cuelga
  contra el pooler.

## Convenciones

- Código, comentarios, nombres de variables y mensajes de commit **en español**.
- FIRST MOBILE: los estilos base son de móvil; los quiebres solo añaden.
- Tras `npm run build` hay que reiniciar `npm run dev`.
- Ante vulnerabilidades de dependencias, usar `overrides` en `package.json`
  antes que bajar de versión.

## Integraciones aplazadas

No implementar hasta su fase. Las interfaces ya existen:

- `packages/core/src/puertos/pasarela-pago.ts` — Izipay en **F5**
- `packages/core/src/puertos/facturacion.ts` — SUNAT/OSE en **F6**

Pero **sí** capturar desde F3 los datos de facturación en el checkout.
