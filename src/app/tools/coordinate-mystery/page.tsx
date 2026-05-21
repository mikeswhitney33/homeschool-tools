import type { Metadata } from "next";
import CoordinateClient from "./CoordinateClient";

export const metadata: Metadata = {
  title: "Coordinate Mystery Picture — Homeschool Tools",
  description:
    "Plot ordered pairs in Quadrant 1, connect them in order, and reveal a hidden picture.",
};

export default function Page() {
  return <CoordinateClient />;
}
