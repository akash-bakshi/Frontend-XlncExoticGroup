import { Fraunces, Jost } from "next/font/google";

// Self-hosted copies of the home page's typefaces, served from this origin and preloaded so first paint
// never waits on fonts.googleapis.com. Stylesheets read them through --font-fraunces and --font-jost.
export const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

export const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});
