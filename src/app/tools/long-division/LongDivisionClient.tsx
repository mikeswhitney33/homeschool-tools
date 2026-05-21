"use client";

import { useCallback, useEffect, useState } from "react";

type DividendDigits = 2 | 3 | 4;
type DivisorDigits = 1 | 2;
type Problem = { dividend: number; divisor: number; remainder: boolean };

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(
  count: number,
  dvd: DividendDigits,
  dvs: DivisorDigits,
  allowRemainder: boolean,
): Problem[] {
  const dvdLo = Math.pow(10, dvd - 1);
  const dvdHi = Math.pow(10, dvd) - 1;
  const dvsLo = Math.pow(10, dvs - 1);
  const dvsHi = Math.pow(10, dvs) - 1;
  const out: Problem[] = [];
  let guard = count * 50;
  while (out.length < count && guard-- > 0) {
    const divisor = randInt(dvsLo, dvsHi);
    let dividend = randInt(dvdLo, dvdHi);
    if (dividend < divisor) continue;
    if (!allowRemainder) {
      dividend = dividend - (dividend % divisor);
      if (dividend < divisor || dividend > dvdHi) continue;
    }
    out.push({ dividend, divisor, remainder: allowRemainder });
  }
  return out;
}

function answer(p: Problem) {
  return { q: Math.floor(p.dividend / p.divisor), r: p.dividend % p.divisor };
}

export default function LongDivisionClient() {
  const [dvd, setDvd] = useState<DividendDigits>(3);
  const [dvs, setDvs] = useState<DivisorDigits>(1);
  const [count, setCount] = useState(8);
  const [allowRemainder, setAllowRemainder] = useState(true);
  const [showScaffold, setShowScaffold] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [mounted, setMounted] = useState(false);

  const regenerate = useCallback(() => {
    setProblems(generate(count, dvd, dvs, allowRemainder));
  }, [count, dvd, dvs, allowRemainder]);

  useEffect(() => {
    regenerate();
    setMounted(true);
  }, [regenerate]);

  return (
    <div className="px-4 py-6 print:p-0">
      <header className="no-print max-w-6xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Long Division Lab</h1>
          <p className="text-sm text-slate-500">{problems.length} problems</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={dvd}
            onChange={(e) => setDvd(Number(e.target.value) as DividendDigits)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Dividend digits"
          >
            <option value={2}>2-digit dividend</option>
            <option value={3}>3-digit dividend</option>
            <option value={4}>4-digit dividend</option>
          </select>
          <select
            value={dvs}
            onChange={(e) => setDvs(Number(e.target.value) as DivisorDigits)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Divisor digits"
          >
            <option value={1}>1-digit divisor</option>
            <option value={2}>2-digit divisor</option>
          </select>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Count"
          >
            {[4, 6, 8, 10, 12].map((n) => (
              <option key={n} value={n}>
                {n} problems
              </option>
            ))}
          </select>
          <label className="text-sm flex items-center gap-1.5 text-slate-700">
            <input
              type="checkbox"
              checked={allowRemainder}
              onChange={(e) => setAllowRemainder(e.target.checked)}
            />
            Allow remainders
          </label>
          <label className="text-sm flex items-center gap-1.5 text-slate-700">
            <input
              type="checkbox"
              checked={showScaffold}
              onChange={(e) => setShowScaffold(e.target.checked)}
            />
            Scaffold rows
          </label>
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
        className="max-w-6xl mx-auto grid gap-4 print:gap-2 grid-cols-1 sm:grid-cols-2 print:grid-cols-2"
      >
        {mounted &&
          problems.map((p, i) => (
            <DivisionProblem
              key={i}
              index={i}
              p={p}
              scaffold={showScaffold}
              showAnswer={showAnswers}
            />
          ))}
      </div>
    </div>
  );
}

function DivisionProblem({
  index,
  p,
  scaffold,
  showAnswer,
}: {
  index: number;
  p: Problem;
  scaffold: boolean;
  showAnswer: boolean;
}) {
  const dvdStr = String(p.dividend);
  const cols = dvdStr.length;
  const { q, r } = answer(p);
  const qStr = String(q).padStart(cols, " ");

  return (
    <div className="relative bg-white border border-slate-300 rounded-lg p-4 pt-6 print:p-3 print:pt-5 break-inside-avoid">
      <div className="absolute top-1 left-2 font-sans text-[11px] print:text-[9px] text-slate-500">
        #{index + 1}
      </div>
      <div className="font-mono text-[24px] print:text-[18px]">
        <div className="flex justify-end">
          <div className={`text-right ${showAnswer ? "text-red-700" : "invisible"}`}>
            {qStr}
            {p.remainder && r > 0 && <span className="ml-2">r {r}</span>}
          </div>
        </div>
        <div className="flex items-start">
          <span className="pr-2">{p.divisor}</span>
          <div className="border-l-2 border-t-2 border-slate-900 pl-2 pt-0.5 flex-1">
            <span>{p.dividend}</span>
          </div>
        </div>
        {scaffold && (
          <div className="mt-2 ml-[3ch] print:ml-[2.5ch]">
            {Array.from({ length: cols }).map((_, k) => (
              <ScaffoldRow key={k} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScaffoldRow() {
  return (
    <div className="flex items-center gap-1 h-9 print:h-7 border-b border-dashed border-slate-300">
      <span className="text-slate-300 text-sm">−</span>
      <div className="flex-1 border-b border-slate-200" />
    </div>
  );
}
