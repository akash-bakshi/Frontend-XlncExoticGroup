import type { NextConfig } from "next";

// Server-only: the backend address never reaches the browser.
const apiTarget = process.env.API_PROXY_TARGET?.replace(/\/+$/, "");
if (!apiTarget) throw new Error("API_PROXY_TARGET is not set. Add it to .env (local) or the Vercel project settings.");
if (!process.env.FRONTEND_API_KEY) throw new Error("FRONTEND_API_KEY is not set. Add it to .env (local) or the Vercel project settings.");

const legacyPages = ["index", "tools", "admin", "employee", "admin_change_password"];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  reactStrictMode: true,
  // The stylesheets size logos from their intrinsic pixels, which density-based srcsets would change.
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${apiTarget}/api/:path*` },
      { source: "/health", destination: `${apiTarget}/health` },
      { source: "/ready", destination: `${apiTarget}/ready` },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.xlncexotic.com" }],
        destination: "https://xlncexotic.com/:path*",
        permanent: true,
      },
      ...legacyPages.map((page) => ({
        source: `/${page}.html`,
        destination: page === "index" ? "/" : `/${page}`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
    ];
  },
};

export default nextConfig;
