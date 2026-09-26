import type { MetadataRoute } from "next";
import { COMPANIES } from "@/lib/companies";
import { LOGO, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const images = [
    "/assets/video/sd-hero.jpg",
    LOGO.src,
    ...COMPANIES.flatMap((company) => (company.logo ? [company.logo.src] : [])),
  ].map((src) => `${SITE_URL}${src}`);

  return [{ url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1, images }];
}
