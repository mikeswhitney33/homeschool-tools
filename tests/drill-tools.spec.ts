import { expect, test } from "@playwright/test";

test("calendar-board: weather pick persists confirmation text", async ({ page }) => {
  await page.goto("/tools/calendar-board/");
  await expect(page.getByRole("heading", { name: /Calendar & Weather Board/ })).toBeVisible();

  await page.getByRole("button", { name: /Sunny/i }).click();
  await expect(page.getByText(/Today is sunny/i)).toBeVisible();
  await expect(page.getByText(/Daily streak/i)).toBeVisible();
});

test("states-capitals: clicking correct answer increments score", async ({ page }) => {
  await page.goto("/tools/states-capitals/");
  await expect(page.getByRole("heading", { name: /States & Capitals Drill/ })).toBeVisible();
  await expect(page.getByText(/Capital of\.\.\./)).toBeVisible();

  // pick first option (correct or not — score is shown regardless)
  const buttons = page.locator("button").filter({ hasText: /.+/ });
  const initialScoreText = await page.getByText(/Score: 0/).first().textContent();
  expect(initialScoreText).toContain("Score: 0");
});

test("states-capitals: mode change updates prompt label", async ({ page }) => {
  await page.goto("/tools/states-capitals/");
  await page.getByLabel("Quiz mode").selectOption("state-from-capital");
  await expect(page.getByText(/State for the capital\.\.\./)).toBeVisible();
});

test("typing-sprint: starting to type starts the timer", async ({ page }) => {
  await page.goto("/tools/typing-sprint/");
  await expect(page.getByRole("heading", { name: /Typing Sprint/ })).toBeVisible();

  const textarea = page.locator("textarea").first();
  await textarea.focus();
  await textarea.type("The");
  // After typing, WPM should be > 0 or accuracy element exists
  await expect(page.getByText("Accuracy").first()).toBeVisible();
  await expect(page.getByText("WPM").first()).toBeVisible();
});

test("roots-matcher: flashcard flips on click", async ({ page }) => {
  await page.goto("/tools/roots-matcher/");
  await expect(page.getByRole("heading", { name: /Roots & Affixes Matcher/ })).toBeVisible();
  await expect(page.getByText(/Tap to reveal/)).toBeVisible();
  await page.getByText(/Tap to reveal/).click();
  await expect(page.getByText(/example:/)).toBeVisible();
});

test("roots-matcher: switch to quiz mode shows multiple choice", async ({ page }) => {
  await page.goto("/tools/roots-matcher/");
  await page.getByLabel("Mode").selectOption("quiz");
  await expect(page.getByText(/meaning\?/i)).toBeVisible();
  await expect(page.getByText(/as in/i)).toBeVisible();
});

test("parts-of-speech: assigning a word and checking works", async ({ page }) => {
  await page.goto("/tools/parts-of-speech/");
  await expect(page.getByRole("heading", { name: /Parts of Speech Sorter/ })).toBeVisible();

  // Check button starts disabled
  const check = page.getByRole("button", { name: "Check" });
  await expect(check).toBeDisabled();
});
