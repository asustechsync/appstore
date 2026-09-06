-- ═══════════════════════════════════════════════════════════════════════════
--  catalogo_lectura — lo que Prisma no puede expresar
--
--  La tabla la crea Prisma desde schema.prisma. Aqui se anaden la columna
--  tsvector, el trigger que la mantiene y los indices GIN.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE catalogo_lectura
  ADD COLUMN IF NOT EXISTS busqueda tsvector;

-- El peso decide el orden de los resultados: el nombre del producto pesa mas
-- que la marca, y la marca mas que la descripcion.
CREATE OR REPLACE FUNCTION catalogo_lectura_actualizar_busqueda()
RETURNS trigger AS $$
BEGIN
  NEW.busqueda :=
       setweight(to_tsvector('spanish', unaccent(coalesce(NEW.nombre, ''))),            'A')
    || setweight(to_tsvector('spanish', unaccent(coalesce(NEW.marca_nombre, ''))),      'B')
    || setweight(to_tsvector('spanish', unaccent(coalesce(NEW.categoria_slug, ''))),    'C')
    || setweight(to_tsvector('spanish', unaccent(coalesce(NEW.descripcion_corta, ''))), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_catalogo_lectura_busqueda ON catalogo_lectura;
CREATE TRIGGER trg_catalogo_lectura_busqueda
  BEFORE INSERT OR UPDATE OF nombre, marca_nombre, categoria_slug, descripcion_corta
  ON catalogo_lectura
  FOR EACH ROW
  EXECUTE FUNCTION catalogo_lectura_actualizar_busqueda();

-- Busqueda por texto
CREATE INDEX IF NOT EXISTS idx_cat_lec_busqueda
  ON catalogo_lectura USING GIN (busqueda);

-- Busqueda tolerante a errores de tipeo ("pantalno" -> "pantalon")
CREATE INDEX IF NOT EXISTS idx_cat_lec_nombre_trgm
  ON catalogo_lectura USING GIN (nombre gin_trgm_ops);

-- Filtros del catalogo: { "talla": ["S","M"], "color": ["Negro"] }
CREATE INDEX IF NOT EXISTS idx_cat_lec_facetas
  ON catalogo_lectura USING GIN (facetas jsonb_path_ops);

-- Migas de pan y filtro por rama de categorias
CREATE INDEX IF NOT EXISTS idx_cat_lec_ruta
  ON catalogo_lectura USING GIN (categoria_ruta);

-- Rellena la columna en filas que ya existan
UPDATE catalogo_lectura SET nombre = nombre WHERE busqueda IS NULL;
