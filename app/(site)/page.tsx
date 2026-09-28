import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ArrowRightIcon, MailIcon } from "@/components/icons";
import { Coverflow } from "@/components/site/Coverflow";
import { HeroVideo } from "@/components/site/HeroVideo";
import { LogoTray } from "@/components/site/LogoTray";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { COMPANIES } from "@/lib/companies";
import {
  ADDRESS,
  baseMetadata,
  DESCRIPTION,
  EMAIL,
  LOGO,
  PHONE,
  PHONE_DISPLAY,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
} from "@/lib/site";

const TITLE = "XLNC Exotic Group | San Diego Venture Group — We Build, Back & Scale";
const SHARE_TITLE = "XLNC Exotic Group — A San Diego Venture Group";
const SHARE_DESCRIPTION = "We build, back, and scale exceptional companies across seven industries.";
const SHARE_IMAGE = {
  url: "/assets/video/sd-hero.jpg",
  width: 1920,
  height: 1080,
  alt: "XLNC Exotic Group — San Diego coastline",
};

export const metadata: Metadata = {
  ...baseMetadata,
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "business",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Set GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION to the tokens from Search Console and Bing Webmaster Tools.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION && { google: process.env.GOOGLE_SITE_VERIFICATION }),
    ...(process.env.BING_SITE_VERIFICATION && { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }),
  },
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [SHARE_IMAGE.url],
  },
};

const PILLARS = [
  {
    title: "Build",
    icon: <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />,
    text: "We found and operate companies from the ground up — products, brands, and teams engineered to lead their category from day one.",
  },
  {
    title: "Back",
    icon: <path d="M3 17l6-6 4 4 8-8M21 7v6M21 7h-6" />,
    text: "We invest capital, systems, and expertise into ventures — inside the group and beyond — with the ambition to become exceptional.",
  },
  {
    title: "Scale",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18" />
      </>
    ),
    text: "Shared infrastructure across the group — brand, technology, and operations — compounds every company's growth.",
  },
];

const STATS = [
  { num: "10", label: "Companies" },
  { num: "07", label: "Industries" },
  { num: "01", label: "Standard — Excellence" },
  { num: "SD", label: "San Diego, CA" },
];

