"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type RefObject } from "react";
import { RevealButton } from "@/components/RevealButton";
import { usePasswordReveal } from "@/hooks/usePasswordReveal";
import { LOGO_MARK, ROUTES } from "@/lib/site";
import type { ApiError } from "@/router/api";
import { reset } from "@/router/admin_change_password";

const MIN = 8;
const LEAVE_MS = 2600;
const GRADES = ["", "Too short", "Weak", "Good", "Strong"];

type Field = "secret" | "username" | "newPass" | "confirmPass";
type Tone = "" | "ok" | "bad" | "wait";

// 95 seconds reads as 1:35; under a minute stays in plain seconds.
function clock(seconds: number): string {
  if (seconds < 60) return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  const rest = seconds % 60;
  return `${Math.floor(seconds / 60)}:${rest < 10 ? "0" : ""}${rest}`;
}

// Advice, not a rule: the backend only enforces the minimum length.
function grade(value: string): number {
  if (!value) return 0;
  if (value.length < MIN) return 1;
  let score = 1;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 4);
}

function check(values: Record<Field, string>): { field: Field; text: string } | null {
  if (!values.secret) return { field: "secret", text: "Type the reset password." };
  if (!values.username) return { field: "username", text: "Type the admin email to reset." };
  if (values.username.indexOf("@") < 1) return { field: "username", text: "That is not an email address." };
  if (values.newPass.length < MIN) {
    return { field: "newPass", text: `The new password needs at least ${MIN} characters.` };
  }
  if (values.newPass !== values.confirmPass) return { field: "confirmPass", text: "Password Not Matching" };
  return null;
}

