"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Company } from "@/lib/companies";

interface LoginState {
  company: Company | null;
  opener: HTMLElement | null;
}

interface LoginContextValue extends LoginState {
  open: (company: Company, opener: HTMLElement) => void;
  close: () => void;
}

const LoginContext = createContext<LoginContextValue | null>(null);

export function LoginProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoginState>({ company: null, opener: null });
  const open = useCallback((company: Company, opener: HTMLElement) => setState({ company, opener }), []);
  const close = useCallback(() => setState((s) => ({ ...s, company: null })), []);
  const value = useMemo(() => ({ ...state, open, close }), [state, open, close]);

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
}

export function useLogin(): LoginContextValue {
  const value = useContext(LoginContext);
  if (!value) throw new Error("useLogin must be used inside <LoginProvider>");
  return value;
}
