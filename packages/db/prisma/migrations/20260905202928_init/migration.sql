-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE', 'RESERVA', 'LIBERACION');

-- CreateEnum
CREATE TYPE "MotivoMovimiento" AS ENUM ('COMPRA', 'VENTA', 'DEVOLUCION_CLIENTE', 'DEVOLUCION_PROVEEDOR', 'MERMA', 'INVENTARIO_FISICO', 'TRASLADO', 'CORRECCION');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('TARJETA', 'YAPE', 'PLIN', 'TRANSFERENCIA', 'EFECTIVO', 'CONTRAENTREGA');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'PAGADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "TipoEnvio" AS ENUM ('AGENCIA', 'DOMICILIO', 'RECOJO');

-- CreateEnum
CREATE TYPE "EstadoEnvio" AS ENUM ('PENDIENTE', 'PREPARANDO', 'DESPACHADO', 'EN_RUTA', 'ENTREGADO', 'DEVUELTO', 'PERDIDO');

-- CreateEnum
CREATE TYPE "TipoPromocion" AS ENUM ('PORCENTAJE', 'MONTO_FIJO', 'PRECIO_FIJO', 'NXM', 'ENVIO_GRATIS');

-- CreateEnum
CREATE TYPE "TipoAlcance" AS ENUM ('TODO', 'CATEGORIA', 'MARCA', 'PRODUCTO', 'VARIANTE');

-- CreateEnum
CREATE TYPE "TipoCupon" AS ENUM ('PORCENTAJE', 'MONTO_FIJO', 'ENVIO_GRATIS');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'PROCESANDO', 'AUTORIZADO', 'PAGADO', 'RECHAZADO', 'CANCELADO', 'REEMBOLSADO', 'REEMBOLSO_PARCIAL');

-- CreateEnum
CREATE TYPE "TipoComprobante" AS ENUM ('BOLETA', 'FACTURA', 'NOTA_CREDITO', 'NOTA_DEBITO', 'TICKET');

-- CreateEnum
CREATE TYPE "EstadoComprobante" AS ENUM ('BORRADOR', 'ENVIADO', 'ACEPTADO', 'OBSERVADO', 'RECHAZADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('PEDIDO', 'PAGO', 'ENVIO', 'PROMOCION', 'STOCK', 'SISTEMA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "auth_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido_paterno" TEXT,
    "apellido_materno" TEXT,
    "telefono" TEXT,
    "codigo_pais" TEXT DEFAULT '+51',
    "fecha_nacimiento" TIMESTAMP(3),
    "genero" TEXT,
    "tipo_documento" TEXT,
    "documento" TEXT,
    "rol_id" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_acceso" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permisos" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "descripcion" TEXT,
    "grupo" TEXT,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles_permisos" (
    "rol_id" TEXT NOT NULL,
    "permiso_id" TEXT NOT NULL,

    CONSTRAINT "roles_permisos_pkey" PRIMARY KEY ("rol_id","permiso_id")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "destinatario" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "distrito" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "codigo_postal" TEXT,
    "referencia" TEXT,
    "predeterminada" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "imagen_url" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "destacada" BOOLEAN NOT NULL DEFAULT false,
    "titulo_seo" TEXT,
    "descripcion_seo" TEXT,
    "padre_id" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atributos_catalogo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'LISTA',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atributos_catalogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valores_atributo_catalogo" (
    "id" TEXT NOT NULL,
    "atributo_id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "color_hex" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "valores_atributo_catalogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "descripcion_corta" TEXT,
    "sku_interno" TEXT,
    "codigo_barras" TEXT,
    "sku" TEXT NOT NULL,
    "proveedor" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "precio_oferta" DECIMAL(10,2),
    "costo" DECIMAL(10,2),
    "borrador" BOOLEAN NOT NULL DEFAULT true,
    "modo_variantes" BOOLEAN NOT NULL DEFAULT false,
    "tipo_producto" TEXT,
    "perfil_opciones" TEXT,
    "categoria_id" TEXT NOT NULL,
    "marca_id" TEXT,
    "material" TEXT,
    "cuidados" TEXT,
    "guia_tallas" TEXT,
    "peso_kg" DECIMAL(8,3),
    "ancho_cm" DECIMAL(8,2),
    "alto_cm" DECIMAL(8,2),
    "largo_cm" DECIMAL(8,2),
    "afectacion_igv" TEXT NOT NULL DEFAULT 'GRAVADO',
    "titulo_seo" TEXT,
    "descripcion_seo" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_producto" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "alt" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "imagenes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opciones_producto" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "opciones_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valores_opcion_producto" (
    "id" TEXT NOT NULL,
    "opcion_id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "color_hex" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "valores_opcion_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variantes" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "talla" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '',
    "clave_opciones" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "precio" DECIMAL(10,2),
    "costo" DECIMAL(10,2),
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "reservado" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "imagen_url" TEXT,
    "imagen_public_id" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valores_variante" (
    "variante_id" TEXT NOT NULL,
    "valor_id" TEXT NOT NULL,

    CONSTRAINT "valores_variante_pkey" PRIMARY KEY ("variante_id","valor_id")
);