export function ResetPasswordForm() {
  const secretRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const newPassRef = useRef<HTMLInputElement>(null);
  const confirmPassRef = useRef<HTMLInputElement>(null);
  const secret = usePasswordReveal(secretRef);
  const newPass = usePasswordReveal(newPassRef);
  const confirmPass = usePasswordReveal(confirmPassRef);

  const [values, setValues] = useState<Record<Field, string>>({
    secret: "",
    username: "",
    newPass: "",
    confirmPass: "",
  });
  const [badField, setBadField] = useState<Field | null>(null);
  const [msg, setMsg] = useState<{ text: string; tone: Tone }>({ text: "", tone: "" });
  const [busy, setBusy] = useState(false);
  const [waitLeft, setWaitLeft] = useState(0);
  const [doneFor, setDoneFor] = useState<string | null>(null);

  useEffect(() => {
    window.history.replaceState(null, "", "/#admin_change_password");
  }, []);

  // 429 lockout: nothing may be sent until the Retry-After wait has run out.
  useEffect(() => {
    if (waitLeft <= 0) return;
    const timer = setTimeout(() => {
      const left = waitLeft - 1;
      setWaitLeft(left);
      setMsg(left > 0
        ? { text: `Too many attempts. Try again in ${clock(left)}.`, tone: "wait" }
        : { text: "You can try again now.", tone: "ok" });
    }, 1000);
    return () => clearTimeout(timer);
  }, [waitLeft]);

  useEffect(() => {
    if (doneFor === null) return;
    const timer = setTimeout(() => window.location.replace(ROUTES.tools), LEAVE_MS);
    return () => clearTimeout(timer);
  }, [doneFor]);

  const say = (text: string, tone: Tone) => setMsg({ text, tone });

  const focusField = (field: Field, select = false) => {
    const refs: Record<Field, RefObject<HTMLInputElement | null>> = {
      secret: secretRef,
      username: usernameRef,
      newPass: newPassRef,
      confirmPass: confirmPassRef,
    };
    const input = refs[field].current;
    input?.focus();
    if (select) input?.select();
  };

  const update = (field: Field) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValues((v) => ({ ...v, [field]: value }));
    // An outlined field answers the last attempt; editing it makes that answer stale.
    if (badField === field) setBadField(null);
  };

  const failed = (error: ApiError) => {
    setBusy(false);

    if (error.status === 429) {
      if (waitLeft > 0) return;
      const seconds = error.retryAfter ?? 0;
      if (seconds <= 0) {
        say(error.message || "Too many attempts. Try again in a few minutes.", "bad");
        return;
      }
      setWaitLeft(seconds);
      say(`Too many attempts. Try again in ${clock(seconds)}.`, "wait");
      return;
    }

    const field: Field | null =
      error.status === 403
        ? "secret"
        : error.status === 404
          ? "username"
          : error.status === 422
            ? /match/i.test(error.message)
              ? "confirmPass"
              : "newPass"
            : null;

    say(error.message, "bad");
    if (field) {
      setBadField(field);
      focusField(field, true);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || waitLeft > 0) return;

    const submitted = { ...values, username: values.username.trim() };
    const problem = check(submitted);
    if (problem) {
      setBadField(problem.field);
      say(problem.text, "bad");
      focusField(problem.field);
      return;
    }

    setBadField(null);
    say("Changing the password…", "");
    setBusy(true);

    try {
      const data = await reset(submitted.secret, submitted.username, submitted.newPass, submitted.confirmPass);
      setDoneFor(data.username);
    } catch (error) {
      failed(error as ApiError);
    }
  };

  const bad = (field: Field) => (badField === field ? "r-bad" : undefined);
  const meterGrade = grade(values.newPass);
  const matches = values.confirmPass === values.newPass;

  return (
    <main className="r-plate">
      <span className="r-edge" aria-hidden="true"></span>

      <div className="r-plate-in" id="plateForm" hidden={doneFor !== null}>
        <div className="r-seal" aria-hidden="true">
          <Image src={LOGO_MARK.src} width={LOGO_MARK.width} height={LOGO_MARK.height} alt="" loading="eager" />
        </div>

        <p className="r-eyebrow">Admin recovery Portal</p>
        <h1 className="r-title">
          Reset an <em>admin</em> password
        </h1>
        <p className="r-lede">Reset the password for an admin email address.</p>

        <form className="r-form" id="resetForm" noValidate autoComplete="off" onSubmit={onSubmit}>
          <div className="r-field">
            <label htmlFor="secret">Admin Reset Password</label>
            <div className="r-pass">
              <input
                ref={secretRef}
                className={bad("secret")}
                type={secret.type}
                id="secret"
                name="xlnc-reset-secret"
                placeholder="*********"
                autoComplete="off"
                required
                value={values.secret}
                onChange={update("secret")}
              />
              <RevealButton className="r-eye" controls="secret" visible={secret.visible} onToggle={secret.toggle} />
            </div>
          </div>

          <div className="r-split" aria-hidden="true">
            <span>New password</span>
          </div>

          <div className="r-field">
            <div className="r-field">
              <label htmlFor="username">Admin Existing Email ID</label>
              <input
                ref={usernameRef}
                className={bad("username")}
                type="email"
                id="username"
                name="xlnc-reset-email"
                placeholder="admin@xlncbuilder.com"
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="none"
                required
                value={values.username}
                onChange={update("username")}
              />
            </div>

            <label htmlFor="newPass">New Password</label>
            <div className="r-pass">
              <input
                ref={newPassRef}
                className={bad("newPass")}
                type={newPass.type}
                id="newPass"
                name="xlnc-reset-new"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={MIN}
                required
                value={values.newPass}
                onChange={update("newPass")}
              />
              <RevealButton className="r-eye" controls="newPass" visible={newPass.visible} onToggle={newPass.toggle} />
            </div>
            <div className="r-meter" id="meter" hidden={!meterGrade} data-grade={meterGrade || undefined}>
              <div className="r-meter-bar" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={i < meterGrade ? "on" : undefined}></span>
                ))}
              </div>
              <span className="r-meter-word" id="meterWord" role="status" aria-live="polite">
                {meterGrade === 1 && values.newPass.length >= MIN ? "Weak" : GRADES[meterGrade]}
              </span>
            </div>
          </div>

          <div className="r-field">
            <label htmlFor="confirmPass">Confirm New Password</label>
            <div className="r-pass r-pass-both">
              <input
                ref={confirmPassRef}
                className={bad("confirmPass")}
                type={confirmPass.type}
                id="confirmPass"
                name="xlnc-reset-confirm"
                placeholder="Type New Password Again"
                autoComplete="new-password"
                minLength={MIN}
                required
                value={values.confirmPass}
                onChange={update("confirmPass")}
              />
              <span
                className={values.confirmPass ? `r-match ${matches ? "r-match-ok" : "r-match-bad"}` : "r-match"}
                id="matchMark"
                hidden={!values.confirmPass}
              >
                {values.confirmPass && (matches ? "✓" : "✕")}
              </span>
              <RevealButton
                className="r-eye"
                controls="confirmPass"
                visible={confirmPass.visible}
                onToggle={confirmPass.toggle}
              />
            </div>
          </div>

          <button type="submit" className="r-submit" id="resetBtn" disabled={busy || waitLeft > 0}>
            {busy ? "Changing…" : "Change Password"}
          </button>
          <p className={msg.tone ? `r-msg r-msg-${msg.tone}` : "r-msg"} id="resetMsg" role="status" aria-live="polite">
            {msg.text}
          </p>
        </form>

        <p className="r-foot">
          <a href={ROUTES.tools}>Back to sign in</a>
        </p>
      </div>

      <div className="r-plate-in r-done" id="plateDone" hidden={doneFor === null}>
        <div className="r-tick" aria-hidden="true">
          <svg viewBox="0 0 44 44" width="44" height="44">
            <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
            <path
              d="M13 22.5 L19.5 29 L31 17"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="r-done-title">Password changed</h2>
        <p className="r-done-who" id="doneWho">
          {doneFor}
        </p>
        <p className="r-done-note">The old password stopped working straight away. Sign in with the new one.</p>
        <a className="r-submit r-submit-link" href={ROUTES.tools}>
          Go to sign in
        </a>
      </div>
    </main>
  );
}
