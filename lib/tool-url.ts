// "Google Tool" -> "/tools/google-tool": the address an employee sees for a tool, built from its name.
export function toolPath(name: string, slug: string): string {
  const part = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `/tools/${part || slug}`;
}
