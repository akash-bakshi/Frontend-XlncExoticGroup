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

export const DESCRIPTION =
  "XLNC Exotic Group is a San Diego venture group that builds, backs, and scales exceptional companies across technology, construction, hospitality, legal, and luxury automotive.";

// Official profiles of the group itself (LinkedIn, Instagram, Google Business, ...). Each URL feeds the
// schema's sameAs and the footer, so only add profiles the group actually owns.
export const SOCIAL_PROFILES: { label: string; url: string }[] = [];

export const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,600&family=Jost:wght@300;400;500;600&display=swap";

export const LOGO = { src: "/assets/logos/icon/xlnc-exotic-group.png", width: 512, height: 512 };
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
  applicationName: SITE_NAME,
  icons: { icon: LOGO.src, apple: LOGO_MARK.src },
  formatDetection: { telephone: false, email: false, address: false },
};

export const privateMetadata = (title: string): Metadata => ({
  ...baseMetadata,
  title,
  robots: { index: false, follow: false },
});
