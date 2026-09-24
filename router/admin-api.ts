// Backend API layer: admin calls.
import { send } from "./api";

export interface Tool {
  slug: string;
  name: string;
  company_slug?: string | null;
}

export interface Employee {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  company_slug: string;
  tools: string[];
  status: string;
}

function employeePath(email: string, companySlug: string | null, suffix = ""): string {
  const path = `/api/employees/${encodeURIComponent(email)}${suffix}`;
  return companySlug ? `${path}?company=${encodeURIComponent(companySlug)}` : path;
}

export const tools = () => send<Tool[]>("/api/tools");

export const createTool = (slug: string, name: string, companySlug: string | null = null) =>
  send<Tool>("/api/tools", {
    method: "POST",
    body: { slug, name, company_slug: companySlug || null },
  });

export const deleteTool = (slug: string) =>
  send<null>(`/api/tools/${encodeURIComponent(slug)}`, { method: "DELETE" });

export const employees = () => send<Employee[]>("/api/employees");

export const createEmployee = (
  email: string,
  password: string,
  toolSlugs: string[],
  companySlug: string | null,
  firstName: string,
  lastName: string
) =>
  send<Employee>("/api/employees", {
    method: "POST",
    body: {
      email,
      password,
      first_name: firstName || "",
      last_name: lastName || "",
      tools: toolSlugs,
      company_slug: companySlug || null,
    },
  });

export const setTools = (email: string, companySlug: string | null, toolSlugs: string[]) =>
  send<Employee>(employeePath(email, companySlug, "/tools"), {
    method: "PUT",
    body: { tools: toolSlugs },
  });

export const setPassword = (email: string, companySlug: string | null, password: string) =>
  send<Employee>(employeePath(email, companySlug, "/password"), {
    method: "PUT",
    body: { password },
  });

export const suspend = (email: string, companySlug: string | null) =>
  send<Employee>(employeePath(email, companySlug, "/suspend"), { method: "POST" });

export const activate = (email: string, companySlug: string | null) =>
  send<Employee>(employeePath(email, companySlug, "/activate"), { method: "POST" });

export const remove = (email: string, companySlug: string | null) =>
  send<null>(employeePath(email, companySlug), { method: "DELETE" });
