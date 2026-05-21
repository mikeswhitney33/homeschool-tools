"use client";

import { useState } from "react";

type Case = "title" | "upper" | "lower";

function applyCase(s: string, c: Case): string {
  if (c === "upper") return s.toUpperCase();
  if (c === "lower") return s.toLowerCase();
  return s
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

export default function TraceNameClient() {
  const [name, setName] = useState("Hello");
  const [rows, setRows] = useState(6);
  const [letterCase, setLetterCase] = useState<Case>("title");
  const [showArrows, setShowArrows] = useState(false);

  const display = applyCase(name || " ", letterCase);

  return (
    <div className="px-4 py-6 print:p-0">
      <header className="no-print max-w-5xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Trace-a-Name</h1>
          <p className="text-sm text-slate-500">
            Type a name or short word, then print
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 16))}
            placeholder="Name"
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white w-40"
          />
          <select
            value={letterCase}
            onChange={(e) => setLetterCase(e.target.value as Case)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Letter case"
          >
            <option value="title">Title Case</option>
            <option value="upper">UPPERCASE</option>
            <option value="lower">lowercase</option>
          </select>
          <select
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Rows"
          >
            {[3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} rows
              </option>
            ))}
          </select>
          <label className="text-sm flex items-center gap-1.5 text-slate-700">
            <input
              type="checkbox"
              checked={showArrows}
              onChange={(e) => setShowArrows(e.target.checked)}
            />
            Show start dots
          </label>
          <button
            onClick={() => window.print()}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
          >
            Print
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto print:max-w-none space-y-4 print:space-y-2">
        <h2 className="no-print text-sm text-slate-500">Preview</h2>
        {Array.from({ length: rows }).map((_, i) => (
          <TraceRow key={i} text={display} faded={i > 0} showStart={showArrows} />
        ))}
      </div>
    </div>
  );
}

function TraceRow({
  text,
  faded,
  showStart,
}: {
  text: string;
  faded: boolean;
  showStart: boolean;
}) {
  return (
    <div className="relative border-b-2 border-slate-900 print:border-slate-700">
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-red-400 print:border-red-500" />
      <div
        className={`relative font-trace text-[88px] print:text-[68px] leading-[1.05] pl-4 pr-2 select-none ${
          faded ? "text-slate-300 print:text-slate-400" : "text-slate-800"
        }`}
        style={{
          fontFamily:
            '"Comic Sans MS", "Chalkboard SE", "Marker Felt", "Trebuchet MS", system-ui, sans-serif',
          letterSpacing: "0.05em",
        }}
      >
        {showStart && (
          <span className="absolute left-1 top-1 w-2 h-2 rounded-full bg-blue-500 print:bg-black" />
        )}
        {text}
      </div>
    </div>
  );
}
