"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Op = "+" | "-";
type Mode = "add" | "sub" | "mixed";
type Digits = 2 | 3 | 4;

type Problem = { a: number; b: number; op: Op };

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function digitRange(d: Digits): [number, number] {
  const min = Math.pow(10, d - 1);
  const max = Math.pow(10, d) - 1;
  return [min, max];
}

function needsRegroup(a: number, b: number, op: Op): boolean {
  const sa = String(a);
  const sb = String(b).padStart(sa.length, "0");
  if (op === "+") {
    let carry = 0;
    for (let i = sa.length - 1; i >= 0; i--) {
      const sum = Number(sa[i]) + Number(sb[i]) + carry;
      if (sum >= 10) return true;
      carry = 0;
    }
    return false;
  }
  let borrow = 0;
  for (let i = sa.length - 1; i >= 0; i--) {
    const top = Number(sa[i]) - borrow;
    const bot = Number(sb[i]);
    if (top < bot) return true;
    borrow = 0;
  }
  return false;
}

function generate(
  count: number,
  mode: Mode,
  digits: Digits,
  forceRegroup: boolean,
): Problem[] {
  const [lo, hi] = digitRange(digits);
  const out: Problem[] = [];
  let guard = count * 50;
  while (out.length < count && guard-- > 0) {
    const op: Op =
      mode === "add" ? "+" : mode === "sub" ? "-" : Math.random() < 0.5 ? "+" : "-";
    let a = randInt(lo, hi);
    let b = randInt(lo, hi);
    if (op === "-" && b > a) [a, b] = [b, a];
    if (forceRegroup && !needsRegroup(a, b, op)) continue;
    out.push({ a, b, op });
  }
  return out;
}

function answer(p: Problem) {
  return p.op === "+" ? p.a + p.b : p.a - p.b;
}

export default function RegroupRacerClient() {
  const [mode, setMode] = useState<Mode>("mixed");
  const [digits, setDigits] = useState<Digits>(3);
  const [count, setCount] = useState<number>(24);
  const [forceRegroup, setForceRegroup] = useState<boolean>(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [mounted, setMounted] = useState(false);

  const regenerate = useCallback(() => {
    setProblems(generate(count, mode, digits, forceRegroup));
  }, [count, mode, digits, forceRegroup]);

  useEffect(() => {
    regenerate();
    setMounted(true);
  }, [regenerate]);

  const cols = useMemo(() => (digits === 4 ? 5 : 6), [digits]);

  return (
    <div className="px-4 py-6 print:p-0">
      <header className="no-print max-w-6xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Regroup Racer</h1>
          <p className="text-sm text-slate-500">{problems.length} problems</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Operation"
          >
            <option value="add">Addition</option>
            <option value="sub">Subtraction</option>
            <option value="mixed">Mixed</option>
          </select>
          <select
            value={digits}
            onChange={(e) => setDigits(Number(e.target.value) as Digits)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Digits"
          >
            <option value={2}>2-digit</option>
            <option value={3}>3-digit</option>
            <option value={4}>4-digit</option>
          </select>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Count"
          >
            {[12, 18, 24, 30, 36].map((n) => (
              <option key={n} value={n}>
                {n} problems
              </option>
            ))}
          </select>
          <label className="text-sm flex items-center gap-1.5 text-slate-700">
            <input
              type="checkbox"
              checked={forceRegroup}
              onChange={(e) => setForceRegroup(e.target.checked)}
            />
            Regrouping required
          </label>
          <label className="text-sm flex items-center gap-1.5 text-slate-700">
            <input
              type="checkbox"
              checked={showHelp}
              onChange={(e) => setShowHelp(e.target.checked)}
            />
            Regroup boxes
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
        className="max-w-6xl mx-auto grid gap-4 print:gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {mounted &&
          problems.map((p, i) => {
            const sa = String(p.a);
            const sb = String(p.b).padStart(sa.length, " ");
            const ans = answer(p);
            return (
              <div
                key={i}
                className="relative bg-white border border-slate-300 rounded-lg p-3 pt-5 print:p-2 print:pt-4 print:rounded font-mono text-[26px] print:text-[18px] leading-tight break-inside-avoid"
              >
                <div className="absolute top-1 left-1.5 font-sans text-[11px] print:text-[9px] text-slate-500">
                  #{i + 1}
                </div>
                {showHelp && (
                  <div className="flex justify-end mb-0.5 text-[14px] print:text-[10px] text-slate-400">
                    {sa.split("").map((_, k) => (
                      <span
                        key={k}
                        className="w-[1.1ch] mx-px border border-dashed border-slate-300 text-center"
                      >
                        &nbsp;
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-right pr-1.5">{p.a}</div>
                <div className="flex justify-between border-b-2 print:border-b border-slate-900 pb-0.5 pr-1.5">
                  <span className="pl-1.5">{p.op}</span>
                  <span>{p.b}</span>
                </div>
                <div
                  className={`mt-1 text-right pr-1.5 text-red-700 ${
                    showAnswers ? "visible" : "invisible"
                  }`}
                >
                  {ans}
                </div>
                <span className="sr-only">{sb}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
