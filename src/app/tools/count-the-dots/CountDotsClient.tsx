"use client";

import { useCallback, useEffect, useState } from "react";

type Layout = "ten-frame" | "scatter";
type Problem = { n: number };

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(count: number, max: number): Problem[] {
  return Array.from({ length: count }, () => ({ n: randInt(1, max) }));
}

export default function CountDotsClient() {
  const [count, setCount] = useState(12);
  const [maxN, setMaxN] = useState(10);
  const [layout, setLayout] = useState<Layout>("ten-frame");
  const [showAnswers, setShowAnswers] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [mounted, setMounted] = useState(false);

  const regenerate = useCallback(() => {
    setProblems(generate(count, maxN));
  }, [count, maxN]);

  useEffect(() => {
    regenerate();
    setMounted(true);
  }, [regenerate]);

  return (
    <div className="px-4 py-6 print:p-0">
      <header className="no-print max-w-6xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Count the Dots</h1>
          <p className="text-sm text-slate-500">{problems.length} problems · 1-{maxN}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value as Layout)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Layout"
          >
            <option value="ten-frame">Ten-frame</option>
            <option value="scatter">Scattered</option>
          </select>
          <select
            value={maxN}
            onChange={(e) => setMaxN(Number(e.target.value))}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Maximum"
          >
            <option value={5}>Up to 5</option>
            <option value={10}>Up to 10</option>
            <option value={20}>Up to 20</option>
          </select>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Count"
          >
            {[6, 9, 12, 15, 18].map((n) => (
              <option key={n} value={n}>
                {n} problems
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
        className="max-w-6xl mx-auto grid gap-4 print:gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 print:grid-cols-3"
      >
        {mounted &&
          problems.map((p, i) => (
            <DotCard
              key={i}
              index={i}
              n={p.n}
              layout={layout}
              showAnswer={showAnswers}
            />
          ))}
      </div>
    </div>
  );
}

function DotCard({
  index,
  n,
  layout,
  showAnswer,
}: {
  index: number;
  n: number;
  layout: Layout;
  showAnswer: boolean;
}) {
  return (
    <div className="relative bg-white border border-slate-300 rounded-lg p-3 pt-5 print:p-2 print:pt-4 break-inside-avoid">
      <div className="absolute top-1 left-1.5 font-sans text-[11px] print:text-[9px] text-slate-500">
        #{index + 1}
      </div>
      <div className="flex items-center justify-center h-32 print:h-24">
        {layout === "ten-frame" ? <TenFrame n={n} /> : <Scatter n={n} />}
      </div>
      <div className="mt-2 flex items-center justify-end gap-2">
        <span className="text-sm text-slate-500">Count:</span>
        <div className="w-12 h-8 print:h-6 border-b-2 border-slate-900 text-right font-mono text-lg pr-1">
          <span className={showAnswer ? "text-red-700" : "invisible"}>{n}</span>
        </div>
      </div>
    </div>
  );
}

function TenFrame({ n }: { n: number }) {
  const frames = n > 10 ? 2 : 1;
  return (
    <div className="flex flex-col gap-1.5 print:gap-1">
      {Array.from({ length: frames }).map((_, f) => {
        const start = f * 10;
        return (
          <div key={f} className="grid grid-cols-5 gap-px bg-slate-900 p-px">
            {Array.from({ length: 10 }).map((_, k) => {
              const filled = start + k < n;
              return (
                <div
                  key={k}
                  className="w-7 h-7 print:w-5 print:h-5 bg-white flex items-center justify-center"
                >
                  {filled && (
                    <div className="w-5 h-5 print:w-3.5 print:h-3.5 rounded-full bg-slate-900" />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function Scatter({ n }: { n: number }) {
  const positions = scatterPositions(n);
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full" role="img" aria-label={`${n} dots`}>
      {positions.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#0f172a" />
      ))}
    </svg>
  );
}

function scatterPositions(n: number): [number, number][] {
  const out: [number, number][] = [];
  const minDist = n > 12 ? 9 : 11;
  let seed = n * 9973 + 17;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  let guard = n * 200;
  while (out.length < n && guard-- > 0) {
    const x = 8 + rand() * 84;
    const y = 8 + rand() * 64;
    if (out.every(([px, py]) => Math.hypot(px - x, py - y) >= minDist)) {
      out.push([x, y]);
    }
  }
  return out;
}
