"use client";

import { useEffect, useMemo, useState } from "react";

type Point = [number, number];
type Puzzle = { name: string; reveal: string; points: Point[] };

const PUZZLES: Puzzle[] = [
  {
    name: "House",
    reveal: "House",
    points: [
      [2, 2],
      [2, 8],
      [5, 11],
      [8, 8],
      [8, 2],
      [2, 2],
      [4, 2],
      [4, 5],
      [6, 5],
      [6, 2],
    ],
  },
  {
    name: "Sailboat",
    reveal: "Sailboat",
    points: [
      [1, 4],
      [13, 4],
      [10, 1],
      [4, 1],
      [1, 4],
      [7, 4],
      [7, 13],
      [2, 5],
      [7, 5],
      [7, 13],
      [12, 5],
      [7, 5],
    ],
  },
  {
    name: "Arrow",
    reveal: "Arrow",
    points: [
      [1, 6],
      [9, 6],
      [9, 9],
      [14, 5],
      [9, 1],
      [9, 4],
      [1, 4],
      [1, 6],
    ],
  },
  {
    name: "Star",
    reveal: "Five-point star",
    points: [
      [7, 13],
      [9, 8],
      [14, 8],
      [10, 5],
      [12, 1],
      [7, 4],
      [2, 1],
      [4, 5],
      [0, 8],
      [5, 8],
      [7, 13],
    ],
  },
];

const GRID_MAX = 14;

export default function CoordinateClient() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [step, setStep] = useState(2);
  const [revealName, setRevealName] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const puzzle = PUZZLES[puzzleIdx];

  const customPoints = useMemo<Point[]>(() => {
    if (!useCustom) return [];
    return customInput
      .split(/\n|;/)
      .map((line) => {
        const m = line.match(/(\d+)\s*[,\s]\s*(\d+)/);
        if (!m) return null;
        const x = Math.min(GRID_MAX, Math.max(0, Number(m[1])));
        const y = Math.min(GRID_MAX, Math.max(0, Number(m[2])));
        return [x, y] as Point;
      })
      .filter((p): p is Point => p !== null);
  }, [customInput, useCustom]);

  const points = useCustom ? customPoints : puzzle.points;
  const visible = points.slice(0, step);

  useEffect(() => {
    setStep(useCustom ? Math.max(2, customPoints.length) : 2);
    setRevealName(false);
  }, [puzzleIdx, useCustom, customPoints.length]);

  const next = () => setStep((s) => Math.min(s + 1, points.length));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="px-4 py-6 print:p-0">
      <header className="no-print max-w-6xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Coordinate Mystery Picture</h1>
          <p className="text-sm text-slate-500">
            Plot {points.length} points in order and reveal the picture
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={useCustom ? "custom" : puzzleIdx}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setUseCustom(true);
              } else {
                setUseCustom(false);
                setPuzzleIdx(Number(e.target.value));
              }
            }}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Puzzle"
          >
            {PUZZLES.map((p, i) => (
              <option key={p.name} value={i}>
                {p.name}
              </option>
            ))}
            <option value="custom">Custom points...</option>
          </select>
          <button
            onClick={prev}
            disabled={step <= 1}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            onClick={next}
            disabled={step >= points.length}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40"
          >
            Plot next →
          </button>
          <button
            onClick={() => setStep(points.length)}
            disabled={step >= points.length}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40"
          >
            Reveal all
          </button>
          {!useCustom && step >= points.length && (
            <button
              onClick={() => setRevealName((v) => !v)}
              className="text-sm px-3 py-1.5 rounded-md border border-slate-900 bg-slate-900 text-white"
            >
              {revealName ? `It is a ${puzzle.reveal}` : "What is it?"}
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
          >
            Print blank grid
          </button>
        </div>
      </header>

      {useCustom && (
        <div className="no-print max-w-6xl mx-auto mb-4">
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="One pair per line: 3,5"
            rows={4}
            className="w-full font-mono text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Grid points={visible} />
        </div>
        <div className="no-print">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-2">
            Points
          </h2>
          <ol className="font-mono text-sm space-y-1 list-decimal list-inside">
            {points.map(([x, y], i) => (
              <li
                key={i}
                className={i < step ? "text-slate-900" : "text-slate-300"}
              >
                ({x}, {y})
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Grid({ points }: { points: Point[] }) {
  const size = 360;
  const pad = 24;
  const inner = size - pad * 2;
  const cell = inner / GRID_MAX;
  const toX = (x: number) => pad + x * cell;
  const toY = (y: number) => size - pad - y * cell;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full bg-white border border-slate-300 rounded-lg"
      role="img"
      aria-label="Coordinate grid"
    >
      {Array.from({ length: GRID_MAX + 1 }).map((_, i) => (
        <g key={`g${i}`}>
          <line
            x1={toX(i)}
            y1={pad}
            x2={toX(i)}
            y2={size - pad}
            stroke={i % 5 === 0 ? "#94a3b8" : "#e2e8f0"}
            strokeWidth={i % 5 === 0 ? 1 : 0.5}
          />
          <line
            x1={pad}
            y1={toY(i)}
            x2={size - pad}
            y2={toY(i)}
            stroke={i % 5 === 0 ? "#94a3b8" : "#e2e8f0"}
            strokeWidth={i % 5 === 0 ? 1 : 0.5}
          />
        </g>
      ))}
      <line
        x1={pad}
        y1={size - pad}
        x2={size - pad}
        y2={size - pad}
        stroke="#0f172a"
        strokeWidth="2"
      />
      <line
        x1={pad}
        y1={pad}
        x2={pad}
        y2={size - pad}
        stroke="#0f172a"
        strokeWidth="2"
      />
      {Array.from({ length: GRID_MAX + 1 }).map((_, i) =>
        i % 2 === 0 ? (
          <g key={`lbl${i}`}>
            <text
              x={toX(i)}
              y={size - pad + 14}
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
              fontFamily="monospace"
            >
              {i}
            </text>
            {i > 0 && (
              <text
                x={pad - 6}
                y={toY(i) + 3}
                textAnchor="end"
                fontSize="10"
                fill="#64748b"
                fontFamily="monospace"
              >
                {i}
              </text>
            )}
          </g>
        ) : null,
      )}
      {points.length > 1 && (
        <polyline
          points={points.map(([x, y]) => `${toX(x)},${toY(y)}`).join(" ")}
          fill="none"
          stroke="#0369a1"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}
      {points.map(([x, y], i) => (
        <g key={`p${i}`}>
          <circle cx={toX(x)} cy={toY(y)} r="4" fill="#0369a1" />
          <text
            x={toX(x) + 6}
            y={toY(y) - 6}
            fontSize="9"
            fill="#0369a1"
            fontFamily="monospace"
          >
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
