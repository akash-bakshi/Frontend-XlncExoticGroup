"use client";

import { useRef, useState, type FormEvent } from "react";
import { RevealButton } from "@/components/RevealButton";
import { usePasswordReveal } from "@/hooks/usePasswordReveal";
import { createEmployee, type Tool } from "@/router/admin-api";
import { bad, Hint, ok, StatusMessage, type Message } from "./ui";

interface AddEmployeePanelProps {
  companies: string[];
  tools: Tool[] | null;
  toolsError: string | null;
  onAdded: () => void;
}

export function AddEmployeePanel({ companies, tools, toolsError, onAdded }: AddEmployeePanelProps) {
  const passRef = useRef<HTMLInputElement>(null);
  const password = usePasswordReveal(passRef);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const pickCompany = companies.length > 1;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const first = String(data.get("xlnc-emp-first") ?? "").trim();
    const last = String(data.get("xlnc-emp-last") ?? "").trim();
    const email = String(data.get("xlnc-emp-email") ?? "").trim().toLowerCase();
    const pass = String(data.get("xlnc-emp-pass") ?? "");

    if (!first || !last) return setMessage(bad("First name and last name are both required."));
    if (!email || !pass) return setMessage(bad("Email and password are both required."));
    if (pass.length < 8) return setMessage(bad("Password must be at least 8 characters."));

    const company = pickCompany ? String(data.get("xlnc-emp-company") ?? "") : null;
    const toolSlugs = data.getAll("xlnc-emp-tool").map(String);

    setBusy(true);
    try {
      const emp = await createEmployee(email, pass, toolSlugs, company, first, last);
      const n = emp.tools.length;
      setMessage(ok(`${emp.email} added with ${n || "no"} tool${n === 1 ? "" : "s"}.`));
      form.reset();
      onAdded();
    } catch (error) {
      setMessage(bad((error as Error).message));
    }
    setBusy(false);
  };

  const toolChecks = () => {
    if (toolsError) return <Hint>{toolsError}</Hint>;
    if (!tools) return <Hint>Loading tools…</Hint>;
    if (!tools.length) return <Hint>No tools yet — create one in the panel above.</Hint>;
    return tools.map((tool) => (
      <label key={tool.slug} className="p-check">
        <input type="checkbox" name="xlnc-emp-tool" value={tool.slug} data-tool="" />
        <span>{tool.name}</span>
      </label>
    ));
  };

  return (
    <section className="p-panel">
      <h2 className="p-panel-title">Add a user</h2>
      <p className="p-panel-note">
        They sign in with this email and password on the same sign-in plate as you. Tick the tools they may open.
      </p>

      <form
        className="p-form"
        id="addForm"
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
        onReset={() => password.setVisible(false)}
      >
        <div className="p-row p-row-2">
          <div className="p-field">
            <label htmlFor="empFirst">First name</label>
            <input
              type="text"
              id="empFirst"
              name="xlnc-emp-first"
              placeholder="Jane"
              autoComplete="off"
              spellCheck={false}
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="empLast">Last name</label>
            <input
              type="text"
              id="empLast"
              name="xlnc-emp-last"
              placeholder="Doe"
              autoComplete="off"
              spellCheck={false}
              required
            />
          </div>
        </div>

        <div className="p-row p-row-2">
          <div className="p-field">
            <label htmlFor="empEmail">User email</label>
            <input
              type="email"
              id="empEmail"
              name="xlnc-emp-email"
              placeholder="name@company.com"
              autoComplete="off"
              spellCheck={false}
              autoCapitalize="none"
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="empPass">Password</label>
            <div className="p-pass">
              <input
                ref={passRef}
                type={password.type}
                id="empPass"
                name="xlnc-emp-pass"
                autoComplete="new-password"
                required
              />
              <RevealButton
                className="p-pass-eye"
                id="empPassToggle"
                controls="empPass"
                visible={password.visible}
                onToggle={password.toggle}
              />
            </div>
            <span className="p-hint">At least 8 characters. Tell it to them yourself.</span>
          </div>
        </div>

        <div className="p-field" id="companyPick" hidden={!pickCompany}>
          <label htmlFor="empCompany">Company</label>
          <select id="empCompany" name="xlnc-emp-company">
            {pickCompany &&
              companies.map((slug) => (
                <option key={slug} value={slug}>
                  {slug}
                </option>
              ))}
          </select>
        </div>

        <div className="p-field">
          <label>Tools</label>
          <div className="p-checks" id="toolChecks">
            {toolChecks()}
          </div>
        </div>

        <div className="p-actions">
          <button type="submit" className="p-btn" id="addBtn" disabled={busy}>
            {busy ? "Adding…" : "Add user"}
          </button>
          <StatusMessage id="addMsg" message={message} />
        </div>
      </form>
    </section>
  );
}
