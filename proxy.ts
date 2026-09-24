import { NextResponse, type NextRequest } from "next/server";

// Adds the shared key server-side so the backend only answers requests that came through this frontend.
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("X-Frontend-Key", process.env.FRONTEND_API_KEY ?? "");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/api/:path*", "/health", "/ready"],
};
