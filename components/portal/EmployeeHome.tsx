"use client";

import { useSession } from "@/hooks/useSession";
import { PortalShell } from "./PortalShell";

// "inventory-count" -> "Inventory Count", only for a tool whose name did not come back.
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
  const links = session.tool_links ?? {};
  const names = session.tool_names ?? {};

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
            {/* Opens the link the admin saved for this tool; tools from before links existed keep their old page. */}
            <a
              className="p-tile"
              href={links[slug] || `/${slug}.html`}
              {...(links[slug] && { target: "_blank", rel: "noopener noreferrer" })}
            >
              <span className="p-tile-name">{names[slug] || pretty(slug)}</span>
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
