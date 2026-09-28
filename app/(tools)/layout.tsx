import type { ReactNode } from "react";
import { RootDocument } from "@/app/_components/RootDocument";
import "@/styles/tools.css";

const INTER_URL = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument
      head={
        <>
          <link rel="stylesheet" href={INTER_URL} />
          <link rel="preload" as="image" href="/assets/logos/tools-bg.jpg" />
        </>
      }
    >
      {children}
    </RootDocument>
  );
}
