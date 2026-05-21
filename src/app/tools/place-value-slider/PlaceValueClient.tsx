"use client";

import { useMemo, useState } from "react";

type Mode = "whole" | "decimal";

const WHOLE_COLS = [
  { label: "Thousands", value: 1000, name: "thousands" },
  { label: "Hundreds", value: 100, name: "hundreds" },
  { label: "Tens", value: 10, name: "tens" },
  { label: "Ones", value: 1, name: "ones" },
] as const;

const DECIMAL_COLS = [
  { label: "Tens", value: 10, name: "tens" },
  { label: "Ones", value: 1, name: "ones" },
  { label: "Tenths", value: 0.1, name: "tenths" },
  { label: "Hundredths", value: 0.01, name: "hundredths" },
  { label: "Thousandths", value: 0.001, name: "thousandths" },
] as const;

const ONES_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS_WORDS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function chunkUnder1000(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES_WORDS[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return TENS_WORDS[t] + (o ? `-${ONES_WORDS[o]}` : "");
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return `${ONES_WORDS[h]} hundred${rest ? ` ${chunkUnder1000(rest)}` : ""}`;
}

function wholeInWords(n: number): string {
  if (n === 0) return "zero";
  const th = Math.floor(n / 1000);
  const rest = n % 1000;
  const thPart = th ? `${chunkUnder1000(th)} thousand` : "";
  const restPart = rest ? chunkUnder1000(rest) : "";
  return [thPart, restPart].filter(Boolean).join(" ");
}

function decimalInWords(digits: number[]): string {
  const wholePart = digits[0] * 10 + digits[1];
  const fracDigits = [digits[2], digits[3], digits[4]];
  const fracNum = fracDigits[0] * 100 + fracDigits[1] * 10 + fracDigits[2];
  const placeNames = ["tenths", "hundredths", "thousandths"];
  let fracPlace = "thousandths";
  let trimmed = fracNum;
  if (fracNum === 0) {
    if (wholePart === 0) return "zero";
    return wholeInWords(wholePart);
  }
  if (trimmed % 100 === 0) {
    trimmed = trimmed / 100;
    fracPlace = placeNames[0];
  } else if (trimmed % 10 === 0) {
    trimmed = trimmed / 10;
    fracPlace = placeNames[1];
  }
  const wholeWord = wholePart === 0 ? "" : wholeInWords(wholePart);
  const fracWord = wholeInWords(trimmed);
  const connector = wholePart === 0 ? "" : " and ";
  return `${wholeWord}${connector}${fracWord} ${fracPlace}`.trim();
}

export default function PlaceValueClient() {
  const [mode, setMode] = useState<Mode>("whole");
  const [whole, setWhole] = useState<number[]>([3, 4, 5, 6]);
  const [decimal, setDecimal] = useState<number[]>([1, 2, 3, 4, 5]);

  const cols = mode === "whole" ? WHOLE_COLS : DECIMAL_COLS;
  const digits = mode === "whole" ? whole : decimal;
  const setDigits = mode === "whole" ? setWhole : setDecimal;

  const standard = useMemo(() => {
    if (mode === "whole") {
      return digits.reduce((s, d, i) => s + d * WHOLE_COLS[i].value, 0).toLocaleString();
    }
    const num = digits.reduce((s, d, i) => s + d * DECIMAL_COLS[i].value, 0);
    return num.toFixed(3).replace(/\.?0+$/, "") || "0";
  }, [mode, digits]);

  const expanded = useMemo(() => {
    const parts = digits
      .map((d, i) => ({ d, v: cols[i].value }))
      .filter(({ d }) => d !== 0)
      .map(({ d, v }) => (v >= 1 ? (d * v).toString() : `${d} × ${v}`));
    return parts.length === 0 ? "0" : parts.join(" + ");
  }, [digits, cols]);

  const words = useMemo(() => {
    if (mode === "whole") {
      const n = digits.reduce((s, d, i) => s + d * WHOLE_COLS[i].value, 0);
      return wholeInWords(n);
    }
    return decimalInWords(digits);
  }, [mode, digits]);

  const setDigit = (i: number, val: number) => {
    setDigits((prev) => {
      const copy = prev.slice();
      copy[i] = val;
      return copy;
    });
  };

  return (
    <div className="px-4 py-6">
      <header className="max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Place Value Slider</h1>
          <p className="text-sm text-slate-500">
            Use +/− to change each digit. Standard, expanded, and word forms update live.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Number mode"
          >
            <option value="whole">Whole numbers (to thousands)</option>
            <option value="decimal">Decimals (to thousandths)</option>
          </select>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center gap-2 sm:gap-3 mb-8 flex-wrap">
          {cols.map((c, i) => (
            <DigitColumn
              key={c.name}
              label={c.label}
              digit={digits[i]}
              setDigit={(v) => setDigit(i, v)}
              showDot={mode === "decimal" && i === 2}
            />
          ))}
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-5 space-y-3">
          <FormRow label="Standard form" value={standard} mono />
          <FormRow label="Expanded form" value={expanded} mono />
          <FormRow label="Word form" value={words} />
        </div>
      </div>
    </div>
  );
}

function DigitColumn({
  label,
  digit,
  setDigit,
  showDot,
}: {
  label: string;
  digit: number;
  setDigit: (v: number) => void;
  showDot?: boolean;
}) {
  return (
    <div className="flex items-end gap-1">
      {showDot && (
        <div className="text-5xl font-mono pb-1 text-slate-700">.</div>
      )}
      <div className="flex flex-col items-center">
        <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 mb-1">
          {label}
        </div>
        <button
          onClick={() => setDigit((digit + 1) % 10)}
          className="w-8 h-6 sm:w-10 sm:h-7 rounded-t-md border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm"
          aria-label={`Increase ${label}`}
        >
          ▲
        </button>
        <div className="w-12 h-16 sm:w-16 sm:h-20 border-2 border-slate-700 bg-white flex items-center justify-center font-mono text-4xl sm:text-5xl">
          {digit}
        </div>
        <button
          onClick={() => setDigit((digit + 9) % 10)}
          className="w-8 h-6 sm:w-10 sm:h-7 rounded-b-md border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm"
          aria-label={`Decrease ${label}`}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

function FormRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
      <div className="text-xs uppercase tracking-wider text-slate-500 sm:w-32 shrink-0">
        {label}
      </div>
      <div className={`text-xl ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
