-- ═══════════════════════════════════════════════════════════════════════════
--  Indices parciales — los que Prisma no sabe expresar.
--
--  Un indice parcial solo cubre las filas que cumplen la condicion, asi que
--  ocupa poco y responde rapido. Aqui estan los del panel, que es donde antes
--  se sentia la lentitud.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Catalogo publico (Clase A) ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cat_lec_disponibles
  ON catalogo_lectura (categoria_id, precio_desde)
  WHERE disponible AND activo;

CREATE INDEX IF NOT EXISTS idx_cat_lec_ofertas
  ON catalogo_lectura (descuento_pct DESC, precio_desde)
  WHERE en_oferta AND disponible;

CREATE INDEX IF NOT EXISTS idx_cat_lec_destacados
  ON catalogo_lectura (actualizado_en DESC)
  WHERE destacado AND disponible AND activo;

-- ── Panel: stock bajo ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_variantes_stock_bajo
  ON variantes (producto_id, cantidad)
  WHERE activo AND cantidad <= stock_minimo;

-- ── Panel: bandeja de pedidos ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_pedidos_abiertos
  ON pedidos (creado_en DESC)
  WHERE estado IN ('PENDIENTE', 'PAGADO', 'EN_PREPARACION');

CREATE INDEX IF NOT EXISTS idx_pedidos_por_despachar
  ON pedidos (confirmado_en)
  WHERE estado = 'EN_PREPARACION';

-- ── Panel: pagos por conciliar ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_pagos_pendientes
  ON pagos (creado_en)
  WHERE estado IN ('PENDIENTE', 'PROCESANDO');

-- ── F6: comprobantes por emitir a SUNAT ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_comprobantes_por_emitir
  ON comprobantes (creado_en)
  WHERE estado = 'BORRADOR';

CREATE INDEX IF NOT EXISTS idx_comprobantes_observados
  ON comprobantes (actualizado_en DESC)
  WHERE estado IN ('OBSERVADO', 'RECHAZADO');

-- ── Cuenta: campanita de notificaciones ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_notificaciones_no_leidas
  ON notificaciones (usuario_id, creado_en DESC)
  WHERE NOT leida;

-- ── Moderacion de resenas ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_resenas_por_aprobar
  ON resenas (creado_en)
  WHERE NOT aprobada;

-- ── Webhooks sin procesar (reintentos) ────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_eventos_pasarela_sin_procesar
  ON eventos_pasarela (creado_en)
  WHERE procesado_en IS NULL;
