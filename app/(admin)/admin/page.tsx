import type { Metadata } from "next";
import { AdminConsole } from "@/components/portal/AdminConsole";
import { privateMetadata } from "@/lib/site";

export const metadata: Metadata = privateMetadata("Admin | XLNC Exotic Group");

export default function AdminPage() {
  return <AdminConsole />;
}
