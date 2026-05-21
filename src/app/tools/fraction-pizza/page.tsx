import type { Metadata } from "next";
import FractionPizzaClient from "./FractionPizzaClient";

export const metadata: Metadata = {
  title: "Fraction Pizza Builder — Homeschool Tools",
  description:
    "Interactive fraction manipulative. Slice a pizza and click slices to see the fraction update live.",
};

export default function Page() {
  return <FractionPizzaClient />;
}
