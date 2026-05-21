import type { Metadata } from "next";
import RegroupRacerClient from "./RegroupRacerClient";

export const metadata: Metadata = {
  title: "Regroup Racer — Homeschool Tools",
  description:
    "Printable multi-digit addition and subtraction worksheets with optional regrouping helper boxes.",
};

export default function Page() {
  return <RegroupRacerClient />;
}
