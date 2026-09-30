import type { ReactNode } from "react";
import { inter } from "@/app/_components/inter";
import { RootDocument } from "@/app/_components/RootDocument";
import "@/styles/admin_change_password.css";

export default function ResetLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument
      htmlClassName={inter.variable}
      fontsUrl={null}
      bodyClassName="reset"
      head={<link rel="preload" as="image" href="/assets/logos/tools-bg.jpg" />}
    >
      {children}
    </RootDocument>
  );
}
