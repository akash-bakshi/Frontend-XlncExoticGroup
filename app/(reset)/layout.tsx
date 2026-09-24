import type { ReactNode } from "react";
import { RootDocument } from "@/app/_components/RootDocument";
import "@/styles/admin_change_password.css";

export default function ResetLayout({ children }: { children: ReactNode }) {
  return <RootDocument bodyClassName="reset">{children}</RootDocument>;
}
