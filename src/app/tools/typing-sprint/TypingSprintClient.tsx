"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PASSAGES, TOPICS } from "./passages";

type Duration = 60 | 180 | 300;
const STORE_KEY = "typing-sprint.v1";

type Stored = {
  bestWpm: number;
  bestAccuracy: number;
  totalRuns: number;
};

function pickPassage(topic: string): string {
  const list = PASSAGES[topic] ?? PASSAGES[TOPICS[0]];
  return list[Math.floor(Math.random() * list.length)];
}

export default function TypingSprintClient() {
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [duration, setDuration] = useState<Duration>(60);
  const [passage, setPassage] = useState<string>("");
  const [typed, setTyped] = useState<string>("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [finished, setFinished] = useState(false);
  const [stored, setStored] = useState<Stored>({
    bestWpm: 0,
    bestAccuracy: 0,
    totalRuns: 0,
  });
  const [hydrated, setHydrated] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setPassage(pickPassage(topic));
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setStored(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [topic]);

  useEffect(() => {
    if (!startedAt || finished) return;
    const id = setInterval(() => {
      const e = (Date.now() - startedAt) / 1000;
      setElapsed(e);
      if (e >= duration) {
        setFinished(true);
      }
    }, 200);
    return () => clearInterval(id);
  }, [startedAt, finished, duration]);

  const stats = useMemo(() => {
    const correctChars = Array.from(typed).filter(
      (ch, i) => passage[i] === ch,
    ).length;
    const totalTyped = typed.length;
    const minutes = Math.max(elapsed / 60, 1 / 60);
    const wpm = totalTyped > 0 ? Math.round(correctChars / 5 / minutes) : 0;
    const accuracy =
      totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
    return { wpm, accuracy, correctChars, totalTyped };
  }, [typed, passage, elapsed]);

  const persistBest = useCallback(
    (wpm: number, accuracy: number) => {
      if (!hydrated) return;
      const next: Stored = {
        bestWpm: Math.max(stored.bestWpm, wpm),
        bestAccuracy: Math.max(stored.bestAccuracy, accuracy),
        totalRuns: stored.totalRuns + 1,
      };
      setStored(next);
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [hydrated, stored],
  );

  useEffect(() => {
    if (finished && startedAt) {
      persistBest(stats.wpm, stats.accuracy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const reset = useCallback(() => {
    setPassage(pickPassage(topic));
    setTyped("");
    setStartedAt(null);
    setElapsed(0);
    setFinished(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [topic]);

  const onChange = (val: string) => {
    if (finished) return;
    if (!startedAt && val.length > 0) {
      setStartedAt(Date.now());
    }
    const next = val.slice(0, passage.length);
    setTyped(next);
    if (next.length >= passage.length) {
      setFinished(true);
    }
  };

  const remaining = Math.max(0, duration - elapsed);

  return (
    <div className="px-4 py-6">
      <header className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Typing Sprint</h1>
          <p className="text-sm text-slate-500">
            Best WPM: {stored.bestWpm} · Best accuracy: {stored.bestAccuracy}% ·{" "}
            {stored.totalRuns} runs
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Topic"
            disabled={startedAt !== null && !finished}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t[0].toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value) as Duration)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Duration"
            disabled={startedAt !== null && !finished}
          >
            <option value={60}>1 minute</option>
            <option value={180}>3 minutes</option>
            <option value={300}>5 minutes</option>
          </select>
          <button
            onClick={reset}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
          >
            {finished ? "New run" : "Reset"}
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Time left" value={`${Math.ceil(remaining)}s`} />
          <Stat label="WPM" value={`${stats.wpm}`} highlight />
          <Stat label="Accuracy" value={`${stats.accuracy}%`} />
        </div>

        <div
          className="bg-white border border-slate-300 rounded-xl p-5 font-mono text-lg leading-relaxed select-none"
          onClick={() => inputRef.current?.focus()}
        >
          {Array.from(passage).map((ch, i) => {
            let cls = "text-slate-400";
            if (i < typed.length) {
              cls = typed[i] === ch ? "text-emerald-700" : "text-rose-700 bg-rose-100";
            } else if (i === typed.length) {
              cls = "text-slate-900 bg-amber-200";
            }
            return (
              <span key={i} className={cls}>
                {ch}
              </span>
            );
          })}
        </div>

        <textarea
          ref={inputRef}
          value={typed}
          onChange={(e) => onChange(e.target.value)}
          disabled={finished}
          placeholder={finished ? "Done! Hit New run to try again." : "Start typing..."}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-base bg-white disabled:bg-slate-100"
        />

        {finished && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
            <div className="text-sm uppercase tracking-wider text-emerald-700">
              Run complete
            </div>
            <div className="text-3xl font-bold text-emerald-700 mt-1">
              {stats.wpm} WPM · {stats.accuracy}%
            </div>
            {stats.wpm >= stored.bestWpm && stored.totalRuns > 0 && (
              <div className="text-sm text-emerald-700 mt-1">New best WPM!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 text-center ${
        highlight
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-800"
      }`}
    >
      <div className="text-xs uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-2xl font-mono font-bold">{value}</div>
    </div>
  );
}
