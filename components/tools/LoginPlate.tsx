"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CoinMark, coinClassName } from "@/components/CoinMark";
import { RevealButton } from "@/components/RevealButton";
import { usePasswordReveal } from "@/hooks/usePasswordReveal";
import { ROUTES } from "@/lib/site";
import { login, type Role } from "@/router/api";
import { useLogin } from "./LoginContext";

const ROLES: Record<Role, { label: string; blurb: string }> = {
  admin: { label: "Admin", blurb: "Full access" },
  employee: { label: "User", blurb: "Everyday tools" },
};

const HELD_STATUSES = ["Suspended", "Unknown", "WrongDoor"];

// Mirrors the plate's current screen in the address bar; cosmetic only.
function setHash(name: string) {
  window.history.replaceState(null, "", `/#${name}`);
}

function RoleChoice({ onPick }: { onPick: (role: Role) => void }) {
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    setHash("sign");
  }, []);

  const half = (role: Role) => (
    <button
      ref={role === "admin" ? firstRef : undefined}
      type="button"
      className="login-half"
      data-role={role}
      onClick={() => onPick(role)}
    >
      <span className="login-half-name">{ROLES[role].label}</span>
      <span className="login-half-sub">{ROLES[role].blurb}</span>
    </button>
  );

  return (
    <>
      <p className="login-prompt">Select your role</p>
      <div className="login-split">
        {half("admin")}
        <span className="login-split-rule"></span>
        {half("employee")}
      </div>
    </>
  );
}

function LoginForm({ role, company, onBack }: { role: Role; company: string | null; onBack: () => void }) {
  const userRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLParagraphElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const password = usePasswordReveal(passRef);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ text: "", held: false, scroll: false });

  useEffect(() => {
    setHash(role);
    userRef.current?.focus();
  }, [role]);

  useEffect(() => {
    if (msg.scroll) msgRef.current?.scrollIntoView({ block: "nearest" });
  }, [msg]);

  // `held` marks answers that retyping cannot fix.
  const say = (text: string, held = false) => setMsg({ text, held, scroll: true });

  const release = () => {
    setBusy(false);
    if (passRef.current) {
      passRef.current.value = "";
      passRef.current.focus();
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = userRef.current?.value.trim() ?? "";
    const pass = passRef.current?.value ?? "";

    if (!user || !pass) {
      setMsg((m) => ({ ...m, text: "Fill in both fields to continue.", scroll: false }));
      return;
    }

    setBusy(true);
    setMsg((m) => ({ ...m, text: "", scroll: false }));

    try {
      const result = await login(user, pass, company, role);
      if (result.correct) {
        // Leave for the page the backend named, not the tab that was clicked.
        window.location.assign(result.role === "admin" ? ROUTES.admin : ROUTES.employee);
        return;
      }
      say(result.message, HELD_STATUSES.includes(result.status));
    } catch (error) {
      say((error as Error).message);
    }
    release();
  };

  return (
    <>
      <p className="login-role-tag">Signing in as {ROLES[role].label}</p>
      <form className="login-form" noValidate onSubmit={onSubmit}>
        <div className="login-field">
          <label htmlFor="loginUser">Username</label>
          <input
            ref={userRef}
            type="text"
            id="loginUser"
            name="username"
            autoComplete="username"
            spellCheck={false}
            autoCapitalize="none"
            required
          />
        </div>
        <div className="login-field">
          <label htmlFor="loginPass">Password</label>
          <div className="login-pass">
            <input
              ref={passRef}
              type={password.type}
              id="loginPass"
              name="password"
              autoComplete="current-password"
              required
            />
            <RevealButton
              className="login-eye"
              id="loginEye"
              controls="loginPass"
              visible={password.visible}
              onToggle={password.toggle}
            />
          </div>
        </div>
        <p
          ref={msgRef}
          className={msg.held ? "login-msg login-msg-held" : "login-msg"}
          role="status"
          aria-live="polite"
        >
          {msg.text}
        </p>
        <button type="submit" className="login-submit" disabled={busy}>
          {busy ? "Checking…" : "Sign in"}
        </button>
        {role === "admin" && (
          <button
            type="button"
            className="login-forgot"
            id="loginForgot"
            onClick={() => window.location.assign(ROUTES.resetPassword)}
          >
            Forgot password?
          </button>
        )}
        <button type="button" className="login-back" id="loginBack" onClick={onBack}>
          Back
        </button>
      </form>
    </>
  );
}

export function LoginPlate() {
  const { company, opener, close } = useLogin();
  const [role, setRole] = useState<Role | null>(null);
  const [openedFor, setOpenedFor] = useState(company);
  const isOpen = company !== null;

  // Every opening starts on the role choice.
  if (openedFor !== company) {
    setOpenedFor(company);
    setRole(null);
  }

  useEffect(() => {
    setHash("tools");
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("login-open");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("login-open");
      document.removeEventListener("keydown", onKey);
      setHash("tools");
      opener?.focus();
    };
  }, [isOpen, opener, close]);

  return (
    <div className="login-overlay" id="loginOverlay" hidden={!isOpen}>
      <div className="login-backdrop" id="loginBackdrop" onClick={close}></div>
      <div className="login-plate" role="dialog" aria-modal="true" aria-labelledby="loginCompany">
        <div className="login-plate-inner">
          <button type="button" className="login-close" id="loginClose" aria-label="Close" onClick={close}>
            &times;
          </button>
          <div className="login-seal" id="loginSeal" aria-hidden="true">
            {company && (
              <button
                type="button"
                className={coinClassName(company)}
                data-name={company.name}
                data-slug={company.slug}
                tabIndex={-1}
                disabled
              >
                <CoinMark company={company} />
              </button>
            )}
          </div>
          <p className="login-eyebrow">Sign in to</p>
          <h2 className="login-company" id="loginCompany">
            {company?.name ?? ""}
          </h2>
          <div className="login-body" id="loginBody">
            {company &&
              (role ? (
                <LoginForm key={role} role={role} company={company.slug} onBack={() => setRole(null)} />
              ) : (
                <RoleChoice onPick={setRole} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
