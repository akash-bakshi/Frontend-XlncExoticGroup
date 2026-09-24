import Image from "next/image";
import { LOGO, SITE_NAME } from "@/lib/site";

interface BrandProps {
  href: string;
  alt?: string;
}

// Plain anchor: every page has its own root layout, so cross-page links are full navigations.
export function Brand({ href, alt = SITE_NAME }: BrandProps) {
  return (
    <a className="brand" href={href} aria-label={`${SITE_NAME} home`}>
      <Image src={LOGO.src} width={LOGO.width} height={LOGO.height} alt={alt} loading="eager" />
      <span className="brand-word">
        XLNC Exotic<small>Group</small>
      </span>
    </a>
  );
}
