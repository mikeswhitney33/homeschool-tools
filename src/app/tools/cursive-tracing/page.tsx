import type { Metadata } from "next";
import CursiveClient from "./CursiveClient";

export const metadata: Metadata = {
  title: "Cursive Tracing Sheets — Homeschool Tools",
  description:
    "Custom cursive tracing worksheets with topline, midline, baseline, and descender rule lines.",
};

export default function Page() {
  return <CursiveClient />;
}
