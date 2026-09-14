import "./primitivos.css";

const MARCAS = ["PESAIL", "AMANECER", "CIERVO DORADO", "FILA", "BOSTON", "SAN SHAN", "QILING", "AMERICANO", "UNO", "X&Y"];
const GRUPOS = [MARCAS.slice(0, 5), MARCAS.slice(5, 10)];

export function MarcasCarrusel() {
  return (
    <section className="ui-marcas" aria-label="Marcas">
      <div className="ui-marcas__ventana">
        <div className="ui-marcas__pista">
          {[...GRUPOS, ...GRUPOS].map((grupo, grupoIndice) => <div className="ui-marcas__grupo" key={grupoIndice}>
            {grupo.map((marca) => <a className="ui-marcas__marca" href={`/buscar?q=${encodeURIComponent(marca)}`} key={marca}>{marca}</a>)}
          </div>)}
        </div>
      </div>
    </section>
  );
}
