-- Extensiones necesarias para la busqueda del catalogo en espanol.
-- unaccent: "camisón" encuentra "camison". pg_trgm: tolera errores de tipeo.

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
