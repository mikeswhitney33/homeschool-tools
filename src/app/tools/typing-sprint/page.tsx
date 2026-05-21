import type { Metadata } from "next";
import TypingSprintClient from "./TypingSprintClient";

export const metadata: Metadata = {
  title: "Typing Sprint — Homeschool Tools",
  description:
    "Timed typing drill with kid-friendly passages. Shows live WPM, accuracy, and a personal-best streak.",
};

export default function Page() {
  return <TypingSprintClient />;
}
