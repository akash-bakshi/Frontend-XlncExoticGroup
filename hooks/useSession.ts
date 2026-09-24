"use client";

import { useEffect, useState } from "react";
import { ROUTES } from "@/lib/site";
import { logout, me, type Role, type Session } from "@/router/api";

export function signOut() {
  logout().finally(() => window.location.replace(ROUTES.tools));
}

// Resolves only for a session whose role matches; everyone else is sent elsewhere.
export function useSession(role: Role): Session | null {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let active = true;
    me().then((who) => {
      if (!active) return;
      if (!who?.role) {
        window.location.replace(ROUTES.tools);
      } else if (who.role !== role) {
        window.location.replace(who.role === "admin" ? ROUTES.admin : ROUTES.employee);
      } else {
        setSession(who);
      }
    });
    return () => {
      active = false;
    };
  }, [role]);

  return session;
}
