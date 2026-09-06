# apps/mobile — FASE 7

Aún no existe. Esta carpeta está reservada para la app de iOS y Android.

## Por qué está vacía y aun así importa

Todo lo que se construye en las fases 0 a 6 está pensado para que esta carpeta
sea **portar pantallas, no reescribir el sistema**. Cuando llegue F7 se reutiliza
sin tocar nada:

| Se reutiliza tal cual | Se reescribe |
|---|---|
| `@appstore/core` — precios, carrito, promociones, stock, estados | La capa de pantallas (React Native en vez de HTML/CSS) |
| `@appstore/api` — el mismo `AppRouter` de tRPC, tipado de punta a punta | La navegación (Expo Router en vez de App Router) |
| `@appstore/tipos` — los mismos esquemas zod validan los formularios | |
| `@appstore/ui/tokens` — vía `tokens.native.ts`, la misma identidad visual | |
| TanStack Query — idéntico en web y en React Native | |

Es aproximadamente el **60 % del código**, y es justo el 60 % donde viven las
reglas de negocio: las que no pueden discrepar entre plataformas.

## Cómo se arranca cuando toque

```bash
npx create-expo-app@latest apps/mobile --template default
```

Después:

1. Añadir `@appstore/core`, `@appstore/api`, `@appstore/tipos` y `@appstore/ui`
   como dependencias `"*"` del workspace.
2. Configurar Metro para resolver los paquetes del monorepo
   (`watchFolders` apuntando a la raíz).
3. Crear el cliente tRPC contra `NEXT_PUBLIC_WEB_URL/api/trpc` — mismo
   `AppRouter`, mismos tipos, cero código de cliente escrito a mano.
4. Consumir `tokens.native.ts` (lo genera `npm run ui:tokens`).
5. Añadir **NativeWind** si se quiere compartir también las clases de estilo.

## Lo que NO se hace

- No se duplica lógica de negocio aquí. Si hace falta una regla nueva, se
  añade a `packages/core` y la usan las tres plataformas.
- No se crea una API aparte para el móvil. El contrato es uno solo.
