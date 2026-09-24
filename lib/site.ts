import type { Metadata } from "next";

export const SITE_URL = "https://xlncexotic.com";
export const SITE_NAME = "XLNC Exotic Group";
export const EMAIL = "business@xlncexotic.com";
export const PHONE = "+16198360099";
export const PHONE_DISPLAY = "+1 (619) 836-0099";
export const LOCATION = "San Diego, California";

export const ADDRESS = {
  street: "9400 Activity Rd, Suite G",
  locality: "San Diego",
  region: "CA",
  postalCode: "92126",
  country: "US",
};

export const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,600&family=Jost:wght@300;400;500;600&display=swap";

export const LOGO = { src: "/assets/logos/xlnc-exotic-group.png", width: 247, height: 256 };
export const LOGO_MARK = { src: "/assets/logos/icon/xlnc-exotic-group.png", width: 512, height: 512 };

export const ROUTES = {
  home: "/",
  tools: "/tools",
  admin: "/admin",
  employee: "/employee",
  resetPassword: "/admin_change_password",
} as const;

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: LOGO.src },
};

export const privateMetadata = (title: string): Metadata => ({
  ...baseMetadata,
  title,
  robots: { index: false, follow: false },
});
