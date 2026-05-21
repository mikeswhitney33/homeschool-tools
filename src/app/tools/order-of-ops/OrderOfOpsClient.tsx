"use client";

import { useCallback, useEffect, useState } from "react";

type Tier = 1 | 2 | 3;
type Item = { expr: string; answer: number };

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const BASIC_OPS = ["+", "-", "*"] as const;

function safeEval(expr: string): number {
  const cleaned = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/\^/g, "**");
  if (!/^[\d+\-*/().\s*]+$/.test(cleaned)) {
    throw new Error("bad expr");
  }
  return Function(`"use strict"; return (${cleaned});`)();
}

function genTier1(): Item {
  const ops = [pick(BASIC_OPS), pick(BASIC_OPS)];
  const nums = [randInt(2, 12), randInt(2, 12), randInt(2, 12)];
  if (ops[1] === "-" && nums[1] < nums[2]) [nums[1], nums[2]] = [nums[2], nums[1]];
  const expr = `${nums[0]} ${ops[0]} ${nums[1]} ${ops[1]} ${nums[2]}`;
  return { expr: expr.replace(/\*/g, "×"), answer: safeEval(expr) };
}

function genTier2(): Item {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = randInt(2, 9);
  const d = randInt(2, 12);
  const shapes = [
    () => ({ expr: `(${a} + ${b}) × ${c}`, raw: `(${a}+${b})*${c}` }),
    () => ({ expr: `${d} - (${a} + ${b})`, raw: `${d}-(${a}+${b})` }),
    () => ({ expr: `${a} × (${b} + ${c})`, raw: `${a}*(${b}+${c})` }),
    () => ({ expr: `(${a + b} - ${b}) × ${c}`, raw: `(${a + b}-${b})*${c}` }),
    () => ({ expr: `${a} + ${b} × ${c} - ${d}`, raw: `${a}+${b}*${c}-${d}` }),
  ];
  const s = pick(shapes)();
  return { expr: s.expr, answer: safeEval(s.raw) };
}

function genTier3(): Item {
  const a = randInt(2, 6);
  const b = randInt(2, 6);
  const c = randInt(2, 9);
  const d = randInt(2, 9);
  const e = randInt(2, 5);
  const shapes = [
    () => ({ expr: `${a}² + ${c} × ${d}`, raw: `${a}**2+${c}*${d}` }),
    () => ({ expr: `(${a} + ${b})² - ${c}`, raw: `(${a}+${b})**2-${c}` }),
    () => ({ expr: `${c} × ${d} - ${a}²`, raw: `${c}*${d}-${a}**2` }),
    () => ({ expr: `${a}³ - ${b} × ${c}`, raw: `${a}**3-${b}*${c}` }),
    () => ({ expr: `(${c} - ${b}) × ${e}² + ${d}`, raw: `(${c}-${b})*${e}**2+${d}` }),
  ];
  const s = pick(shapes)();
  return { expr: s.expr, answer: safeEval(s.raw) };
}

function generate(count: number, tier: Tier): Item[] {
  const gen = tier === 1 ? genTier1 : tier === 2 ? genTier2 : genTier3;
  const out: Item[] = [];
  let guard = count * 50;
  while (out.length < count && guard-- > 0) {
    try {
      const item = gen();
      if (Number.isInteger(item.answer) && item.answer >= 0 && item.answer < 1000) {
        out.push(item);
      }
    } catch {
      /* skip */
    }
  }
  return out;
}

export default function OrderOfOpsClient() {
  const [tier, setTier] = useState<Tier>(2);
  const [count, setCount] = useState(16);
  const [problems, setProblems] = useState<Item[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [mounted, setMounted] = useState(false);

  const regenerate = useCallback(() => {
    setProblems(generate(count, tier));
  }, [count, tier]);

  useEffect(() => {
    regenerate();
    setMounted(true);
  }, [regenerate]);

  return (
    <div className="px-4 py-6 print:p-0">
      <header className="no-print max-w-6xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Order of Operations</h1>
          <p className="text-sm text-slate-500">
            Tier {tier} · {problems.length} problems
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={tier}
            onChange={(e) => setTier(Number(e.target.value) as Tier)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Difficulty tier"
          >
            <option value={1}>Tier 1 · no parens</option>
            <option value={2}>Tier 2 · with parens</option>
            <option value={3}>Tier 3 · exponents</option>
          </select>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Count"
          >
            {[10, 16, 20, 24, 30].map((n) => (
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
        className="max-w-6xl mx-auto grid gap-3 print:gap-1.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4"
      >
        {mounted &&
          problems.map((p, i) => (
            <div
              key={i}
              className="relative bg-white border border-slate-300 rounded-lg p-3 pt-5 print:p-2 print:pt-4 print:rounded font-mono text-[20px] print:text-[15px] break-inside-avoid"
            >
              <div className="absolute top-1 left-1.5 font-sans text-[11px] print:text-[9px] text-slate-500">
                #{i + 1}
              </div>
              <div className="text-center mb-2">{p.expr} =</div>
              <div className="h-8 print:h-6 border-b border-slate-400" />
              <div
                className={`mt-1 text-right text-red-700 text-[16px] print:text-[12px] ${
                  showAnswers ? "visible" : "invisible"
                }`}
              >
                {p.answer}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
