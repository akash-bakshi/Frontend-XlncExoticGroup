import { Inter } from "next/font/google";

// Self-hosted Inter for the tools and reset pages: served from this origin and preloaded,
// so first paint no longer waits on fonts.googleapis.com. Their stylesheets read --font-inter.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});