const SECTORS = [
  "Technology",
  "Construction",
  "Design & Permitting",
  "Hospitality",
  "Real Estate",
  "Legal Tech",
  "Luxury Automotive",
  "Investments & Holdings",
];

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      alternateName: ["XLNC Exotic", "XLNC"],
      url: SITE_URL,
      description: DESCRIPTION,
      slogan: "We build, back & scale the exceptional.",
      logo: { "@type": "ImageObject", url: `${SITE_URL}${LOGO.src}`, width: LOGO.width, height: LOGO.height },
      image: `${SITE_URL}${SHARE_IMAGE.url}`,
      email: EMAIL,
      telephone: PHONE,
      address: {
        "@type": "PostalAddress",
        streetAddress: ADDRESS.street,
        addressLocality: ADDRESS.locality,
        addressRegion: ADDRESS.region,
        postalCode: ADDRESS.postalCode,
        addressCountry: ADDRESS.country,
      },
      areaServed: [
        { "@type": "City", name: "San Diego" },
        { "@type": "State", name: "California" },
        { "@type": "Country", name: "United States" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "business inquiries",
        email: EMAIL,
        telephone: PHONE,
        areaServed: "US",
        availableLanguage: "English",
      },
      knowsAbout: [...SECTORS, "Venture building", "Venture capital", "Business investment"],
      subOrganization: COMPANIES.map((company) => ({
        "@type": "Organization",
        name: company.name,
        description: company.description,
        ...(company.url && { url: company.url }),
        ...(company.logo && { logo: `${SITE_URL}${company.logo.src}` }),
      })),
      ...(SOCIAL_PROFILES.length > 0 && { sameAs: SOCIAL_PROFILES.map((profile) => profile.url) }),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      inLanguage: "en-US",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "en-US",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}${SHARE_IMAGE.url}` },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, "\\u003c") }}
      />

      <SiteHeader />

      <main id="top">
        <section className="hero container">
          <div className="hero-bg" aria-hidden="true">
            <HeroVideo />
            <div className="hero-overlay"></div>
          </div>
          <div className="ambient">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="grid-lines"></div>
          </div>
          <div className="hero-inner">
            <span className="hero-badge">
              <span className="dot"></span> San Diego · A group of companies
            </span>
            <h1>
              We build, back &amp; scale the <em className="grad-text">exceptional</em>.
            </h1>
            <p className="lead">
              XLNC Exotic Group is a San Diego venture group that founds, funds, and grows a portfolio of
              category-leading companies — from technology and construction to hospitality, legal, and luxury
              automotive.
            </p>
            <div className="hero-actions">
              <a href="#portfolio" className="btn btn-primary">
                Explore the portfolio <ArrowRightIcon />
              </a>
              <a href="#invest" className="btn btn-ghost">
                Partner with us
              </a>
            </div>
          </div>
          <LogoTray />
          <Reveal className="stats reveal-stagger" stagger>
            {STATS.map((stat) => (
              <div key={stat.label} className="stat">
                <div className="num grad-text">{stat.num}</div>
                <div className="label">{stat.label}</div>
              </div>
            ))}
          </Reveal>
        </section>

        <section className="section band-dark" id="approach">
          <div className="container">
            <Reveal className="sec-head reveal">
              <span className="eyebrow">The Group</span>
              <h2>
                One group. One standard.
                <br />
                <span className="grad-text">XLNC — say it: excellency.</span>
              </h2>
              <p>
                We don&apos;t chase industries — we chase excellence, then let it compound. Every company in the
                group shares the same operating standard and the same backing: capital, brand, technology, and
                people that turn ambitious ventures into category leaders.
              </p>
            </Reveal>
            <Reveal className="pillars reveal-stagger" stagger>
              {PILLARS.map((pillar, i) => (
                <article key={pillar.title} className="pillar">
                  <span className="idx">{`0${i + 1}`}</span>
                  <div className="pillar-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {pillar.icon}
                    </svg>
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section portfolio" id="portfolio">
          <div className="container">
            <Reveal className="sec-head center reveal">
              <span className="eyebrow center">The Portfolio</span>
              <h2>
                Ten companies.
                <br />
                One relentless standard.
              </h2>
              <p>
                A group spanning seven industries — each brand its own business, all built to the same standard of
                excellence. Select a company to visit its site.
              </p>
            </Reveal>
            <Coverflow companies={COMPANIES} />
          </div>
        </section>

        <section className="section-tight sectors" id="sectors">
          <div className="container">
            <Reveal className="sec-head center reveal" style={{ marginBottom: "2.2rem" }}>
              <span className="eyebrow center">Sectors</span>
              <h2 className="sectors-title">Where we operate</h2>
            </Reveal>
            <Reveal className="sector-list reveal">
              {SECTORS.map((sector) => (
                <span key={sector} className="sector-chip">
                  {sector}
                </span>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section band-dark" id="invest">
          <div className="container">
            <Reveal className="invest-band reveal">
              <span className="eyebrow center">Build with the group</span>
              <h2>
                Looking to invest —
                <br />
                or to be invested in?
              </h2>
              <p>
                XLNC Exotic Group is always seeking exceptional founders, operators, and opportunities — across our
                industries and beyond. If you&apos;re building something remarkable, let&apos;s talk.
              </p>
              <div className="invest-actions">
                <a href={`mailto:${EMAIL}`} className="btn btn-primary">
                  {EMAIL} <MailIcon />
                </a>
                <a href={`tel:${PHONE}`} className="btn btn-ghost">
                  {PHONE_DISPLAY}
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
