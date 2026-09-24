import Image from "next/image";
import type { Company } from "@/lib/companies";

export function CoinMark({ company }: { company: Company }) {
  if (!company.icon) return <>{company.trayWordmark}</>;
  const { src, width, height } = company.icon;
  return (
    <Image className="tray-logo" src={src} width={width} height={height} alt={company.name} loading="eager" />
  );
}

export const coinClassName = (company: Company) =>
  company.coinClass ? `tray-cell ${company.coinClass}` : "tray-cell";
