import type { Metadata } from "next";
import MultiplicationClient from "./MultiplicationClient";

export const metadata: Metadata = {
  title: "Multiplication Practice (1–12) — Homeschool Tools",
  description: "Printable multiplication worksheet covering every unique product from 1×1 to 12×12.",
};

export default function Page() {
  return <MultiplicationClient />;
}
