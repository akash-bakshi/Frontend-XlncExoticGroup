import type { ReactNode } from "react";
import { RootDocument } from "@/app/_components/RootDocument";
import "@/styles/portal.css";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return <RootDocument>{children}</RootDocument>;
}
