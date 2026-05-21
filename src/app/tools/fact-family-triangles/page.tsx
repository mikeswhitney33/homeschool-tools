import type { Metadata } from "next";
import FactFamilyClient from "./FactFamilyClient";

export const metadata: Metadata = {
  title: "Fact Family Triangles — Homeschool Tools",
  description:
    "Printable multiplication and division fact family triangle worksheets with a configurable factor range.",
};

export default function Page() {
  return <FactFamilyClient />;
}
