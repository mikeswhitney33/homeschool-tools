import Link from "next/link";

type Tool = {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  status: "ready" | "soon";
};

const TOOLS: Tool[] = [
  {
    slug: "multiplication",
    title: "Multiplication Practice (1–12)",
    blurb: "Printable worksheet of every unique 1–12 product. Shuffle, reveal answers, send to printer.",
    tags: ["math", "printable", "K–6"],
    status: "ready",
  },
  {
    slug: "regroup-racer",
    title: "Regroup Racer",
    blurb: "Multi-digit addition & subtraction with optional regrouping helper boxes. Pick digits, mode, and count.",
    tags: ["math", "printable", "3rd"],
    status: "ready",
  },
  {
    slug: "order-of-ops",
    title: "Order of Operations",
    blurb: "PEMDAS worksheet generator. Three tiers: no parens, with parens, or with exponents.",
    tags: ["math", "printable", "5th"],
    status: "ready",
  },
  {
    slug: "trace-a-name",
    title: "Trace-a-Name",
    blurb: "Type any name or short word, get a printable tracing worksheet with handwriting rule lines.",
    tags: ["writing", "printable", "K"],
    status: "ready",
  },
  {
    slug: "cursive-tracing",
    title: "Cursive Tracing Sheets",
    blurb: "Cursive practice for the full alphabet or any custom word list. Four-line rule, faded tracing rows.",
    tags: ["writing", "printable", "3rd"],
    status: "ready",
  },
  {
    slug: "long-division",
    title: "Long Division Lab",
    blurb: "Long division worksheets with optional scaffold rows under the bracket. Configurable digits and remainders.",
    tags: ["math", "printable", "5th"],
    status: "ready",
  },
  {
    slug: "fact-family-triangles",
    title: "Fact Family Triangles",
    blurb: "Multiplication & division fact family triangles. Blank the product, the factor, or both.",
    tags: ["math", "printable", "3rd"],
    status: "ready",
  },
  {
    slug: "count-the-dots",
    title: "Count the Dots",
    blurb: "Counting worksheet with random dot arrays from 1-20 in ten-frame or scattered layouts.",
    tags: ["math", "printable", "K"],
    status: "ready",
  },
  {
    slug: "ten-frame-builder",
    title: "Ten-Frame Builder",
    blurb: "Interactive two-frame manipulative for modeling early addition. Click to fill counters.",
    tags: ["math", "interactive", "K"],
    status: "ready",
  },
  {
    slug: "fraction-pizza",
    title: "Fraction Pizza Builder",
    blurb: "Slice a pizza into halves, thirds, fourths, and more. Click slices to see the fraction update.",
    tags: ["math", "interactive", "3rd"],
    status: "ready",
  },
  {
    slug: "place-value-slider",
    title: "Place Value Slider",
    blurb: "Set each digit and watch standard, expanded, and word forms update live. Whole numbers or decimals.",
    tags: ["math", "interactive", "3rd", "5th"],
    status: "ready",
  },
  {
    slug: "coordinate-mystery",
    title: "Coordinate Mystery Picture",
    blurb: "Plot ordered pairs in Quadrant 1, connect them step by step, and reveal a hidden picture.",
    tags: ["math", "interactive", "5th"],
    status: "ready",
  },
  {
    slug: "factor-tree",
    title: "Factor Tree & GCF / LCM",
    blurb: "Build a prime factor tree for any number. Compare two numbers to find their GCF and LCM.",
    tags: ["math", "interactive", "5th"],
    status: "ready",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <section className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Simple tools for homeschool.
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          A growing collection of free, no-signup, printer-friendly tools built for
          real homeschool days. No ads. No accounts. Open it, use it, print it.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Tools
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <li key={tool.slug}>
              {tool.status === "ready" ? (
                <Link
                  href={`/tools/${tool.slug}`}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-400 hover:shadow-sm transition"
                >
                  <CardBody tool={tool} />
                </Link>
              ) : (
                <div className="block h-full rounded-xl border border-dashed border-slate-300 bg-white/50 p-5 opacity-70">
                  <CardBody tool={tool} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CardBody({ tool }: { tool: Tool }) {
  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="font-semibold text-lg">{tool.title}</h3>
        {tool.status === "soon" && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            soon
          </span>
        )}
      </div>
      <p className="text-slate-600 text-sm mb-3">{tool.blurb}</p>
      <div className="flex flex-wrap gap-1.5">
        {tool.tags.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
          >
            {t}
          </span>
        ))}
      </div>
    </>
  );
}
