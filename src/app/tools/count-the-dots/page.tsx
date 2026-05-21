import type { Metadata } from "next";
import CountDotsClient from "./CountDotsClient";

export const metadata: Metadata = {
  title: "Count the Dots — Homeschool Tools",
  description:
    "Printable counting worksheets with random dot arrays from 1-20 in ten-frame or scattered layouts.",
};

export default function Page() {
  return <CountDotsClient />;
}
