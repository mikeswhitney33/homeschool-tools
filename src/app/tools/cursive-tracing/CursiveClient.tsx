"use client";

import { useState } from "react";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

type Mode = "alphabet" | "custom";

export default function CursiveClient() {
  const [mode, setMode] = useState<Mode>("custom");
  const [text, setText] = useState("homeschool");
  const [rowsPerWord, setRowsPerWord] = useState(3);

  const words =
    mode === "alphabet"
      ? ALPHABET.split("").map((c) => `${c.toUpperCase()}${c}`)
      : text
          .split(/\n|,/)
          .map((w) => w.trim())
          .filter(Boolean);

  return (
    <div className="px-4 py-6 print:p-0">
      <header className="no-print max-w-5xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Cursive Tracing Sheets</h1>
          <p className="text-sm text-slate-500">
            Custom or alphabet practice with 4-line rule
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Mode"
          >
            <option value="custom">Custom words</option>
            <option value="alphabet">Full alphabet (Aa-Zz)</option>
          </select>
          <select
            value={rowsPerWord}
            onChange={(e) => setRowsPerWord(Number(e.target.value))}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Rows per word"
          >
            {[2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} rows each
              </option>
            ))}
          </select>
          <button
            onClick={() => window.print()}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
          >
            Print
          </button>
        </div>
        {mode === "custom" && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="One word per line, or comma-separated"
            className="w-full text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white font-mono"
            rows={3}
          />
        )}
      </header>

      <div className="max-w-5xl mx-auto print:max-w-none space-y-5 print:space-y-2">
        {words.map((word, i) => (
          <div key={i} className="space-y-2 print:space-y-1 break-inside-avoid">
            {Array.from({ length: rowsPerWord }).map((_, r) => (
              <CursiveRow key={r} text={word} faded={r > 0} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CursiveRow({ text, faded }: { text: string; faded: boolean }) {
  return (
    <div className="relative h-[88px] print:h-[68px]">
      <div className="absolute inset-x-0 top-[14%] border-t border-slate-300 print:border-slate-400" />
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-red-400 print:border-red-500" />
      <div className="absolute inset-x-0 bottom-[14%] border-b-2 border-slate-900 print:border-slate-700" />
      <div className="absolute inset-x-0 bottom-0 border-b border-slate-300 print:border-slate-400" />
      <div
        className={`absolute inset-0 flex items-center pl-4 text-[64px] print:text-[52px] leading-none select-none ${
          faded ? "text-slate-300 print:text-slate-400" : "text-slate-800"
        }`}
        style={{
          fontFamily:
            '"Snell Roundhand", "Apple Chancery", "Lucida Handwriting", "Segoe Script", "Brush Script MT", cursive',
          fontStyle: "italic",
          letterSpacing: "0.04em",
        }}
      >
        {text}
      </div>
    </div>
  );
}