-- CreateTable
CREATE TABLE "almacenes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "departamento" TEXT,
    "provincia" TEXT,
    "distrito" TEXT,
    "direccion" TEXT,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "almacenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_stock" (
    "id" TEXT NOT NULL,
    "variante_id" TEXT NOT NULL,
    "almacen_id" TEXT,
    "tipo" "TipoMovimiento" NOT NULL,
    "motivo" "MotivoMovimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "saldo_anterior" INTEGER NOT NULL,
    "saldo_nuevo" INTEGER NOT NULL,
    "costo_unit" DECIMAL(10,2),
    "referencia_tipo" TEXT,
    "referencia_id" TEXT,
    "usuario_id" TEXT,
    "nota" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carritos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_carrito" (
    "id" TEXT NOT NULL,
    "carrito_id" TEXT NOT NULL,
    "variante_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "agregado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "costo_envio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "metodo_pago" "MetodoPago",
    "cupon_id" TEXT,
    "descuentos_detalle" JSONB,
    "envio_destinatario" TEXT,
    "envio_telefono" TEXT,
    "envio_departamento" TEXT,
    "envio_provincia" TEXT,
    "envio_distrito" TEXT,
    "envio_direccion" TEXT,
    "envio_referencia" TEXT,
    "envio_codigo_postal" TEXT,
    "tipo_comprobante" "TipoComprobante" NOT NULL DEFAULT 'BOLETA',
    "receptor_tipo_doc" TEXT,
    "receptor_num_doc" TEXT,
    "receptor_nombre" TEXT,
    "receptor_direccion" TEXT,
    "nota_cliente" TEXT,
    "nota_interna" TEXT,
    "confirmado_en" TIMESTAMP(3),
    "cancelado_en" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_pedido" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "variante_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unit" DECIMAL(10,2) NOT NULL,
    "costo_unit" DECIMAL(10,2),
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "nombre_producto" TEXT NOT NULL,
    "descripcion_var" TEXT NOT NULL DEFAULT '',
    "sku_variante" TEXT NOT NULL,

    CONSTRAINT "items_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metodos_envio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "tipo" "TipoEnvio" NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "metodos_envio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zonas_envio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "departamentos" TEXT[],
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "zonas_envio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarifas_envio" (
    "id" TEXT NOT NULL,
    "metodo_id" TEXT NOT NULL,
    "zona_id" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "gratis_desde" DECIMAL(10,2),
    "dias_min" INTEGER,
    "dias_max" INTEGER,
    "peso_max_kg" DECIMAL(8,3),

    CONSTRAINT "tarifas_envio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envios" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "metodo_id" TEXT NOT NULL,
    "estado" "EstadoEnvio" NOT NULL DEFAULT 'PENDIENTE',
    "costo" DECIMAL(10,2) NOT NULL,
    "numero_guia" TEXT,
    "url_seguimiento" TEXT,
    "agencia" TEXT,
    "transportista" TEXT,
    "despachado_en" TIMESTAMP(3),
    "entregado_en" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "envios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promociones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "TipoPromocion" NOT NULL,
    "valor" DECIMAL(10,2),
    "compra_minima" DECIMAL(10,2),
    "cantidad_n" INTEGER,
    "cantidad_m" INTEGER,
    "prioridad" INTEGER NOT NULL DEFAULT 0,
    "acumulable" BOOLEAN NOT NULL DEFAULT false,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "uso_maximo" INTEGER,
    "usos_actuales" INTEGER NOT NULL DEFAULT 0,
    "etiqueta" TEXT,
    "etiqueta_color" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promociones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promociones_alcance" (
    "id" TEXT NOT NULL,
    "promocion_id" TEXT NOT NULL,
    "tipo" "TipoAlcance" NOT NULL,
    "referencia_id" TEXT,
    "excluir" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "promociones_alcance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupones" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" "TipoCupon" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "monto_minimo" DECIMAL(10,2),
    "uso_maximo" INTEGER,
    "uso_por_cliente" INTEGER,
    "usos_actuales" INTEGER NOT NULL DEFAULT 0,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cupones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "pasarela" TEXT NOT NULL DEFAULT 'manual',
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "monto" DECIMAL(10,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "referencia_externa" TEXT,
    "marca_tarjeta" TEXT,
    "ultimos_digitos" TEXT,
    "voucher_url" TEXT,
    "pagado_en" TIMESTAMP(3),
    "reembolsado_en" TIMESTAMP(3),
    "monto_reembolsado" DECIMAL(10,2),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intentos_pago" (
    "id" TEXT NOT NULL,
    "pago_id" TEXT NOT NULL,
    "estado" "EstadoPago" NOT NULL,
    "mensaje" TEXT,
    "codigo_error" TEXT,
    "payload" JSONB,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intentos_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_pasarela" (
    "id" TEXT NOT NULL,
    "pago_id" TEXT,
    "pasarela" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "firma_valida" BOOLEAN NOT NULL DEFAULT false,
    "cuerpo" JSONB NOT NULL,
    "cabeceras" JSONB,
    "procesado_en" TIMESTAMP(3),
    "error_proceso" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_pasarela_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "series_comprobante" (
    "id" TEXT NOT NULL,
    "tipo" "TipoComprobante" NOT NULL,
    "serie" TEXT NOT NULL,
    "correlativo" INTEGER NOT NULL DEFAULT 0,
    "almacen_id" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "series_comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comprobantes" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "tipo" "TipoComprobante" NOT NULL,
    "serie" TEXT NOT NULL,
    "correlativo" INTEGER NOT NULL,
    "estado" "EstadoComprobante" NOT NULL DEFAULT 'BORRADOR',
    "receptor_tipo_doc" TEXT NOT NULL,
    "receptor_num_doc" TEXT NOT NULL,
    "receptor_nombre" TEXT NOT NULL,
    "receptor_direccion" TEXT,
    "gravado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "exonerado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "inafecto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "hash_cpe" TEXT,
    "xml_url" TEXT,
    "cdr_url" TEXT,
    "pdf_url" TEXT,
    "respuesta_sunat" JSONB,
    "motivo_anulacion" TEXT,
    "comprobante_ref_id" TEXT,
    "emitido_en" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comprobantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_comprobante" (
    "id" TEXT NOT NULL,
    "comprobante_id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "codigo" TEXT,
    "unidad_medida" TEXT NOT NULL DEFAULT 'NIU',
    "cantidad" DECIMAL(10,3) NOT NULL,
    "valor_unitario" DECIMAL(10,2) NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "afectacion_igv" TEXT NOT NULL DEFAULT 'GRAVADO',

    CONSTRAINT "items_comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "usuario_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("usuario_id","producto_id")
);

-- CreateTable
CREATE TABLE "resenas" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "pedido_id" TEXT,
    "calificacion" INTEGER NOT NULL,
    "titulo" TEXT,
    "comentario" TEXT,
    "aprobada" BOOLEAN NOT NULL DEFAULT false,
    "respuesta" TEXT,
    "respondido_en" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "titulo" TEXT NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "enlace" TEXT,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "enviada_push" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_auditoria" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidad_id" TEXT,
    "antes" JSONB,
    "despues" JSONB,
    "ip" TEXT,
    "agente" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogo_lectura" (
    "producto_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion_corta" TEXT,
    "categoria_id" TEXT NOT NULL,
    "categoria_slug" TEXT NOT NULL,
    "categoria_ruta" TEXT[],
    "marca_id" TEXT,
    "marca_slug" TEXT,
    "marca_nombre" TEXT,
    "precio_desde" DECIMAL(10,2) NOT NULL,
    "precio_hasta" DECIMAL(10,2) NOT NULL,
    "precio_lista" DECIMAL(10,2) NOT NULL,
    "en_oferta" BOOLEAN NOT NULL DEFAULT false,
    "descuento_pct" INTEGER,
    "etiqueta" TEXT,
    "etiqueta_color" TEXT,
    "imagen_url" TEXT,
    "imagenes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "stock_total" INTEGER NOT NULL DEFAULT 0,
    "disponible" BOOLEAN NOT NULL DEFAULT false,
    "calificacion" DECIMAL(2,1),
    "total_resenas" INTEGER NOT NULL DEFAULT 0,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "variantes" JSONB NOT NULL DEFAULT '[]',
    "opciones" JSONB NOT NULL DEFAULT '[]',
    "facetas" JSONB NOT NULL DEFAULT '{}',
    "busqueda" tsvector,
    "actualizado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalogo_lectura_pkey" PRIMARY KEY ("producto_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_auth_id_key" ON "usuarios"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_documento_key" ON "usuarios"("documento");

-- CreateIndex
CREATE INDEX "usuarios_rol_id_idx" ON "usuarios"("rol_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_clave_key" ON "permisos"("clave");

-- CreateIndex
CREATE INDEX "direcciones_usuario_id_idx" ON "direcciones"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_nombre_key" ON "marcas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_slug_key" ON "marcas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "categorias_activo_orden_idx" ON "categorias"("activo", "orden");

-- CreateIndex
CREATE INDEX "categorias_padre_id_idx" ON "categorias"("padre_id");

-- CreateIndex
CREATE UNIQUE INDEX "atributos_catalogo_clave_key" ON "atributos_catalogo"("clave");

-- CreateIndex
CREATE INDEX "valores_atributo_catalogo_atributo_id_idx" ON "valores_atributo_catalogo"("atributo_id");

-- CreateIndex
CREATE UNIQUE INDEX "valores_atributo_catalogo_atributo_id_valor_key" ON "valores_atributo_catalogo"("atributo_id", "valor");

-- CreateIndex
CREATE UNIQUE INDEX "productos_slug_key" ON "productos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "productos_sku_interno_key" ON "productos"("sku_interno");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigo_barras_key" ON "productos"("codigo_barras");

-- CreateIndex
CREATE UNIQUE INDEX "productos_sku_key" ON "productos"("sku");

-- CreateIndex
CREATE INDEX "productos_categoria_id_idx" ON "productos"("categoria_id");

-- CreateIndex
CREATE INDEX "productos_marca_id_idx" ON "productos"("marca_id");

-- CreateIndex
CREATE INDEX "productos_activo_destacado_idx" ON "productos"("activo", "destacado");

-- CreateIndex
CREATE INDEX "imagenes_producto_producto_id_orden_idx" ON "imagenes_producto"("producto_id", "orden");

-- CreateIndex
CREATE INDEX "opciones_producto_producto_id_idx" ON "opciones_producto"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "opciones_producto_producto_id_clave_key" ON "opciones_producto"("producto_id", "clave");

-- CreateIndex
CREATE INDEX "valores_opcion_producto_opcion_id_idx" ON "valores_opcion_producto"("opcion_id");

-- CreateIndex
CREATE UNIQUE INDEX "valores_opcion_producto_opcion_id_valor_key" ON "valores_opcion_producto"("opcion_id", "valor");

-- CreateIndex
CREATE UNIQUE INDEX "variantes_sku_key" ON "variantes"("sku");

-- CreateIndex
CREATE INDEX "variantes_producto_id_idx" ON "variantes"("producto_id");

-- CreateIndex
CREATE INDEX "variantes_activo_cantidad_idx" ON "variantes"("activo", "cantidad");

-- CreateIndex
CREATE UNIQUE INDEX "variantes_producto_id_clave_opciones_key" ON "variantes"("producto_id", "clave_opciones");

-- CreateIndex
CREATE INDEX "valores_variante_valor_id_idx" ON "valores_variante"("valor_id");

-- CreateIndex
CREATE UNIQUE INDEX "almacenes_clave_key" ON "almacenes"("clave");

-- CreateIndex
CREATE INDEX "movimientos_stock_variante_id_creado_en_idx" ON "movimientos_stock"("variante_id", "creado_en");

-- CreateIndex
CREATE INDEX "movimientos_stock_referencia_tipo_referencia_id_idx" ON "movimientos_stock"("referencia_tipo", "referencia_id");

-- CreateIndex
CREATE INDEX "movimientos_stock_creado_en_idx" ON "movimientos_stock"("creado_en");

-- CreateIndex
CREATE UNIQUE INDEX "carritos_usuario_id_key" ON "carritos"("usuario_id");

-- CreateIndex
CREATE INDEX "items_carrito_carrito_id_idx" ON "items_carrito"("carrito_id");

-- CreateIndex
CREATE UNIQUE INDEX "items_carrito_carrito_id_variante_id_key" ON "items_carrito"("carrito_id", "variante_id");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_numero_key" ON "pedidos"("numero");

-- CreateIndex
CREATE INDEX "pedidos_usuario_id_creado_en_idx" ON "pedidos"("usuario_id", "creado_en");

-- CreateIndex
CREATE INDEX "pedidos_estado_creado_en_idx" ON "pedidos"("estado", "creado_en");

-- CreateIndex
CREATE INDEX "pedidos_cupon_id_idx" ON "pedidos"("cupon_id");

-- CreateIndex
CREATE INDEX "items_pedido_pedido_id_idx" ON "items_pedido"("pedido_id");

-- CreateIndex
CREATE INDEX "items_pedido_variante_id_idx" ON "items_pedido"("variante_id");

-- CreateIndex
CREATE UNIQUE INDEX "metodos_envio_clave_key" ON "metodos_envio"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "tarifas_envio_metodo_id_zona_id_key" ON "tarifas_envio"("metodo_id", "zona_id");

-- CreateIndex
CREATE UNIQUE INDEX "envios_pedido_id_key" ON "envios"("pedido_id");

-- CreateIndex
CREATE INDEX "envios_estado_idx" ON "envios"("estado");

-- CreateIndex
CREATE INDEX "envios_numero_guia_idx" ON "envios"("numero_guia");

-- CreateIndex
CREATE INDEX "promociones_activo_fecha_inicio_fecha_fin_idx" ON "promociones"("activo", "fecha_inicio", "fecha_fin");

-- CreateIndex
CREATE INDEX "promociones_alcance_promocion_id_idx" ON "promociones_alcance"("promocion_id");

-- CreateIndex
CREATE INDEX "promociones_alcance_tipo_referencia_id_idx" ON "promociones_alcance"("tipo", "referencia_id");

-- CreateIndex
CREATE UNIQUE INDEX "cupones_codigo_key" ON "cupones"("codigo");

-- CreateIndex
CREATE INDEX "cupones_activo_fecha_fin_idx" ON "cupones"("activo", "fecha_fin");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_referencia_externa_key" ON "pagos"("referencia_externa");

-- CreateIndex
CREATE INDEX "pagos_pedido_id_idx" ON "pagos"("pedido_id");

-- CreateIndex
CREATE INDEX "pagos_estado_creado_en_idx" ON "pagos"("estado", "creado_en");

-- CreateIndex
CREATE INDEX "intentos_pago_pago_id_creado_en_idx" ON "intentos_pago"("pago_id", "creado_en");

-- CreateIndex
CREATE INDEX "eventos_pasarela_pasarela_tipo_creado_en_idx" ON "eventos_pasarela"("pasarela", "tipo", "creado_en");

-- CreateIndex
CREATE INDEX "eventos_pasarela_pago_id_idx" ON "eventos_pasarela"("pago_id");

-- CreateIndex
CREATE UNIQUE INDEX "series_comprobante_tipo_serie_key" ON "series_comprobante"("tipo", "serie");

-- CreateIndex
CREATE INDEX "comprobantes_pedido_id_idx" ON "comprobantes"("pedido_id");

-- CreateIndex
CREATE INDEX "comprobantes_estado_creado_en_idx" ON "comprobantes"("estado", "creado_en");

-- CreateIndex
CREATE UNIQUE INDEX "comprobantes_tipo_serie_correlativo_key" ON "comprobantes"("tipo", "serie", "correlativo");

-- CreateIndex
CREATE INDEX "items_comprobante_comprobante_id_idx" ON "items_comprobante"("comprobante_id");

-- CreateIndex
CREATE INDEX "favoritos_producto_id_idx" ON "favoritos"("producto_id");

-- CreateIndex
CREATE INDEX "resenas_producto_id_aprobada_idx" ON "resenas"("producto_id", "aprobada");

-- CreateIndex
CREATE UNIQUE INDEX "resenas_producto_id_usuario_id_key" ON "resenas"("producto_id", "usuario_id");

-- CreateIndex
CREATE INDEX "notificaciones_usuario_id_leida_creado_en_idx" ON "notificaciones"("usuario_id", "leida", "creado_en");

-- CreateIndex
CREATE INDEX "eventos_auditoria_entidad_entidad_id_creado_en_idx" ON "eventos_auditoria"("entidad", "entidad_id", "creado_en");

-- CreateIndex
CREATE INDEX "eventos_auditoria_usuario_id_creado_en_idx" ON "eventos_auditoria"("usuario_id", "creado_en");

-- CreateIndex
CREATE INDEX "eventos_auditoria_creado_en_idx" ON "eventos_auditoria"("creado_en");

-- CreateIndex
CREATE UNIQUE INDEX "catalogo_lectura_slug_key" ON "catalogo_lectura"("slug");

-- CreateIndex
CREATE INDEX "catalogo_lectura_categoria_id_disponible_precio_desde_idx" ON "catalogo_lectura"("categoria_id", "disponible", "precio_desde");

-- CreateIndex
CREATE INDEX "catalogo_lectura_marca_id_disponible_idx" ON "catalogo_lectura"("marca_id", "disponible");

-- CreateIndex
CREATE INDEX "catalogo_lectura_en_oferta_descuento_pct_idx" ON "catalogo_lectura"("en_oferta", "descuento_pct");

-- CreateIndex
CREATE INDEX "catalogo_lectura_destacado_activo_idx" ON "catalogo_lectura"("destacado", "activo");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permisos" ADD CONSTRAINT "roles_permisos_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permisos" ADD CONSTRAINT "roles_permisos_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "permisos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_padre_id_fkey" FOREIGN KEY ("padre_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valores_atributo_catalogo" ADD CONSTRAINT "valores_atributo_catalogo_atributo_id_fkey" FOREIGN KEY ("atributo_id") REFERENCES "atributos_catalogo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_producto" ADD CONSTRAINT "imagenes_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opciones_producto" ADD CONSTRAINT "opciones_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valores_opcion_producto" ADD CONSTRAINT "valores_opcion_producto_opcion_id_fkey" FOREIGN KEY ("opcion_id") REFERENCES "opciones_producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variantes" ADD CONSTRAINT "variantes_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valores_variante" ADD CONSTRAINT "valores_variante_variante_id_fkey" FOREIGN KEY ("variante_id") REFERENCES "variantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valores_variante" ADD CONSTRAINT "valores_variante_valor_id_fkey" FOREIGN KEY ("valor_id") REFERENCES "valores_opcion_producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_stock" ADD CONSTRAINT "movimientos_stock_variante_id_fkey" FOREIGN KEY ("variante_id") REFERENCES "variantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_stock" ADD CONSTRAINT "movimientos_stock_almacen_id_fkey" FOREIGN KEY ("almacen_id") REFERENCES "almacenes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_stock" ADD CONSTRAINT "movimientos_stock_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carritos" ADD CONSTRAINT "carritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_carrito" ADD CONSTRAINT "items_carrito_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "carritos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_carrito" ADD CONSTRAINT "items_carrito_variante_id_fkey" FOREIGN KEY ("variante_id") REFERENCES "variantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cupon_id_fkey" FOREIGN KEY ("cupon_id") REFERENCES "cupones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_variante_id_fkey" FOREIGN KEY ("variante_id") REFERENCES "variantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifas_envio" ADD CONSTRAINT "tarifas_envio_metodo_id_fkey" FOREIGN KEY ("metodo_id") REFERENCES "metodos_envio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifas_envio" ADD CONSTRAINT "tarifas_envio_zona_id_fkey" FOREIGN KEY ("zona_id") REFERENCES "zonas_envio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_metodo_id_fkey" FOREIGN KEY ("metodo_id") REFERENCES "metodos_envio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promociones_alcance" ADD CONSTRAINT "promociones_alcance_promocion_id_fkey" FOREIGN KEY ("promocion_id") REFERENCES "promociones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intentos_pago" ADD CONSTRAINT "intentos_pago_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "pagos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_pasarela" ADD CONSTRAINT "eventos_pasarela_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "pagos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comprobantes" ADD CONSTRAINT "comprobantes_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comprobantes" ADD CONSTRAINT "comprobantes_comprobante_ref_id_fkey" FOREIGN KEY ("comprobante_ref_id") REFERENCES "comprobantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_comprobante" ADD CONSTRAINT "items_comprobante_comprobante_id_fkey" FOREIGN KEY ("comprobante_id") REFERENCES "comprobantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_auditoria" ADD CONSTRAINT "eventos_auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogo_lectura" ADD CONSTRAINT "catalogo_lectura_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
