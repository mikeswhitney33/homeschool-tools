import type { Metadata } from "next";
import TraceNameClient from "./TraceNameClient";

export const metadata: Metadata = {
  title: "Trace-a-Name — Homeschool Tools",
  description:
    "Type any name or word and print a dotted-letter tracing worksheet with handwriting rule lines.",
};

export default function Page() {
  return <TraceNameClient />;
}
