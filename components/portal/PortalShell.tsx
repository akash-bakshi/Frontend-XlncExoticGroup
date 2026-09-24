"use client";

import type { ReactNode } from "react";
import { Brand } from "@/components/Brand";
import { LOCATION, ROUTES } from "@/lib/site";
import { signOut } from "@/hooks/useSession";

interface PortalShellProps {
  username: string;
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  children: ReactNode;
}

// Shared chrome of the admin and employee pages, revealed once the session is confirmed.
export function PortalShell({ username, eyebrow, title, sub, children }: PortalShellProps) {
  return (
    <div id="gated">
      <header className="p-bar">
        <div className="container p-bar-in">
          <Brand href={ROUTES.home} alt="" />
          <div className="p-who">
            <span className="p-who-email" id="whoEmail">
              {username}
            </span>
            <button type="button" className="p-btn p-btn-ghost p-btn-sm" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="p-page">
        <div className="container">
          <header className="p-head">
            <p className="p-eyebrow">
              <span className="p-live" aria-hidden="true"></span>
              {eyebrow}
            </p>
            <h1 className="p-title">{title}</h1>
            {sub}
          </header>
          {children}
        </div>
      </main>

      <footer className="p-foot">
        <div className="container">{LOCATION}</div>
      </footer>
    </div>
  );
}
