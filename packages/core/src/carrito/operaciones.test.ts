import assert from "node:assert/strict";
import test from "node:test";

import {
  TOPE_POR_LINEA,
  agregarLinea,
  contarUnidades,
  fijarCantidad,
  quitarAgotadas,
  quitarLinea,
} from "./operaciones";

const polo = { varianteId: "v1", cantidad: 1, stockDisponible: 5 };
const gorra = { varianteId: "v2", cantidad: 2, stockDisponible: 3 };

test("agregar una variante repetida suma las cantidades", () => {
  const lineas = agregarLinea(agregarLinea([], polo), { ...polo, cantidad: 2 });
  assert.deepEqual(lineas, [{ varianteId: "v1", cantidad: 3, stockDisponible: 5 }]);
});

test("la suma nunca pasa del stock disponible", () => {
  const lineas = agregarLinea([polo], { ...polo, cantidad: 9 });
  assert.equal(lineas[0]?.cantidad, 5);
});

test("sin stock declarado manda el tope por linea", () => {
  const lineas = agregarLinea([], { varianteId: "v3", cantidad: 99 });
  assert.equal(lineas[0]?.cantidad, TOPE_POR_LINEA);
});

test("una variante agotada no entra al carrito", () => {
  assert.deepEqual(agregarLinea([], { varianteId: "v4", cantidad: 1, stockDisponible: 0 }), []);
});

test("fijar la cantidad en cero quita la linea", () => {
  assert.deepEqual(fijarCantidad([polo, gorra], "v1", 0), [gorra]);
});

test("fijar la cantidad respeta el stock", () => {
  assert.equal(fijarCantidad([gorra], "v2", 8)[0]?.cantidad, 3);
});

test("quitar deja el resto intacto", () => {
  assert.deepEqual(quitarLinea([polo, gorra], "v2"), [polo]);
});

test("quitarAgotadas descarta solo las lineas sin stock", () => {
  const agotada = { varianteId: "v5", cantidad: 1, stockDisponible: 0 };
  assert.deepEqual(quitarAgotadas([polo, agotada, gorra]), [polo, gorra]);
});

test("contarUnidades suma todas las lineas", () => {
  assert.equal(contarUnidades([polo, gorra]), 3);
});
