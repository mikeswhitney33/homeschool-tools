"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { STATES, type State } from "./data";

type Mode = "capital-from-state" | "state-from-capital" | "abbr-from-state";
type Region = "all" | State["region"];

const STORE_KEY = "states-capitals.v1";

type Stored = {
  best: Record<Mode, number>;
};

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickChoices(answer: State, mode: Mode, pool: State[]): string[] {
  const correct = answerValue(answer, mode);
  const distractors = shuffle(pool.filter((s) => s.name !== answer.name))
    .slice(0, 3)
    .map((s) => answerValue(s, mode));
  return shuffle([correct, ...distractors]);
}

function answerValue(s: State, mode: Mode): string {
  if (mode === "capital-from-state") return s.capital;
  if (mode === "state-from-capital") return s.name;
  return s.abbr;
}

function promptValue(s: State, mode: Mode): string {
  if (mode === "capital-from-state") return s.name;
  if (mode === "state-from-capital") return s.capital;
  return s.name;
}

function promptLabel(mode: Mode): string {
  if (mode === "capital-from-state") return "Capital of...";
  if (mode === "state-from-capital") return "State for the capital...";
  return "Abbreviation of...";
}

export default function StatesCapitalsClient() {
  const [mode, setMode] = useState<Mode>("capital-from-state");
  const [region, setRegion] = useState<Region>("all");
  const [queue, setQueue] = useState<State[]>([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState<Record<Mode, number>>({
    "capital-from-state": 0,
    "state-from-capital": 0,
    "abbr-from-state": 0,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Stored;
        if (parsed.best) setBest(parsed.best);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ best }));
    } catch {
      /* ignore */
    }
  }, [best, hydrated]);

  const pool = useMemo(
    () => (region === "all" ? STATES : STATES.filter((s) => s.region === region)),
    [region],
  );

  const resetRound = useCallback(() => {
    const next = shuffle(pool);
    setQueue(next);
    setIdx(0);
    setScore(0);
    setStreak(0);
    setPicked(null);
    if (next.length > 0) {
      setChoices(pickChoices(next[0], mode, pool));
    }
  }, [pool, mode]);

  useEffect(() => {
    resetRound();
  }, [resetRound]);

  const current = queue[idx];

  const pick = (val: string) => {
    if (!current || picked) return;
    setPicked(val);
    const correct = val === answerValue(current, mode);
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBest((prev) =>
          next > (prev[mode] ?? 0) ? { ...prev, [mode]: next } : prev,
        );
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setPicked(null);
    const nextIdx = idx + 1;
    if (nextIdx >= queue.length) {
      resetRound();
      return;
    }
    setIdx(nextIdx);
    setChoices(pickChoices(queue[nextIdx], mode, pool));
  };

  return (
    <div className="px-4 py-6">
      <header className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">States & Capitals Drill</h1>
          <p className="text-sm text-slate-500">
            Score: {score} / {queue.length} · Streak: {streak} · Best:{" "}
            {best[mode]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Quiz mode"
          >
            <option value="capital-from-state">State → Capital</option>
            <option value="state-from-capital">Capital → State</option>
            <option value="abbr-from-state">State → Abbreviation</option>
          </select>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Region"
          >
            <option value="all">All 50 states</option>
            <option value="northeast">Northeast</option>
            <option value="midwest">Midwest</option>
            <option value="south">South</option>
            <option value="west">West</option>
          </select>
          <button
            onClick={resetRound}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
          >
            Restart
          </button>
        </div>
      </header>

      {current ? (
        <div className="max-w-3xl mx-auto bg-white border border-slate-300 rounded-xl p-6">
          <div className="text-sm uppercase tracking-wider text-slate-500 text-center mb-2">
            {promptLabel(mode)}
          </div>
          <div className="text-4xl font-bold text-center mb-6 text-slate-800">
            {promptValue(current, mode)}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {choices.map((c) => {
              const isCorrect = c === answerValue(current, mode);
              const isPicked = c === picked;
              let cls =
                "px-4 py-3 rounded-lg border-2 text-lg transition text-left ";
              if (picked === null) {
                cls += "border-slate-300 bg-white hover:border-slate-500";
              } else if (isCorrect) {
                cls += "border-emerald-500 bg-emerald-50 text-emerald-700";
              } else if (isPicked) {
                cls += "border-rose-500 bg-rose-50 text-rose-700";
              } else {
                cls += "border-slate-200 bg-slate-50 text-slate-500";
              }
              return (
                <button
                  key={c}
                  onClick={() => pick(c)}
                  className={cls}
                  disabled={picked !== null}
                >
                  {c}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {picked === answerValue(current, mode)
                  ? "Correct!"
                  : `Answer: ${answerValue(current, mode)}`}
              </div>
              <button
                onClick={next}
                className="text-sm px-4 py-2 rounded-md border border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-slate-500">Loading...</div>
      )}
    </div>
  );
}
