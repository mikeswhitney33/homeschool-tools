"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Pair = [number, number];

function buildProblems(): Pair[] {
  const seen = new Set<string>();
  const out: Pair[] = [];
  for (let a = 1; a <= 12; a++) {
    for (let b = 1; b <= 12; b++) {
      const key = a <= b ? `${a},${b}` : `${b},${a}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push([a, b]);
    }
  }
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MultiplicationClient() {
  const base = useMemo(buildProblems, []);
  const [problems, setProblems] = useState<Pair[]>(base);
  const [showAnswers, setShowAnswers] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProblems(shuffle(base));
    setMounted(true);
  }, [base]);

  const reshuffle = useCallback(() => setProblems(shuffle(base)), [base]);

  return (
    <div className="px-4 py-6 print:p-0">
      <header className="no-print max-w-6xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Multiplication Practice (1–12)</h1>
          <p className="text-sm text-slate-500">{problems.length} problems</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={reshuffle}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
          >
            Shuffle
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
        className="max-w-6xl mx-auto grid gap-3.5 print:gap-1.5 grid-cols-[repeat(auto-fill,minmax(120px,1fr))] print:grid-cols-8"
      >
        {mounted &&
          problems.map(([a, b], i) => {
            const top = Math.max(a, b);
            const bot = Math.min(a, b);
            return (
              <div
                key={`${a}-${b}-${i}`}
                className="relative bg-white border border-slate-300 rounded-lg p-3 pt-4 print:rounded print:border-slate-500 print:p-1.5 print:pt-3 flex flex-col items-end font-mono text-[28px] print:text-[19px] leading-[1.15] print:leading-[1.05] break-inside-avoid"
              >
                <div className="absolute top-1 left-1.5 font-sans text-[11px] print:text-[9px] text-slate-500">
                  #{i + 1}
                </div>
                <div className="pr-1.5 min-w-[3ch] text-right">{top}</div>
                <div className="w-full flex justify-between border-b-2 print:border-b border-slate-900 pb-0.5 print:pb-px pr-1.5">
                  <span className="pl-1.5">×</span>
                  <span>{bot}</span>
                </div>
                <div
                  className={`mt-1 print:mt-px h-[1.2em] print:h-[1em] w-full text-right pr-1.5 text-red-700 print:text-[15px] ${
                    showAnswers ? "visible" : "invisible"
                  }`}
                >
                  {a * b}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
