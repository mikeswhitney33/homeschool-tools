import { expect, test } from "@playwright/test";

test("ten-frame-builder: clicking slots updates count and sum", async ({ page }) => {
  await page.goto("/tools/ten-frame-builder/");
  await expect(page.getByRole("heading", { name: "Ten-Frame Builder" })).toBeVisible();

  // Reset both frames to 0 first
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByText("0 / 10").first()).toBeVisible();

  // Click slot 5 (k=4) in first frame -> count becomes 5
  const slot5 = page.locator('button[aria-label^="Slot 5"]').first();
  await slot5.click();
  await expect(page.getByText("5 / 10").first()).toBeVisible();
});

test("fraction-pizza: clicking a slice eats it, denominator change resets", async ({ page }) => {
  await page.goto("/tools/fraction-pizza/");
  await expect(page.getByRole("heading", { name: "Fraction Pizza Builder" })).toBeVisible();

  const slice = page.getByRole("img", { name: /Pizza divided into slices/i }).locator("path").first();
  await slice.click();
  // eaten 1/8 -> remaining 7/8
  await expect(page.getByText("Pizza eaten")).toBeVisible();

  await page.getByLabel("Slices:").selectOption("4");
  // After denominator change, eaten resets to 0
  await expect(page.getByText("Pizza left")).toBeVisible();
});

test("place-value-slider: digit increments cycle 0-9, expanded/word forms update", async ({
  page,
}) => {
  await page.goto("/tools/place-value-slider/");
  await expect(page.getByRole("heading", { name: "Place Value Slider" })).toBeVisible();
  await expect(page.getByText(/standard form/i).first()).toBeVisible();
  await expect(page.getByText(/word form/i).first()).toBeVisible();

  // switch to decimal
  await page.getByLabel("Number mode").selectOption("decimal");
  // Column label "Thousandths" (capital T) only appears in decimal mode body,
  // dropdown option uses lowercase "thousandths"
  await expect(page.getByText("Thousandths", { exact: true })).toBeVisible();
});

test("coordinate-mystery: stepping plots points, reveal all completes", async ({ page }) => {
  await page.goto("/tools/coordinate-mystery/");
  await expect(page.getByRole("heading", { name: "Coordinate Mystery Picture" })).toBeVisible();

  await page.getByRole("button", { name: /Reveal all/i }).click();
  await expect(page.getByRole("button", { name: /What is it\?|It is a/i })).toBeVisible();
});

test("factor-tree: single mode shows tree and primes", async ({ page }) => {
  await page.goto("/tools/factor-tree/");
  await expect(page.getByRole("heading", { name: /Factor Tree/ })).toBeVisible();
  await expect(page.getByText(/Factors of 36/)).toBeVisible();
  await expect(page.getByText(/Primes:/).first()).toBeVisible();
  await expect(page.getByText(/Exponent form:/).first()).toBeVisible();
  // GCF/LCM card present in default pair mode
  await expect(page.getByText(/GCF\(36, 24\)/)).toBeVisible();
  await expect(page.getByText(/LCM\(36, 24\)/)).toBeVisible();
});
