import type { ReactNode } from "react";
import { RootDocument } from "@/app/_components/RootDocument";
import "@/styles/tools.css";

// The backdrop is a CSS background, so preload it alongside the stylesheet.
export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument head={<link rel="preload" as="image" href="/assets/logos/icon/image.webp" type="image/webp" />}>
      {children}
    </RootDocument>
  );
}
