import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/lib/site";
import { toolPath } from "@/lib/tool-url";
import type { Session } from "@/router/api";

// Answered on the server, so the tab forwards at once instead of loading a page first.
export const dynamic = "force-dynamic";

const API = (process.env.API_PROXY_TARGET ?? "").replace(/\/+$/, "");

const NOT_YOURS = `<!doctype html><meta charset="utf-8"><title>XLNC Exotic Group</title>
<body style="background:#06161a;color:#e8e2d4;font-family:system-ui,sans-serif;padding:2rem">
<p>You do not have this tool. <a href="${ROUTES.employee}" style="color:#e2b865">Back to your tools</a></p></body>`;

// /tools/<tool name> -> the link the admin saved, found among this employee's own tools only.
export async function GET(request: NextRequest, { params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const headers: Record<string, string> = {
    "X-Frontend-Key": process.env.FRONTEND_API_KEY ?? "",
    cookie: request.headers.get("cookie") ?? "",
  };
  // Same caller address the /api rewrite would pass, so rate limits stay per person.
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) headers["x-forwarded-for"] = forwarded;

  const res = await fetch(`${API}/api/auth/me`, { headers, cache: "no-store" }).catch(() => null);
  const who: Session | null = res?.ok ? await res.json() : null;
  const go = (to: string | URL) => {
    const out = NextResponse.redirect(to);
    out.headers.set("Cache-Control", "no-store");
    return out;
  };

  if (!who?.role) return go(new URL(ROUTES.tools, request.url));
  if (who.role !== "employee") return go(new URL(ROUTES.admin, request.url));

  const names = who.tool_names ?? {};
  const links = who.tool_links ?? {};
  const want = `/tools/${decodeURIComponent(tool).toLowerCase()}`;
  const slug = (who.tools ?? []).find((s) => toolPath(names[s] || s, s) === want);
  if (!slug) {
    return new NextResponse(NOT_YOURS, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
  return go(links[slug] || new URL(`/${slug}.html`, request.url));
}
