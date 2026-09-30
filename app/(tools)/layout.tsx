import type { ReactNode } from "react";
import { fraunces, jost } from "@/app/_components/fonts";
import { RootDocument } from "@/app/_components/RootDocument";
import "@/styles/tools.css";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument
      htmlClassName={`${fraunces.variable} ${jost.variable}`}
      fontsUrl={null}
      head={<link rel="preload" as="image" href="/assets/logos/tools-bg.jpg" />}
    >
      {children}
    </RootDocument>
  );
}
