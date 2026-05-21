import type { Metadata } from "next";
import TenFrameClient from "./TenFrameClient";

export const metadata: Metadata = {
  title: "Ten-Frame Builder — Homeschool Tools",
  description:
    "Interactive ten-frame manipulative for modeling early addition. Click to add or remove counters.",
};

export default function Page() {
  return <TenFrameClient />;
}
