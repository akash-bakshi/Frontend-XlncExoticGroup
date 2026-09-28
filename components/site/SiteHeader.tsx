"use client";

import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { ArrowRightIcon } from "@/components/icons";

const NAV = [
  { href: "#portfolio", label: "Portfolio" },
  { href: "#approach", label: "Approach" },
  { href: "#sectors", label: "Sectors" },
  { href: "/tools", label: "Tools" },
  { href: "#invest", label: "Invest" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={scrolled ? "site-header scrolled" : "site-header"} id="header">
      <div className="container nav">
        <Brand href="#top" />
        <nav className="nav-links" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <a href="#invest" className="btn btn-primary">
            Partner with us <ArrowRightIcon />
          </a>
          <button
            className="nav-toggle"
            id="navToggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <nav className="mobile-nav" id="mobileNav" aria-label="Mobile">
        {NAV.map((item) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <a href="#invest" className="btn btn-primary" onClick={closeMenu}>
          Partner with us
        </a>
      </nav>
    </header>
  );
}
