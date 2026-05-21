"use client";

import { useEffect, useState } from "react";

const DENOMINATORS = [2, 3, 4, 5, 6, 8, 10, 12] as const;
type Denominator = (typeof DENOMINATORS)[number];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function simplify(n: number, d: number): [number, number] {
  if (n === 0) return [0, 1];
  const g = gcd(Math.abs(n), Math.abs(d));
  return [n / g, d / g];
}

export default function FractionPizzaClient() {
  const [denom, setDenom] = useState<Denominator>(8);
  const [eaten, setEaten] = useState<Set<number>>(new Set());

  useEffect(() => {
    setEaten(new Set());
  }, [denom]);

  const remaining = denom - eaten.size;
  const [sn, sd] = simplify(remaining, denom);

  const toggleSlice = (i: number) => {
    setEaten((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="px-4 py-6">
      <header className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Fraction Pizza Builder</h1>
          <p className="text-sm text-slate-500">
            Click a slice to eat it. The fraction shows what is left.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-sm flex items-center gap-2 text-slate-700">
            Slices:
            <select
              value={denom}
              onChange={(e) => setDenom(Number(e.target.value) as Denominator)}
              className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            >
              {DENOMINATORS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => setEaten(new Set())}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8 items-center">
        <PizzaSVG denom={denom} eaten={eaten} onToggle={toggleSlice} />

        <div className="text-center space-y-4">
          <div>
            <div className="text-sm text-slate-500 mb-1">Pizza left</div>
            <Fraction n={remaining} d={denom} />
            {(sn !== remaining || sd !== denom) && (
              <div className="mt-2 text-slate-500 text-sm">
                = <Fraction n={sn} d={sd} small /> simplified
              </div>
            )}
          </div>
          <div>
            <div className="text-sm text-slate-500 mb-1">Pizza eaten</div>
            <Fraction n={eaten.size} d={denom} color="text-red-700" />
          </div>
          <div className="text-slate-500 text-sm pt-2 border-t border-slate-200">
            <Fraction n={eaten.size} d={denom} small /> +{" "}
            <Fraction n={remaining} d={denom} small /> ={" "}
            <Fraction n={denom} d={denom} small /> = 1 whole
          </div>
        </div>
      </div>
    </div>
  );
}

function PizzaSVG({
  denom,
  eaten,
  onToggle,
}: {
  denom: number;
  eaten: Set<number>;
  onToggle: (i: number) => void;
}) {
  const cx = 100;
  const cy = 100;
  const r = 90;
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full max-w-[360px] mx-auto"
      role="img"
      aria-label="Pizza divided into slices"
    >
      <circle cx={cx} cy={cy} r={r + 4} fill="#d97706" />
      {Array.from({ length: denom }).map((_, i) => {
        const a0 = (i / denom) * 2 * Math.PI - Math.PI / 2;
        const a1 = ((i + 1) / denom) * 2 * Math.PI - Math.PI / 2;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const x0 = cx + r * Math.cos(a0);
        const y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        const d = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
        const isEaten = eaten.has(i);
        return (
          <path
            key={i}
            d={d}
            fill={isEaten ? "#f8fafc" : "#fbbf24"}
            stroke="#92400e"
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80"
            onClick={() => onToggle(i)}
            aria-label={`Slice ${i + 1}, ${isEaten ? "eaten" : "remaining"}`}
          />
        );
      })}
    </svg>
  );
}

function Fraction({
  n,
  d,
  small,
  color,
}: {
  n: number;
  d: number;
  small?: boolean;
  color?: string;
}) {
  const size = small ? "text-2xl" : "text-5xl";
  return (
    <span className={`inline-flex flex-col items-center font-mono ${color ?? ""}`}>
      <span className={`${size} leading-none`}>{n}</span>
      <span className="border-t-2 border-current w-8 my-0.5" />
      <span className={`${size} leading-none`}>{d}</span>
    </span>
  );
}
