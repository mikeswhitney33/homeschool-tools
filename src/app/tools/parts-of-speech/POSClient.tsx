"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SENTENCES, type POS, type Sentence } from "./sentences";

const STORE_KEY = "parts-of-speech.v1";
const POS_OPTIONS: POS[] = ["noun", "verb", "adjective"];
const POS_COLORS: Record<POS, string> = {
  noun: "border-sky-500 bg-sky-50 text-sky-700",
  verb: "border-emerald-500 bg-emerald-50 text-emerald-700",
  adjective: "border-amber-500 bg-amber-50 text-amber-700",
};

type Stored = { best: number; runs: number };

type WordToken = {
  display: string;
  key: string | null;
  isTagged: boolean;
};

function tokenize(s: Sentence): WordToken[] {
  return s.text
    .replace(/([.,!?])/g, " $1")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const stripped = w.replace(/[^a-zA-Z]/g, "");
      const key = stripped && s.tags[stripped] ? stripped : null;
      return { display: w, key, isTagged: !!key };
    });
}

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function POSClient() {
  const [queue, setQueue] = useState<Sentence[]>([]);
  const [idx, setIdx] = useState(0);
  const [assignments, setAssignments] = useState<Record<string, POS>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [stored, setStored] = useState<Stored>({ best: 0, runs: 0 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setStored(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const reset = useCallback(() => {
    setQueue(shuffle(SENTENCES));
    setIdx(0);
    setAssignments({});
    setChecked(false);
    setScore(0);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  const current = queue[idx];
  const tokens = useMemo(() => (current ? tokenize(current) : []), [current]);
  const taggedKeys = useMemo(
    () => tokens.filter((t) => t.isTagged).map((t) => t.key as string),
    [tokens],
  );
  const allAssigned = taggedKeys.every((k) => assignments[k]);

  const check = () => {
    if (!current) return;
    let correct = 0;
    for (const k of taggedKeys) {
      if (assignments[k] === current.tags[k]) correct++;
    }
    setChecked(true);
    setScore((s) => s + correct);
  };

  const next = () => {
    if (idx + 1 >= queue.length) {
      if (hydrated) {
        const finalScore = score;
        const updated: Stored = {
          best: Math.max(stored.best, finalScore),
          runs: stored.runs + 1,
        };
        setStored(updated);
        try {
          localStorage.setItem(STORE_KEY, JSON.stringify(updated));
        } catch {
          /* ignore */
        }
      }
      reset();
      return;
    }
    setIdx(idx + 1);
    setAssignments({});
    setChecked(false);
  };

  const assign = (key: string, pos: POS) => {
    if (checked) return;
    setAssignments((prev) => ({ ...prev, [key]: pos }));
  };

  const totalTagged = useMemo(
    () => queue.reduce((acc, s) => acc + Object.keys(s.tags).length, 0),
    [queue],
  );

  if (!current) return <div className="p-6 text-slate-500">Loading...</div>;

  return (
    <div className="px-4 py-6">
      <header className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Parts of Speech Sorter</h1>
          <p className="text-sm text-slate-500">
            Sentence {idx + 1} / {queue.length} · Score: {score} / {totalTagged} ·
            Best: {stored.best}
          </p>
        </div>
        <button
          onClick={reset}
          className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
        >
          Restart
        </button>
      </header>

      <div className="max-w-3xl mx-auto space-y-5">
        <div className="bg-white border border-slate-300 rounded-xl p-5 text-2xl leading-relaxed">
          {tokens.map((t, i) => {
            if (!t.isTagged) {
              return (
                <span key={i} className="text-slate-700">
                  {t.display}{" "}
                </span>
              );
            }
            const k = t.key as string;
            const pos = assignments[k];
            const correctPos = current.tags[k];
            let cls = "px-1.5 rounded border-2 mr-1 ";
            if (checked) {
              if (pos === correctPos) {
                cls += "border-emerald-500 bg-emerald-50 text-emerald-700";
              } else {
                cls += "border-rose-500 bg-rose-50 text-rose-700";
              }
            } else if (pos) {
              cls += POS_COLORS[pos];
            } else {
              cls += "border-slate-300 bg-slate-50 text-slate-700";
            }
            return (
              <span key={i} className={cls}>
                {t.display}
                {checked && pos !== correctPos && (
                  <span className="text-xs ml-1 text-slate-500">
                    ({correctPos})
                  </span>
                )}
              </span>
            );
          })}
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">
            Tap a tagged word, then choose a part of speech:
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {taggedKeys.map((k) => {
              const pos = assignments[k];
              const cls = pos
                ? POS_COLORS[pos]
                : "border-slate-300 bg-white text-slate-700";
              return (
                <span
                  key={k}
                  className={`px-3 py-1 rounded-full border-2 text-sm ${cls}`}
                >
                  {k}
                  {pos && <span className="ml-1 text-xs opacity-70">({pos})</span>}
                </span>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {POS_OPTIONS.map((p) => (
              <div key={p}>
                <div
                  className={`text-center text-xs uppercase tracking-wider mb-1 ${
                    p === "noun"
                      ? "text-sky-700"
                      : p === "verb"
                        ? "text-emerald-700"
                        : "text-amber-700"
                  }`}
                >
                  {p}
                </div>
                <div className="space-y-1">
                  {taggedKeys.map((k) => (
                    <button
                      key={k}
                      onClick={() => assign(k, p)}
                      disabled={checked}
                      className={`w-full text-sm px-2 py-1 rounded-md border ${
                        assignments[k] === p
                          ? POS_COLORS[p] + " border-2"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {!checked ? (
            <button
              onClick={check}
              disabled={!allAssigned}
              className="text-sm px-4 py-2 rounded-md border border-slate-900 bg-slate-900 text-white disabled:opacity-40"
            >
              Check
            </button>
          ) : (
            <button
              onClick={next}
              className="text-sm px-4 py-2 rounded-md border border-slate-900 bg-slate-900 text-white"
            >
              {idx + 1 >= queue.length ? "Finish round" : "Next sentence →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
