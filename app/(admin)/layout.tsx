import type { ReactNode } from "react";
import { RootDocument } from "@/app/_components/RootDocument";
import "@/styles/portal.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RootDocument bodyClassName="admin">{children}</RootDocument>;
}
