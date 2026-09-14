import { BannerPromo } from "./BannerPromo";
import { RejillaBanners } from "./RejillaBanners";

import "./primitivos.css";

export function PromocionesPortada({ promociones }: { promociones: any[] }) {
  return <RejillaBanners>{promociones.map((promo) => <BannerPromo key={promo.titulo} {...promo} />)}</RejillaBanners>;
}
