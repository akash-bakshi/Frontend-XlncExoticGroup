"use client";

import type { CSSProperties } from "react";
import { CoinMark, coinClassName } from "@/components/CoinMark";
import { ChevronRightIcon } from "@/components/icons";
import { COMPANIES } from "@/lib/companies";
import { useLogin } from "./LoginContext";

// One tile per company; a tile opens the sign-in sheet.
export function CompanyGrid() {
  const { open } = useLogin();

  return (
    <ul className="tile-grid" aria-label="Portfolio companies">
      {COMPANIES.map((company, i) => (
        <li key={company.slug} style={{ "--i": i } as CSSProperties}>
          <button
            type="button"
            className="tile"
            aria-label={`Sign in to ${company.name}`}
            onClick={(event) => open(company, event.currentTarget)}
          >
            <span className={coinClassName(company)} aria-hidden="true">
              <CoinMark company={company} />
            </span>
            <span className="tile-tag">{company.tag}</span>
            <span className="tile-name">{company.name}</span>
            <span className="tile-cta">
              Sign in
              <ChevronRightIcon />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
