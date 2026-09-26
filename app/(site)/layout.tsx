import type { ReactNode } from "react";
import { RootDocument } from "@/app/_components/RootDocument";
import { Bot } from "@/components/site/Bot";
import "@/styles/site.css";

// Runs before paint: /#tools and friends open their standalone pages.
const HASH_ROUTES = `(function(){var P={tools:"/tools",sign:"/tools",admin:"/tools",employee:"/tools",admin_change_password:"/admin_change_password"};function go(){var m=/^#([a-z_]+)/.exec(location.hash);var p=m&&P[m[1]];if(p)location.replace(p)}window.addEventListener("hashchange",go);go()})();`;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument
      head={
        <>
          <script dangerouslySetInnerHTML={{ __html: HASH_ROUTES }} />
          <link rel="preload" as="image" href="/assets/video/sd-hero.jpg" />
        </>
      }
    >
      {children}
      <Bot />
    </RootDocument>
  );
}
