"use client";

import { useSession } from "@/hooks/useSession";
import { PortalShell } from "./PortalShell";

// "inventory-count" -> "Inventory Count", for the tile heading.
const pretty = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function EmployeeHome() {
  const session = useSession("employee");
  if (!session) return <div id="gated" hidden />;

  const name = [session.first_name || "", session.last_name || ""].join(" ").trim();
  const company = session.company || "";
  const tools = session.tools ?? [];

  const title = (
    <>
      Welcome
      {name && (
        <>
          {" "}
          <span id="whoName">{name}</span>
        </>
      )}
      {company && (
        <>
          {" To "}
          <span id="whoCompany">{company}</span>
        </>
      )}
    </>
  );

  const sub = tools.length ? (
    <p className="p-scope" id="toolCount">
      <span className="p-chip p-chip-hi">{`${tools.length === 1 ? "1 Tool" : `${tools.length} Tools`} Access`}</span>
    </p>
  ) : (
    <p className="p-sub" id="toolCount"></p>
  );

  return (
    <PortalShell username={session.username} eyebrow="User access" title={title} sub={sub}>
      <ul className="p-tiles" id="tiles">
        {tools.map((slug) => (
          <li key={slug}>
            <a className="p-tile" href={`/${slug}.html`}>
              <span className="p-tile-name">{pretty(slug)}</span>
              <span className="p-tile-slug">{slug}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="p-msg" id="emptyMsg">
        {tools.length ? "" : "No tools yet. Your admin assigns them."}
      </p>
    </PortalShell>
  );
}
