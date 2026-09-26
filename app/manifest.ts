import type { MetadataRoute } from "next";
import { DESCRIPTION, LOGO_MARK, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "XLNC Exotic",
    description: DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [{ src: LOGO_MARK.src, sizes: `${LOGO_MARK.width}x${LOGO_MARK.height}`, type: "image/png" }],
  };
}
