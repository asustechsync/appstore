import type { HTMLAttributes, ReactNode } from "react";

import "./primitivos.css";

export interface PropsRejillaBanners extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Par de banners promocionales. FIRST MOBILE: uno debajo de otro en movil,
 * lado a lado desde el quiebre md.
 */
export function RejillaBanners({ className, children, ...resto }: PropsRejillaBanners) {
  return (
    <div className={["ui-rejilla-banners", className ?? ""].filter(Boolean).join(" ")} {...resto}>
      {children}
    </div>
  );
}
