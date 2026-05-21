import type { Metadata } from "next";
import StatesCapitalsClient from "./StatesCapitalsClient";

export const metadata: Metadata = {
  title: "States & Capitals Drill — Homeschool Tools",
  description:
    "Multiple-choice drill for all 50 US states and capitals. Three modes, score and streak tracking.",
};

export default function Page() {
  return <StatesCapitalsClient />;
}
