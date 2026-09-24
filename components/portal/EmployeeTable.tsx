"use client";

import { Fragment, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { usePasswordReveal } from "@/hooks/usePasswordReveal";
import {
  activate,
  remove,
  setPassword,
  setTools,
  suspend,
  type Employee,
  type Tool,
} from "@/router/admin-api";
import { bad, Button, Hint, plural, StatusMessage, Tag, type Message } from "./ui";

// Columns in the employee table; every strip that opens under a row spans them all.
const COLS = 6;

type StripKind = "tools" | "pass" | "del";

const STRIP_IDS: Record<StripKind, string> = {
  tools: "toolEditRow",
  pass: "passEditRow",
  del: "delEditRow",
};

const keyOf = (emp: Employee) => `${emp.email}@@${emp.company_slug}`;

interface StripProps {
  emp: Employee;
  tools: Tool[];
  close: () => void;
  run: (promise: Promise<unknown>) => void;
}

function Strip({ kind, emp, className = "p-edit-cell", onEscape, children }: {
  kind: StripKind;
  emp: Employee;
  className?: string;
  onEscape?: () => void;
  children: ReactNode;
}) {
  const onKeyDown = (event: KeyboardEvent) => {
    if (onEscape && event.key === "Escape") onEscape();
  };
  return (
    <tr id={STRIP_IDS[kind]} data-email={keyOf(emp)} onKeyDown={onKeyDown}>
      <td colSpan={COLS} className={className}>
        {children}
      </td>
    </tr>
  );
}

function ToolsStrip({ emp, tools, close, run }: StripProps) {
  const cellRef = useRef<HTMLDivElement>(null);

  const save = () => {
    const boxes = cellRef.current?.querySelectorAll<HTMLInputElement>("[data-edit-tool]:checked") ?? [];
    const slugs = Array.from(boxes, (box) => box.value);
    close();
    run(setTools(emp.email, emp.company_slug, slugs));
  };

  return (
    <Strip kind="tools" emp={emp}>
      <p className="p-edit-head">Tools for {emp.email}</p>
      <p className="p-edit-lede">
        Tick to give a tool, untick to take it away. As many as you like, saved in one go.
      </p>
      {tools.length ? (
        <div className="p-checks" ref={cellRef}>
          {tools.map((tool) => (
            <label key={tool.slug} className="p-check">
              <input
                type="checkbox"
                value={tool.slug}
                data-edit-tool=""
                defaultChecked={emp.tools.includes(tool.slug)}
              />
              <span>{tool.name}</span>
            </label>
          ))}
        </div>
      ) : (
        <Hint>No tools yet — create one in Create a tool above.</Hint>
      )}
      <div className="p-actions p-edit-actions">
        <Button className="p-btn p-btn-sm" onClick={save}>
          Save tools
        </Button>
        <Button onClick={close}>Cancel</Button>
      </div>
    </Strip>
  );
}

function PasswordStrip({ emp, close, run }: StripProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const password = usePasswordReveal(inputRef);
  const [note, setNote] = useState<Message>(null);

  const save = () => {
    const next = inputRef.current?.value ?? "";
    if (next.length < 8) {
      setNote(bad("Password must be at least 8 characters."));
      inputRef.current?.focus();
      return;
    }
    close();
    run(setPassword(emp.email, emp.company_slug, next));
  };

  return (
    <Strip kind="pass" emp={emp} onEscape={close}>
      <p className="p-edit-head">Password for {emp.email}</p>
      <p className="p-edit-lede">
        Type the new password and tell it to them yourself. It replaces the old one at once, and the old one is
        gone.
      </p>
      <div className="p-pass p-pass-edit">
        <input
          ref={inputRef}
          type={password.type}
          autoComplete="new-password"
          spellCheck={false}
          placeholder="At least 8 characters"
          autoFocus
        />
        <button type="button" className="p-pass-eye" aria-pressed={password.visible} onClick={password.toggle}>
          {password.visible ? "Hide" : "Show"}
        </button>
      </div>
      <StatusMessage message={note} live={false} />
      <div className="p-actions p-edit-actions">
        <Button className="p-btn p-btn-sm" onClick={save}>
          Save password
        </Button>
        <Button onClick={close}>Cancel</Button>
      </div>
    </Strip>
  );
}

function DeleteStrip({ emp, close, run }: StripProps) {
  const count = emp.tools.length;
  const held = count ? ` along with ${count} ${plural(count, "tool")} they hold.` : ".";

  return (
    <Strip kind="del" emp={emp} className="p-edit-cell p-edit-danger" onEscape={close}>
      <p className="p-edit-head">Delete {emp.email}?</p>
      <p className="p-edit-lede">{`This removes them from ${emp.company_slug}${held} It cannot be undone.`}</p>
      <div className="p-actions p-edit-actions">
        <Button
          className="p-btn p-btn-sm p-btn-solid-danger"
          onClick={() => {
            close();
            run(remove(emp.email, emp.company_slug));
          }}
          autoFocus
        >
          Delete
        </Button>
        <Button onClick={close}>Keep them</Button>
      </div>
    </Strip>
  );
}

const STRIPS: Record<StripKind, (props: StripProps) => ReactNode> = {
  tools: ToolsStrip,
  pass: PasswordStrip,
  del: DeleteStrip,
};

interface RowProps {
  emp: Employee;
  toolName: (slug: string) => string;
  onStrip: (kind: StripKind) => void;
  run: (promise: Promise<unknown>) => void;
}

function EmployeeRow({ emp, toolName, onStrip, run }: RowProps) {
  const name = [emp.first_name || "", emp.last_name || ""].join(" ").trim();
  const active = emp.status === "active";

  return (
    <tr>
      <td>{name || <Tag none>no name</Tag>}</td>
      <td className="p-id">
        <div className="p-id-email">{emp.email}</div>
      </td>
      <td>{emp.company_slug}</td>
      <td>
        {emp.tools.length ? (
          emp.tools.map((slug) => (
            <Tag key={slug} title={slug}>
              {toolName(slug)}
            </Tag>
          ))
        ) : (
          <Tag none>none</Tag>
        )}
      </td>
      <td className={active ? "p-status-active" : "p-status-suspended"}>{emp.status}</td>
      <td>
        <div className="p-row-actions">
          <Button onClick={() => onStrip("tools")}>Edit tools</Button>
          <Button onClick={() => onStrip("pass")}>Reset password</Button>
          {active ? (
            <Button onClick={() => run(suspend(emp.email, emp.company_slug))}>Suspend</Button>
          ) : (
            <Button onClick={() => run(activate(emp.email, emp.company_slug))}>Activate</Button>
          )}
          <Button className="p-btn p-btn-ghost p-btn-sm p-btn-danger" onClick={() => onStrip("del")}>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

interface EmployeeTableProps {
  employees: Employee[] | null;
  tools: Tool[];
  note: string;
  message: Message;
  run: (promise: Promise<unknown>) => void;
}

// Keyed by the console on every data load, so an open strip closes like a redraw.
export function EmployeeTable({ employees, tools, note, message, run }: EmployeeTableProps) {
  const [strip, setStrip] = useState<{ kind: StripKind; key: string } | null>(null);
  const close = () => setStrip(null);

  const toolName = (slug: string) => tools.find((t) => t.slug === slug)?.name ?? slug;

  // Only one editor is open at a time; asking for the open one again closes it.
  const toggle = (kind: StripKind, key: string) =>
    setStrip((open) => (open?.kind === kind && open.key === key ? null : { kind, key }));

  return (
    <section className="p-panel">
      <h2 className="p-panel-title">User access</h2>
      <p className="p-panel-note" id="listNote">
        {note}
      </p>

      <div className="p-table-wrap">
        <table className="p-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Tools</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="empRows">
            {employees && !employees.length && (
              <tr>
                <td colSpan={COLS} className="p-empty">
                  Nobody yet.
                </td>
              </tr>
            )}
            {employees?.map((emp) => {
              const key = keyOf(emp);
              const StripView = strip?.key === key ? STRIPS[strip.kind] : null;
              return (
                <Fragment key={key}>
                  <EmployeeRow emp={emp} toolName={toolName} onStrip={(kind) => toggle(kind, key)} run={run} />
                  {StripView && <StripView emp={emp} tools={tools} close={close} run={run} />}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <StatusMessage id="listMsg" message={message} />
    </section>
  );
}
