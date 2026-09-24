"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import * as AdminAPI from "@/router/admin-api";
import type { Employee, Tool } from "@/router/admin-api";
import { AddEmployeePanel } from "./AddEmployeePanel";
import { EmployeeTable } from "./EmployeeTable";
import { PortalShell } from "./PortalShell";
import { CreateToolPanel, ToolsPanel } from "./ToolPanels";
import { bad, ok, plural, type Message } from "./ui";

export function AdminConsole() {
  const session = useSession("admin");
  const [tools, setTools] = useState<Tool[] | null>(null);
  const [toolsError, setToolsError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [note, setNote] = useState("Loading…");
  const [listMessage, setListMessage] = useState<Message>(null);
  // Bumped on every successful load; lists keyed on it drop any open editor, as a redraw would.
  const [version, setVersion] = useState(0);

  const loadTools = useCallback(() => {
    AdminAPI.tools().then(
      (list) => {
        setTools(list);
        setToolsError(null);
        setVersion((v) => v + 1);
      },
      (error: Error) => setToolsError(error.message)
    );
  }, []);

  const loadEmployees = useCallback(() => {
    AdminAPI.employees().then(
      (people) => {
        setEmployees(people);
        setNote(`${people.length} ${plural(people.length, "user")}`);
        setVersion((v) => v + 1);
      },
      (error: Error) => {
        setNote("");
        setListMessage(bad(error.message));
      }
    );
  }, []);

  useEffect(() => {
    if (!session) return;
    loadTools();
    loadEmployees();
  }, [session, loadTools, loadEmployees]);

  // Every row action ends the same way: report, then redraw from the server.
  const run = useCallback(
    (promise: Promise<unknown>) => {
      setListMessage(ok(""));
      promise.then(
        () => setListMessage(ok("Saved.")),
        (error: Error) => setListMessage(bad(error.message))
      ).finally(loadEmployees);
    },
    [loadEmployees]
  );

  if (!session) return <div id="gated" hidden />;

  const companies = session.companies ?? [];
  const company = companies.length === 1 ? companies[0] : "";
  const title = company ? (
    <>
      Welcome To <span id="whoCompany">{company}</span> Admin Portal
    </>
  ) : (
    "Welcome To The Admin Portal"
  );

  return (
    <PortalShell username={session.username} eyebrow="Admin console" title={title}>
      <CreateToolPanel onCreated={loadTools} />
      <ToolsPanel
        tools={tools}
        error={toolsError}
        employees={employees}
        version={version}
        onChanged={() => {
          loadTools();
          loadEmployees();
        }}
        onToolsStale={loadTools}
      />
      <AddEmployeePanel companies={companies} tools={tools} toolsError={toolsError} onAdded={loadEmployees} />
      <EmployeeTable
        key={version}
        employees={employees}
        tools={tools ?? []}
        note={note}
        message={listMessage}
        run={run}
      />
    </PortalShell>
  );
}
