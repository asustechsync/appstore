import assert from "node:assert/strict";
import test from "node:test";

import { resolverDistritoPorCoordenadas, type LimiteDistrital } from "./resolver-distrito";

const limite: LimiteDistrital = {
  u: "230101",
  d: "TACNA",
  p: "TACNA",
  r: "TACNA",
  b: [-71, -19, -69, -17],
  g: [[[[-71, -19], [-69, -19], [-69, -17], [-71, -17], [-71, -19]]]],
};

test("resuelve un punto dentro del polígono", () => {
  assert.deepEqual(resolverDistritoPorCoordenadas(-18, -70, [limite]), {
    ubigeo: "230101",
    distrito: "TACNA",
    provincia: "TACNA",
    departamento: "TACNA",
  });
});

test("devuelve null fuera de los límites", () => {
  assert.equal(resolverDistritoPorCoordenadas(-12, -77, [limite]), null);
});

test("rechaza coordenadas inválidas", () => {
  assert.equal(resolverDistritoPorCoordenadas(91, -70, [limite]), null);
});
