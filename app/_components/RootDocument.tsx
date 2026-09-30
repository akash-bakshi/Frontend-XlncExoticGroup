import type { ReactNode } from "react";
import { FONTS_URL } from "@/lib/site";

interface RootDocumentProps {
  htmlClassName?: string;
  bodyClassName?: string;
  // Sections that self-host their fonts (next/font) pass null to skip the render-blocking Google Fonts CSS.
  fontsUrl?: string | null;
  head?: ReactNode;
  children: ReactNode;
}

export function RootDocument({ htmlClassName, bodyClassName, fontsUrl = FONTS_URL, head, children }: RootDocumentProps) {
  return (
    <html lang="en" className={htmlClassName}>
      <head>
        {fontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={fontsUrl} />
          </>
        )}
        {head}
      </head>
      <body className={bodyClassName}>{children}</body>
    </html>
  );
}
