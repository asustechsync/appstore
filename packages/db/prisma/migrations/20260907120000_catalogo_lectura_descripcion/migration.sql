-- La ficha de producto necesita la descripcion larga y el codigo base sin
-- pagar un join. Se anaden al modelo de lectura; `descripcion` con default
-- vacio para no romper filas existentes y el refresco del catalogo las rellena
-- en la siguiente pasada.
ALTER TABLE "catalogo_lectura" ADD COLUMN "descripcion" TEXT NOT NULL DEFAULT '';
ALTER TABLE "catalogo_lectura" ADD COLUMN "sku" TEXT;
