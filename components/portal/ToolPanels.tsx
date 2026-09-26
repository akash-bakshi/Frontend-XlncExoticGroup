"use client";

import { useRef, useState, type FormEvent } from "react";
import { createTool, deleteTool, type Employee, type Tool } from "@/router/admin-api";
import { bad, Button, Hint, ok, plural, StatusMessage, type Message } from "./ui";

export function CreateToolPanel({ onCreated }: { onCreated: () => void }) {
  const slugRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const slug = slugRef.current!.value.trim().toLowerCase();
    const name = nameRef.current!.value.trim();
    const link = linkRef.current!.value.trim();
    if (!slug || !name || !link) {
      setMessage(bad("All fields are required."));
      return;
    }
    if (!/^https?:\/\/[^\s/]+/i.test(link)) {
      setMessage(bad("Tool link must start with http:// or https://."));
      return;
    }

    setBusy(true);
    try {
      const tool = await createTool(slug, name, link, null);
      setMessage(ok(`Created ${tool.name}.`));
      slugRef.current!.value = "";
      nameRef.current!.value = "";
      linkRef.current!.value = "";
      onCreated();
    } catch (error) {
      setMessage(bad((error as Error).message));
    }
    setBusy(false);
  };

  return (
    <section className="p-panel">
      <h2 className="p-panel-title">Create a tool</h2>
      <p className="p-panel-note">
        A tool exists once, then can be given to any user. The tool code is what the system uses and never
        changes; the tool name is what people read.
      </p>

      <form className="p-form" id="toolForm" noValidate autoComplete="off" onSubmit={onSubmit}>
        <div className="p-row p-row-2">
          <div className="p-field">
            <label htmlFor="toolName">Tool name</label>
            <input ref={nameRef} type="text" id="toolName" placeholder="Inventory Tool" required />
            <span className="p-hint">What people read.</span>
          </div>
          <div className="p-field">
            <label htmlFor="toolSlug">Tool code</label>
            <input
              ref={slugRef}
              type="text"
              id="toolSlug"
              placeholder="inventory"
              spellCheck={false}
              autoCapitalize="none"
              required
            />
            <span className="p-hint">Lowercase, digits, hyphens. Cannot change later.</span>
          </div>
        </div>
        <div className="p-row">
          <div className="p-field">
            <label htmlFor="toolLink">Tool link</label>
            <input
              ref={linkRef}
              type="url"
              id="toolLink"
              placeholder="https://inventory.example.com"
              spellCheck={false}
              autoCapitalize="none"
              maxLength={2048}
              required
            />
            <span className="p-hint">Where the tool opens. Full URL starting with https://.</span>
          </div>
        </div>
        <div className="p-actions">
          <button type="submit" className="p-btn p-btn-ghost" id="toolBtn" disabled={busy}>
            {busy ? "Creating…" : "Create tool"}
          </button>
          <StatusMessage id="toolMsg" message={message} />
        </div>
      </form>
    </section>
  );
}

type RowPhase = "asking" | "working";

interface ToolRowProps {
  tool: Tool;
  holders: Employee[] | null;
  phase: RowPhase | null;
  onAsk: () => void;
  onKeep: () => void;
  onDelete: () => void;
  onBlocked: () => void;
}

