import type { Metadata, Viewport } from "next";
import { Brand } from "@/components/Brand";
import { ChevronRightIcon } from "@/components/icons";
import { CompanyGrid } from "@/components/tools/CompanyGrid";
import { LoginProvider } from "@/components/tools/LoginContext";
import { LoginPlate } from "@/components/tools/LoginPlate";
import { ToolsFooter } from "@/components/tools/ToolsFooter";
import { privateMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = privateMetadata("Internal Access | XLNC Exotic Group");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function ToolsPage() {
  return (
    <LoginProvider>
      <header className="tools-bar">
        <div className="container tools-bar-in">
          <Brand href={ROUTES.home} />
          <a className="tools-exit" href={ROUTES.home}>
            Home
            <ChevronRightIcon />
          </a>
        </div>
      </header>

      <main className="tools-page">
        <section className="tools-hero container">
          <p className="tools-eyebrow">Internal Access</p>
          <h1 className="tools-title">
            Ten companies.
            <br />
            <span>One root.</span>
          </h1>
          <p className="tools-lede">Choose a company to sign in to its tools.</p>
        </section>

        <section className="container">
          <CompanyGrid />
        </section>
      </main>

      <ToolsFooter />

      <LoginPlate />
    </LoginProvider>
  );
}
