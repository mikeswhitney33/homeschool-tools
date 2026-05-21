import type { Metadata } from "next";
import OrderOfOpsClient from "./OrderOfOpsClient";

export const metadata: Metadata = {
  title: "Order of Ops Generator — Homeschool Tools",
  description:
    "Printable PEMDAS / order of operations practice worksheets with three difficulty tiers.",
};

export default function Page() {
  return <OrderOfOpsClient />;
}
