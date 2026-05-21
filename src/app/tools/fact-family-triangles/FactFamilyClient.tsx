"use client";

import { useCallback, useEffect, useState } from "react";

type BlankCorner = "product" | "factor" | "mixed";

type Triangle = { a: number; b: number; product: number; blank: "top" | "left" | "right" };

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(
  count: number,
  minFactor: number,
  maxFactor: number,
  blank: BlankCorner,
): Triangle[] {
  const out: Triangle[] = [];
  let guard = count * 50;
  while (out.length < count && guard-- > 0) {
    const a = randInt(minFactor, maxFactor);
    const b = randInt(minFactor, maxFactor);
    const product = a * b;
    let blankSlot: Triangle["blank"];
    if (blank === "product") blankSlot = "top";
    else if (blank === "factor") blankSlot = Math.random() < 0.5 ? "left" : "right";
    else blankSlot = (["top", "left", "right"] as const)[randInt(0, 2)];
    out.push({ a, b, product, blank: blankSlot });
  }
  return out;
}

export default function FactFamilyClient() {
  const [count, setCount] = useState(12);
  const [maxFactor, setMaxFactor] = useState(10);
  const [blank, setBlank] = useState<BlankCorner>("mixed");
  const [showAnswers, setShowAnswers] = useState(false);
  const [problems, setProblems] = useState<Triangle[]>([]);
  const [mounted, setMounted] = useState(false);

  const regenerate = useCallback(() => {
    setProblems(generate(count, 2, maxFactor, blank));
  }, [count, maxFactor, blank]);

  useEffect(() => {
    regenerate();
    setMounted(true);
  }, [regenerate]);

  return (
    <div className="px-4 py-6 print:p-0">
      <header className="no-print max-w-6xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Fact Family Triangles</h1>
          <p className="text-sm text-slate-500">{problems.length} triangles</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={maxFactor}
            onChange={(e) => setMaxFactor(Number(e.target.value))}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Factor range"
          >
            {[5, 6, 7, 8, 9, 10, 12].map((n) => (
              <option key={n} value={n}>
                Factors 2-{n}
              </option>
            ))}
          </select>
          <select
            value={blank}
            onChange={(e) => setBlank(e.target.value as BlankCorner)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Blank corner"
          >
            <option value="product">Blank product (×)</option>
            <option value="factor">Blank factor (÷)</option>
            <option value="mixed">Mixed</option>
          </select>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Count"
          >
            {[6, 9, 12, 15, 18].map((n) => (
              <option key={n} value={n}>
                {n} triangles
              </option>
            ))}
          </select>
          <button
            onClick={regenerate}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
          >
            New Set
          </button>
          <button
            onClick={() => setShowAnswers((v) => !v)}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
          >
            {showAnswers ? "Hide Answers" : "Show Answers"}
          </button>
          <button
            onClick={() => window.print()}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
          >
            Print
          </button>
        </div>
      </header>

      <div
        suppressHydrationWarning
        className="max-w-6xl mx-auto grid gap-5 print:gap-3 grid-cols-2 sm:grid-cols-3 print:grid-cols-3"
      >
        {mounted &&
          problems.map((t, i) => (
            <TriangleCard key={i} index={i} t={t} showAnswer={showAnswers} />
          ))}
      </div>
    </div>
  );
}

function TriangleCard({
  index,
  t,
  showAnswer,
}: {
  index: number;
  t: Triangle;
  showAnswer: boolean;
}) {
  const cell = (slot: Triangle["blank"], value: number) => {
    const isBlank = t.blank === slot;
    if (!isBlank) return <span>{value}</span>;
    if (showAnswer) return <span className="text-red-700">{value}</span>;
    return <span className="text-slate-400">__</span>;
  };

  return (
    <div className="relative bg-white border border-slate-300 rounded-lg p-3 pt-5 print:p-2 print:pt-4 break-inside-avoid">
      <div className="absolute top-1 left-1.5 font-sans text-[11px] print:text-[9px] text-slate-500">
        #{index + 1}
      </div>
      <svg
        viewBox="0 0 120 110"
        className="w-full h-auto"
        role="img"
        aria-label={`Fact family triangle ${index + 1}`}
      >
        <polygon
          points="60,8 110,100 10,100"
          fill="none"
          stroke="#0f172a"
          strokeWidth="2"
        />
        <foreignObject x="40" y="0" width="40" height="28">
          <div className="w-full h-full flex items-center justify-center font-mono text-[22px]">
            {cell("top", t.product)}
          </div>
        </foreignObject>
        <foreignObject x="0" y="70" width="44" height="32">
          <div className="w-full h-full flex items-center justify-center font-mono text-[22px]">
            {cell("left", t.a)}
          </div>
        </foreignObject>
        <foreignObject x="76" y="70" width="44" height="32">
          <div className="w-full h-full flex items-center justify-center font-mono text-[22px]">
            {cell("right", t.b)}
          </div>
        </foreignObject>
        <text
          x="60"
          y="58"
          textAnchor="middle"
          className="fill-slate-400"
          fontSize="14"
          fontFamily="monospace"
        >
          × ÷
        </text>
      </svg>
    </div>
  );
}
