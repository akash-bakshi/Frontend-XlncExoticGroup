import type { ReactNode } from "react";

interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

export interface Company {
  slug: string;
  name: string;
  url?: string;
  domain?: string;
  trayLabel: string;
  coinClass?: string;
  icon?: ImageAsset;
  trayWordmark?: ReactNode;
  tag: string;
  description: string;
  logo?: ImageAsset & { alt: string };
  wordmark?: ReactNode;
}

export const COMPANIES: Company[] = [
  {
    slug: "2dot2",
    name: "2DOT2",
    url: "https://2dot2.com",
    domain: "2dot2.com",
    trayLabel: "2DOT2 — visit 2dot2.com",
    coinClass: "coin-wide",
    icon: { src: "/assets/logos/icon/2dot2.png", width: 512, height: 142 },
    tag: "Technology",
    description: "Managed IT, cloud, and data services for modern businesses.",
    logo: { src: "/assets/logos/2dot2.png", width: 800, height: 231, alt: "2DOT2" },
  },
  {
    slug: "xlnc-builder",
    name: "XLNC Builder",
    url: "https://xlncbuilder.com",
    domain: "xlncbuilder.com",
    trayLabel: "XLNC Builder — visit xlncbuilder.com",
    coinClass: "coin-fill coin-dark",
    icon: { src: "/assets/logos/icon/xlnc-builder.png", width: 512, height: 512 },
    tag: "Construction",
    description: "Design-build, ADUs, and luxury remodeling — dreams to reality.",
    logo: { src: "/assets/logos/xlnc-builder.png", width: 800, height: 830, alt: "XLNC Builder logo" },
  },
  {
    slug: "sd-stay",
    name: "SD Stay",
    url: "https://sdstay.com",
    domain: "sdstay.com",
    trayLabel: "SD Stay — visit sdstay.com",
    coinClass: "coin-stack coin-dark",
    icon: { src: "/assets/logos/icon/sd-stay-coin.png", width: 425, height: 512 },
    tag: "Hospitality",
    description: "Luxury living and premium short-stay rentals across San Diego.",
    logo: { src: "/assets/logos/sd-stay.png", width: 800, height: 830, alt: "SD Stay logo" },
  },
  {
    slug: "xlnc-exotic-cars",
    name: "XLNC Exotic Cars",
    url: "https://xlncexoticcars.com",
    domain: "xlncexoticcars.com",
    trayLabel: "XLNC Exotic Cars — visit xlncexoticcars.com",
    coinClass: "coin-fill coin-dark",
    icon: { src: "/assets/logos/icon/xlnc-exotic-cars.png", width: 512, height: 512 },
    tag: "Luxury Automotive",
    description: "Exotic and luxury automobiles for the discerning collector.",
    logo: { src: "/assets/logos/xlnc-exotic-cars.png", width: 800, height: 829, alt: "XLNC Exotic Cars logo" },
  },
  {
    slug: "fortune-permits",
    name: "Fortune Permits",
    url: "https://fortunepermits.com",
    domain: "fortunepermits.com",
    trayLabel: "Fortune Permits — visit fortunepermits.com",
    coinClass: "coin-wide",
    icon: { src: "/assets/logos/icon/fortune-permits.png", width: 512, height: 153 },
    tag: "Design & Permitting",
    description: "Architectural design, permitting, and entitlements — client vision, result driven.",
    logo: { src: "/assets/logos/fortune-permits.png", width: 800, height: 248, alt: "Fortune Permits logo" },
  },
  {
    slug: "yorpro-ai",
    name: "YorPro.ai",
    url: "https://yorpro.ai",
    domain: "yorpro.ai",
    trayLabel: "YorPro.ai — visit yorpro.ai",
    trayWordmark: (
      <span className="tray-wm tray-wm-yorpro">
        YORPRO<span className="ai">.ai</span>
      </span>
    ),
    tag: "Legal Tech",
    description: "AI-native legal and immigration SaaS — here to assist.",
    wordmark: (
      <span className="pf-wordmark wm-yorpro">
        YORPRO<span className="ai">.ai</span>
      </span>
    ),
  },
  {
    slug: "soul-and-hearts",
    name: "Soul & Hearts",
    trayLabel: "Soul and Hearts — see in the portfolio",
    coinClass: "coin-emblem",
    icon: { src: "/assets/logos/icon/soul-and-heart.png", width: 147, height: 135 },
    tag: "Healthcare",
    description: "A premier healthcare service company dedicated to quality care and wellness.",
    logo: { src: "/assets/logos/soul-and-heart-full.png", width: 568, height: 267, alt: "Soul & Hearts logo" },
  },
  {
    slug: "4cros",
    name: "4Cros",
    trayLabel: "4Cros — see in the portfolio",
    trayWordmark: <span className="tray-wm">4Cros</span>,
    tag: "Real Estate & Capital",
    description:
      "Real estate investment and asset management firm managing a portfolio of residential properties while empowering private investors to co-invest in high-yield real estate.",
    wordmark: (
      <span className="pf-wordmark wm-generic">
        4Cros<span className="wm-sub">Real Estate &amp; Capital</span>
      </span>
    ),
  },
  {
    slug: "xlnc-capital",
    name: "XLNC Capital",
    trayLabel: "XLNC Capital — see in the portfolio",
    trayWordmark: (
      <span className="tray-wm">
        XLNC
        <br />
        Capital
      </span>
    ),
    tag: "Capital & Lending",
    description:
      "Investment and capital partnership program for external startups and high-growth ventures, offering flexible venture financing and business loans (launching soon).",
    wordmark: (
      <span className="pf-wordmark wm-generic">
        XLNC{" "}Capital<span className="wm-sub">Capital &amp; Lending</span>
      </span>
    ),
  },
  {
    slug: "axolo-ai",
    name: "Axolo AI",
    url: "https://axolo.ai",
    domain: "axolo.ai",
    trayLabel: "Axolo AI — visit axolo.ai",
    coinClass: "coin-fill coin-dark coin-black",
    icon: { src: "/assets/logos/icon/axolo-ai-coin.png", width: 512, height: 512 },
    tag: "Artificial Intelligence",
    description: "Applied AI products and automation built for modern businesses.",
    logo: { src: "/assets/logos/axolo-ai.png", width: 840, height: 112, alt: "Axolo AI" },
  },
];

export const FOOTER_COMPANIES = [
  "2dot2",
  "sd-stay",
  "fortune-permits",
  "xlnc-builder",
  "xlnc-exotic-cars",
  "yorpro-ai",
].map((slug) => COMPANIES.find((c) => c.slug === slug)!);
