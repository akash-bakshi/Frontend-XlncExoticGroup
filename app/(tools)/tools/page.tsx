import type { Metadata, Viewport } from "next";
import { Brand } from "@/components/Brand";
import { ArrowRightIcon } from "@/components/icons";
import { Galaxy } from "@/components/tools/Galaxy";
import { LoginProvider } from "@/components/tools/LoginContext";
import { LoginPlate } from "@/components/tools/LoginPlate";
import { ToolsFooter } from "@/components/tools/ToolsFooter";
import { privateMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = privateMetadata("Internal Access | XLNC Exotic Group");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

const STAR_LAYERS = ["star-white-a", "star-white-b", "star-gold-a", "star-gold-b", "star-pink", "star-bright"];

export default function ToolsPage() {
  return (
    <LoginProvider>
      <div className="map-bg" aria-hidden="true">
        <span className="map-frame map-frame-full">
          <span className="map-pan"></span>
        </span>
      </div>

      <div className="starfield" aria-hidden="true">
        {STAR_LAYERS.map((layer) => (
          <span key={layer} className={`star-layer ${layer}`}></span>
        ))}
      </div>

      <header className="tools-bar">
        <div className="container tools-bar-in">
          <Brand href={ROUTES.home} />
          <a className="btn btn-primary tools-exit" href={ROUTES.home} aria-label="Home">
            <span className="tools-exit-word">Home</span>
            <ArrowRightIcon />
          </a>
        </div>
      </header>

      <main className="tools-page">
        <div className="container">
          <div className="tools-head">
            <h1 className="tools-title">
              Nine Companies. <span>One Root</span>
            </h1>
          </div>
          <Galaxy />
        </div>
      </main>

      <ToolsFooter />

      <div id="loginCardMount">
        <LoginPlate />
      </div>
    </LoginProvider>
  );
}
