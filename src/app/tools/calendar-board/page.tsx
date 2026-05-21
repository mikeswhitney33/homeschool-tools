import type { Metadata } from "next";
import CalendarBoardClient from "./CalendarBoardClient";

export const metadata: Metadata = {
  title: "Calendar & Weather Board — Homeschool Tools",
  description:
    "Daily kindergarten morning meeting board. Today's date, day of week, month, and weather picker with a daily streak.",
};

export default function Page() {
  return <CalendarBoardClient />;
}
