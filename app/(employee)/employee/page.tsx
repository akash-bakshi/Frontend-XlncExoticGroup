import type { Metadata } from "next";
import { EmployeeHome } from "@/components/portal/EmployeeHome";
import { privateMetadata } from "@/lib/site";

export const metadata: Metadata = privateMetadata("My Tools | XLNC Exotic Group");

export default function EmployeePage() {
  return <EmployeeHome />;
}
