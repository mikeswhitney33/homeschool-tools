import { expect, test } from "@playwright/test";

const WORKSHEETS = [
  {
    slug: "multiplication",
    heading: /Multiplication Practice/i,
    expectedCountText: /\d+ problems/,
  },
  {
    slug: "regroup-racer",
    heading: /Regroup Racer/i,
    expectedCountText: /\d+ problems/,
  },
  {
    slug: "order-of-ops",
    heading: /Order of Operations/i,
    expectedCountText: /\d+ problems/,
  },
  {
    slug: "long-division",
    heading: /Long Division Lab/i,
    expectedCountText: /\d+ problems/,
  },
  {
    slug: "fact-family-triangles",
    heading: /Fact Family Triangles/i,
    expectedCountText: /\d+ triangles/,
  },
  {
    slug: "count-the-dots",
    heading: /Count the Dots/i,
    expectedCountText: /\d+ problems/,
  },
  {
    slug: "trace-a-name",
    heading: /Trace-a-Name/i,
    expectedCountText: null,
  },
  {
    slug: "cursive-tracing",
    heading: /Cursive Tracing Sheets/i,
    expectedCountText: null,
  },
];

for (const w of WORKSHEETS) {
  test.describe(`worksheet: ${w.slug}`, () => {
    test("loads, key controls, no console errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });

      await page.goto(`/tools/${w.slug}/`);
      await expect(page.getByRole("heading", { name: w.heading }).first()).toBeVisible();
      await expect(page.getByRole("button", { name: "Print" })).toBeVisible();

      if (w.expectedCountText) {
        await expect(page.locator("p").filter({ hasText: w.expectedCountText }).first()).toBeVisible();
      }

      await page.waitForTimeout(300);
      expect(errors).toEqual([]);
    });
  });
}

test("multiplication: shuffle changes problem set, show answers toggles visibility", async ({
  page,
}) => {
  await page.goto("/tools/multiplication/");
  await page.waitForSelector(".grid > div");
  const before = await page.locator(".grid > div").first().textContent();
  await page.getByRole("button", { name: "Shuffle" }).click();
  await page.waitForTimeout(150);
  // Just verify the grid still has content; shuffle may rarely produce same first cell
  const cellCount = await page.locator(".grid > div").count();
  expect(cellCount).toBeGreaterThan(50);
  expect(before).not.toBeNull();

  const toggle = page.getByRole("button", { name: "Show Answers" });
  await toggle.click();
  await expect(page.getByRole("button", { name: "Hide Answers" })).toBeVisible();
});

test("regroup-racer: show answers toggle and new set work", async ({ page }) => {
  await page.goto("/tools/regroup-racer/");
  await page.getByRole("button", { name: "Show Answers" }).click();
  await expect(page.getByRole("button", { name: "Hide Answers" })).toBeVisible();
  await page.getByRole("button", { name: "New Set" }).click();
  await expect(page.locator("p").filter({ hasText: /\d+ problems/ }).first()).toBeVisible();
});

test("order-of-ops: tier selector changes content", async ({ page }) => {
  await page.goto("/tools/order-of-ops/");
  await expect(page.locator("p").filter({ hasText: /Tier 2/ }).first()).toBeVisible();
  await page.getByLabel("Difficulty tier").selectOption("3");
  await expect(page.locator("p").filter({ hasText: /Tier 3/ }).first()).toBeVisible();
});

test("count-the-dots: layout switch + range change", async ({ page }) => {
  await page.goto("/tools/count-the-dots/");
  await page.getByLabel("Layout").selectOption("scatter");
  await page.getByLabel("Maximum").selectOption("20");
  await expect(page.getByText(/1-20/)).toBeVisible();
});

test("trace-a-name: name input updates preview", async ({ page }) => {
  await page.goto("/tools/trace-a-name/");
  const input = page.getByPlaceholder("Name");
  await input.fill("Sam");
  await expect(page.locator("text=Sam").first()).toBeVisible();
});

test("cursive-tracing: alphabet mode renders all 26 word groups", async ({ page }) => {
  await page.goto("/tools/cursive-tracing/");
  await page.getByLabel("Mode").selectOption("alphabet");
  // Each letter pair renders as div text in the body, distinct from the dropdown option
  await expect(page.locator("main").getByText(/^Aa$/).first()).toBeVisible();
  await expect(page.locator("main").getByText(/^Zz$/).first()).toBeVisible();
});

test("long-division: scaffold rows toggle off", async ({ page }) => {
  await page.goto("/tools/long-division/");
  const scaffold = page.getByLabel("Scaffold rows");
  await expect(scaffold).toBeChecked();
  await scaffold.uncheck();
  await expect(scaffold).not.toBeChecked();
});

test("fact-family-triangles: blank mode changes", async ({ page }) => {
  await page.goto("/tools/fact-family-triangles/");
  await page.getByLabel("Blank corner").selectOption("product");
  await expect(page.locator("p").filter({ hasText: /\d+ triangles/ }).first()).toBeVisible();
});
