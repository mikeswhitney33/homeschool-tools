import type { Metadata } from "next";
import PlaceValueClient from "./PlaceValueClient";

export const metadata: Metadata = {
  title: "Place Value Slider — Homeschool Tools",
  description:
    "Interactive place value tool covering whole numbers and decimals. See standard, expanded, and word form update live.",
};

export default function Page() {
  return <PlaceValueClient />;
}
