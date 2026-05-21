import type { Metadata } from "next";
import FactorTreeClient from "./FactorTreeClient";

export const metadata: Metadata = {
  title: "Factor Tree & GCF/LCM — Homeschool Tools",
  description:
    "Visualize prime factorization with a factor tree and find the GCF and LCM of two numbers.",
};

export default function Page() {
  return <FactorTreeClient />;
}
