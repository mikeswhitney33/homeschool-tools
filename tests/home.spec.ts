import { expect, test } from "@playwright/test";

test("landing page lists all tools", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Simple tools for homeschool/i })).toBeVisible();

  const toolTitles = [
    "Multiplication Practice (1–12)",
    "Regroup Racer",
    "Order of Operations",
    "Trace-a-Name",
    "Cursive Tracing Sheets",
    "Long Division Lab",
    "Fact Family Triangles",
    "Count the Dots",
    "Ten-Frame Builder",
    "Fraction Pizza Builder",
    "Place Value Slider",
    "Coordinate Mystery Picture",
    "Factor Tree & GCF / LCM",
    "Calendar & Weather Board",
    "States & Capitals Drill",
    "Typing Sprint",
    "Roots & Affixes Matcher",
    "Parts of Speech Sorter",
  ];

  for (const title of toolTitles) {
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  }
});

test("no console errors on home", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});
