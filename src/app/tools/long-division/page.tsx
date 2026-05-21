import type { Metadata } from "next";
import LongDivisionClient from "./LongDivisionClient";

export const metadata: Metadata = {
  title: "Long Division Lab — Homeschool Tools",
  description:
    "Printable long division worksheets with optional step-by-step scaffold rows.",
};

export default function Page() {
  return <LongDivisionClient />;
}
