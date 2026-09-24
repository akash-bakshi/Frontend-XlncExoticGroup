import type { ReactNode } from "react";
import { FONTS_URL } from "@/lib/site";

interface RootDocumentProps {
  bodyClassName?: string;
  head?: ReactNode;
  children: ReactNode;
}

export function RootDocument({ bodyClassName, head, children }: RootDocumentProps) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS_URL} />
        {head}
      </head>
      <body className={bodyClassName}>{children}</body>
    </html>
  );
}
