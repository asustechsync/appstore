# appstore

Ecommerce con presupuesto de rendimiento. Web y panel hoy; iOS y Android en la
fase 7, reutilizando el núcleo.

---

## Las tres clases de velocidad

**Este es el eje de todo el diseño.** Cada ruta pertenece a una clase, y la
clase decide su técnica de render, su caché y su presupuesto. Antes de escribir
cualquier pantalla, la primera pregunta es: *¿de qué clase es?*

| Clase | Qué es | Presupuesto | Técnica |
|---|---|---|---|
| **A** | Catálogo público | **20–40 ms** de TTFB | `use cache` + `cacheLife("max")` + etiquetas. HTML del CDN, no toca la base |
| **B** | Carrito y checkout | **40 ms** al primer píxel | PPR (por defecto en Next 16). Shell estático + streaming de lo personal |
| **C** | `/cuenta` y el panel | **0 ms** de navegación | SPA cliente + TanStack Query. El servidor solo entrega JSON |

### La corrección mental que más sirve

La Clase C **no optimiza el primer render: optimiza los siguientes cincuenta.**

Un panel que tarda 800 ms en abrir pero cambia de sección al instante se percibe
más rápido que uno que abre en 200 ms y paga 200 ms en cada clic. Ese era el
problema del proyecto anterior, y por eso el panel ahora es su propia app.

---

## Estructura

```
appstore/
├── apps/                        ← lo que se DESPLIEGA
│   ├── web/     :3000           tienda pública + /cuenta
│   ├── admin/   :3001           panel (SPA independiente)
│   └── mobile/                  Expo — F7
│
└── packages/                    ← lo que se IMPORTA
    ├── core/                    ⚑ lógica de negocio (sin React, sin Next, sin DB)
    ├── db/                      Prisma: esquema, cliente, SQL manual
    ├── api/                     routers tRPC — el contrato web ↔ panel ↔ móvil
    ├── ui/                      ⚑ tokens y primitivos (todo el control estético)
    ├── tipos/                   esquemas zod compartidos
    └── config/                  tsconfig y eslint
```

Cada app y cada paquete usa `src/` por dentro. `apps/` es lo que tiene dominio y
build propio; `packages/` son librerías internas que nunca se despliegan solas.

---

## Las cuatro reglas

Si se respetan, el sistema se mantiene solo. Si se rompen, vuelve la lentitud y
la app móvil de F7 se convierte en reescribir todo.

### 1. La lógica de negocio vive en `packages/core`, y solo ahí

Precios, carrito, promociones, stock, estados del pedido, tarifas de envío.
Si una regla se escribe dentro de una página, la app móvil tendrá que
reescribirla — y con el tiempo las dos copias discrepan.

### 2. Ninguna página define estilos

Ni color, ni espaciado, ni tipografía, ni radio, ni sombra. Las páginas **solo
componen primitivos y disponen layout**.

- ¿Falta un color? → se añade un token en `packages/ui/src/tokens.ts`
- ¿Falta un estilo? → se añade un primitivo en `packages/ui/src/componentes/`

Un solo archivo controla la identidad visual de la web, el panel y el móvil.

### 3. El layout raíz no lee cookies

Leer una cookie en `apps/web/src/app/layout.tsx` vuelve dinámico **todo** el
árbol de rutas, incluidas portada y categorías, que deberían ser HTML fijo en
el CDN. El estado de sesión entra por un componente cliente aislado.

### 4. El stock nunca se toca sin registrar el movimiento

`Variante.cantidad` y `Variante.reservado` solo cambian junto con una fila en
`movimientos_stock`. Si no hay movimiento, el cambio no ocurrió. Es lo único
que permite auditar diferencias de inventario.

---

## Puesta en marcha

```bash
npm install
```

```bash
cp .env.example .env.local
```

> **Importante:** el proyecto de Postgres debe estar en `sa-east-1` (São Paulo).
> Es la corrección de una línea con más impacto en latencia para Perú: desde
> `us-east-1` cada consulta paga ~110 ms de ida y vuelta.

```bash
npm run db:migrate
```

```bash
npm run db:sql
```

```bash
npm run db:seed
```

```bash
npm run ui:tokens
```

```bash
npm run dev
```

Tienda en `localhost:3000`, panel en `localhost:3001`.

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta tienda y panel a la vez |
| `npm run dev:web` | Solo la tienda |
| `npm run dev:admin` | Solo el panel |
| `npm run check` | lint + typecheck + tests |
| `npm run ui:tokens` | Regenera `theme.css` y `tokens.native.ts` desde `tokens.ts` |
| `npm run db:migrate` | Migración de Prisma |
| `npm run db:sql` | Aplica el SQL manual (tsvector, índices GIN y parciales) |
| `npm run db:studio` | Explorador de la base |

> Tras `npm run build` hay que reiniciar `npm run dev`.

---

## Caché e invalidación

El catálogo está **siempre fresco y siempre cacheado** — no hay que elegir.
Se invalida por evento, no por reloj.

`apps/web/src/lib/cache.ts` es la lista completa de etiquetas del sistema. Si
una etiqueta no está ahí, no existe.

Cuando el panel guarda un producto, llama a `POST /api/revalidar` en la tienda
con las etiquetas afectadas (`producto:{slug}`, `categoria:{slug}`, `ofertas`,
`portada`). La tienda ejecuta `revalidateTag(etiqueta, "max")`, que sirve lo
cacheado mientras regenera detrás.

---

## Fases

| Fase | Qué entra | Estado |
|---|---|---|
| **F0** | Monorepo, tokens, esquema completo | **hecho** |
| **F1** | Catálogo público (Clase A) — aquí se mide y se cierra el presupuesto | |
| **F2** | Cuentas y panel base (Clase C) | |
| **F3** | Carrito y checkout (Clase B), pago manual, captura de datos de facturación | |
| **F4** | Pedidos, kardex, reportes, auditoría | |
| **F5** | Izipay — implementar `PasarelaIzipay`, sin tocar el checkout | |
| **F6** | Facturación — implementar `ProveedorComprobante` | |
| **F7** | App iOS y Android con Expo | |

**F1 es una puerta:** si el catálogo no da el número, no se avanza a F2.

### Por qué F5 y F6 son fáciles

Las tablas de pagos y comprobantes existen desde F0, y el checkout habla con
interfaces, no con proveedores concretos:

- `packages/core/src/puertos/pasarela-pago.ts` → hoy `PasarelaManual`, en F5 `PasarelaIzipay`
- `packages/core/src/puertos/facturacion.ts` → hoy `ComprobanteBorrador`, en F6 el OSE

Integrar Izipay es añadir un archivo y una variable de entorno.

> **Lo único que hay que hacer desde F3:** capturar en el checkout el tipo de
> comprobante, RUC/DNI, razón social y dirección fiscal. Si no se piden desde el
> inicio, F6 empieza persiguiendo clientes por datos que ya no se consiguen.
