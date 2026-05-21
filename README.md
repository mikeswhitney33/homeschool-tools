# Homeschool Tools

Static hub of free, no-signup, printer-friendly homeschool tools. Built with Next.js + Tailwind, deployed to GitHub Pages.

## Dev

```bash
npm install
npm run dev
```

## Build static site

```bash
npm run build
# Output: ./out
```

## Deploy

Pushes to `main` deploy via `.github/workflows/deploy.yml`. Enable Pages in repo settings → Pages → Source: **GitHub Actions**.

Site URL: `https://<user>.github.io/homeschool-tools/`

If you rename the repo, update `repo` in `next.config.ts`.

## Add a tool

1. Create `src/app/tools/<slug>/page.tsx`.
2. Add an entry to `TOOLS` in `src/app/page.tsx`.
