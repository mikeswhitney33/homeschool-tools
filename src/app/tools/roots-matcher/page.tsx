import type { Metadata } from "next";
import RootsClient from "./RootsClient";

export const metadata: Metadata = {
  title: "Roots & Affixes Matcher — Homeschool Tools",
  description:
    "Greek and Latin roots, prefixes, and suffixes — flashcards and multiple-choice practice with progress tracking.",
};

export default function Page() {
  return <RootsClient />;
}
