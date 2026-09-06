// Los primitivos importan su CSS por efecto secundario (`import "./primitivos.css"`).
// TypeScript no sabe que es un modulo valido; esto se lo declara.
// Next lo resuelve en tiempo de build a traves de transpilePackages.

declare module "*.css";
