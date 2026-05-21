import type { Metadata } from "next";
import POSClient from "./POSClient";

export const metadata: Metadata = {
  title: "Parts of Speech Sorter — Homeschool Tools",
  description:
    "Tap each tagged word in a sentence and assign it to noun, verb, or adjective. Live score and best round.",
};

export default function Page() {
  return <POSClient />;
}
