# SQL manual

Prisma no puede expresar todo lo que el esquema necesita: columnas `tsvector`,
índices GIN, índices parciales y funciones. Ese SQL se escribe a mano aquí y se
aplica **después** de cada `prisma migrate`.

## Flujo

```bash
# 1. Cambias packages/db/prisma/schema.prisma a mano
# 2. Generas la migración
npm run db:migrate

# 3. Aplicas el SQL que Prisma no cubre
npm run sql -w @appstore/db
```

> No uses `prisma db pull`: se cuelga contra el pooler de Supabase.
> El `schema.prisma` es la fuente de verdad y se mantiene a mano.

## Orden de los archivos

Se aplican en orden alfabético. Todos deben ser **idempotentes**
(`IF NOT EXISTS`, `CREATE OR REPLACE`) para poder re-ejecutarlos sin romper nada.

| Archivo | Qué hace |
|---|---|
| `001_extensiones.sql` | `unaccent` y `pg_trgm` para búsqueda en español |
| `002_catalogo_lectura.sql` | `tsvector`, trigger de búsqueda e índices GIN |
| `003_indices_rendimiento.sql` | Índices parciales que Prisma no expresa |