function ToolRow({ tool, holders, phase, onAsk, onKeep, onDelete, onBlocked }: ToolRowProps) {
  if (phase) {
    return (
      <div
        className={`p-tool p-tool-${phase}`}
        onKeyDown={(event) => event.key === "Escape" && phase === "asking" && onKeep()}
      >
        <div className="p-tool-face">
          <span className="p-tool-ask">Delete {tool.name}? Nobody has it, and it cannot be brought back.</span>
          <Button onClick={onKeep}>Keep it</Button>
          <Button className="p-btn p-btn-sm p-btn-solid-danger" onClick={onDelete} autoFocus>
            Delete
          </Button>
        </div>
      </div>
    );
  }

  const held = holders && holders.length > 0;
  return (
    <div className="p-tool">
      <div className="p-tool-face">
        <span className="p-tool-name">{tool.name}</span>
        <code className="p-tool-code">{tool.slug}</code>
        {held && (
          <span className="p-tool-used" title={holders.map((e) => `${e.email} (${e.company_slug})`).join(", ")}>
            {holders.length === 1 ? "1 user has this" : `${holders.length} users have this`}
          </span>
        )}
        {held ? (
          <Button className="p-btn p-btn-ghost p-btn-sm p-btn-blocked" onClick={onBlocked}>
            Delete
          </Button>
        ) : (
          <Button className="p-btn p-btn-ghost p-btn-sm p-btn-danger" onClick={onAsk}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

interface ToolListProps {
  tools: Tool[];
  employees: Employee[] | null;
  onMessage: (message: Message) => void;
  onDeleted: () => void;
  onFailed: () => void;
}

// Keyed by the console on every data load, so an open confirmation resets like a redraw.
function ToolList({ tools, employees, onMessage, onDeleted, onFailed }: ToolListProps) {
  const [open, setOpen] = useState<{ slug: string; phase: RowPhase } | null>(null);

  const remove = async (tool: Tool) => {
    setOpen({ slug: tool.slug, phase: "working" });
    onMessage(ok(""));
    try {
      await deleteTool(tool.slug);
      onMessage(ok(`Deleted ${tool.name}.`));
      onDeleted();
    } catch (error) {
      onMessage(bad((error as Error).message));
      onFailed();
    }
  };

  const explainBlocked = (tool: Tool, holders: Employee[]) => {
    const who = holders.map((e) => e.email);
    const shown = who.slice(0, 5).join(", ") + (who.length > 5 ? `, and ${who.length - 5} more` : "");
    onMessage(
      bad(
        `Cannot delete ${tool.name} — ${shown}${who.length === 1 ? " has" : " have"} it. ` +
          "Remove it from them in User access below, then delete."
      )
    );
  };

  if (!tools.length) return <Hint>Create your first tool above.</Hint>;

  return (
    <>
      {tools.map((tool) => {
        const holders = employees && employees.filter((emp) => emp.tools.includes(tool.slug));
        return (
          <ToolRow
            key={tool.slug}
            tool={tool}
            holders={holders}
            phase={open?.slug === tool.slug ? open.phase : null}
            onAsk={() => setOpen({ slug: tool.slug, phase: "asking" })}
            onKeep={() => setOpen(null)}
            onDelete={() => remove(tool)}
            onBlocked={() => holders && explainBlocked(tool, holders)}
          />
        );
      })}
    </>
  );
}

interface ToolsPanelProps {
  tools: Tool[] | null;
  error: string | null;
  employees: Employee[] | null;
  version: number;
  onChanged: () => void;
  onToolsStale: () => void;
}

export function ToolsPanel({ tools, error, employees, version, onChanged, onToolsStale }: ToolsPanelProps) {
  const [message, setMessage] = useState<Message>(null);

  return (
    <section className="p-panel">
      <h2 className="p-panel-title">Tools</h2>
      <p className="p-panel-note">Every tool you can hand to a user. One can be deleted once nobody has it.</p>

      <div className="p-count">
        <span className="p-count-n" id="toolCount">
          {tools && !error ? tools.length : "—"}
        </span>
        <span className="p-count-label" id="toolCountLabel">
          {tools ? plural(tools.length, "tool") : "tools"}
        </span>
      </div>
      <div className="p-tools" id="toolTags">
        {error ? (
          <Hint>{error}</Hint>
        ) : tools ? (
          <ToolList
            key={version}
            tools={tools}
            employees={employees}
            onMessage={setMessage}
            onDeleted={onChanged}
            onFailed={onToolsStale}
          />
        ) : (
          <Hint>Loading…</Hint>
        )}
      </div>
      <StatusMessage id="toolListMsg" message={message} />
    </section>
  );
}
