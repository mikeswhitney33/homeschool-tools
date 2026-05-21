"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ROOTS, PREFIXES, SUFFIXES, type Root, type Prefix } from "./data";

type Deck = "roots" | "prefixes" | "suffixes" | "all";
type Mode = "flashcards" | "quiz";

const STORE_KEY = "roots-matcher.v1";

type Stored = {
  best: number;
  totalRuns: number;
};

type Card = { root: string; meaning: string; example: string; origin?: string };

function toCard(r: Root | Prefix): Card {
  return "origin" in r
    ? { root: r.root, meaning: r.meaning, example: r.example, origin: r.origin }
    : { root: r.root, meaning: r.meaning, example: r.example };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function RootsClient() {
  const [deck, setDeck] = useState<Deck>("roots");
  const [mode, setMode] = useState<Mode>("flashcards");

  const cards = useMemo<Card[]>(() => {
    if (deck === "roots") return ROOTS.map(toCard);
    if (deck === "prefixes") return PREFIXES.map(toCard);
    if (deck === "suffixes") return SUFFIXES.map(toCard);
    return [...ROOTS.map(toCard), ...PREFIXES.map(toCard), ...SUFFIXES.map(toCard)];
  }, [deck]);

  return (
    <div className="px-4 py-6">
      <header className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Roots & Affixes Matcher</h1>
          <p className="text-sm text-slate-500">
            {cards.length} cards · Greek & Latin roots, prefixes, suffixes
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={deck}
            onChange={(e) => setDeck(e.target.value as Deck)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Deck"
          >
            <option value="roots">Roots</option>
            <option value="prefixes">Prefixes</option>
            <option value="suffixes">Suffixes</option>
            <option value="all">All</option>
          </select>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Mode"
          >
            <option value="flashcards">Flashcards</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>
      </header>

      {mode === "flashcards" ? <Flashcards cards={cards} /> : <Quiz cards={cards} />}
    </div>
  );
}

function Flashcards({ cards }: { cards: Card[] }) {
  const [order, setOrder] = useState<Card[]>([]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setOrder(shuffle(cards));
    setI(0);
    setFlipped(false);
  }, [cards]);

  const card = order[i];
  if (!card) return null;

  const next = () => {
    setFlipped(false);
    setI((n) => (n + 1) % order.length);
  };
  const prev = () => {
    setFlipped(false);
    setI((n) => (n - 1 + order.length) % order.length);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onClick={() => setFlipped((v) => !v)}
        className="bg-white border border-slate-300 rounded-xl p-10 min-h-[260px] flex flex-col items-center justify-center cursor-pointer select-none hover:border-slate-500 transition"
      >
        {!flipped ? (
          <>
            <div className="text-xs uppercase tracking-wider text-slate-500">
              {card.origin ?? "Affix"}
            </div>
            <div className="text-5xl font-mono font-bold mt-3 text-slate-800">
              {card.root}
            </div>
            <div className="text-sm text-slate-400 mt-6">Tap to reveal</div>
          </>
        ) : (
          <>
            <div className="text-xs uppercase tracking-wider text-slate-500">
              meaning
            </div>
            <div className="text-3xl font-semibold mt-2 text-slate-800">
              {card.meaning}
            </div>
            <div className="text-slate-500 mt-4 text-sm">
              example: <span className="font-mono">{card.example}</span>
            </div>
          </>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={prev}
          className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
        >
          ← Prev
        </button>
        <div className="text-sm text-slate-500 font-mono">
          {i + 1} / {order.length}
        </div>
        <button
          onClick={next}
          className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function Quiz({ cards }: { cards: Card[] }) {
  const [queue, setQueue] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [stored, setStored] = useState<Stored>({ best: 0, totalRuns: 0 });
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
    const next = shuffle(cards);
    setQueue(next);
    setIdx(0);
    setScore(0);
    setStreak(0);
    setPicked(null);
    if (next.length) setChoices(makeChoices(next[0], cards));
  }, [cards]);

  useEffect(() => {
    reset();
  }, [reset]);

  const current = queue[idx];

  const pick = (c: string) => {
    if (!current || picked) return;
    setPicked(c);
    if (c === current.meaning) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        if (hydrated && next > stored.best) {
          const updated = { best: next, totalRuns: stored.totalRuns };
          setStored(updated);
          try {
            localStorage.setItem(STORE_KEY, JSON.stringify(updated));
          } catch {
            /* ignore */
          }
        }
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const advance = () => {
    setPicked(null);
    if (idx + 1 >= queue.length) {
      if (hydrated) {
        const updated = { best: stored.best, totalRuns: stored.totalRuns + 1 };
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
    setChoices(makeChoices(queue[idx + 1], cards));
  };

  if (!current) return <div className="text-center text-slate-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-3 text-sm text-slate-500 text-center">
        Score: {score} / {queue.length} · Streak: {streak} · Best: {stored.best}
      </div>
      <div className="bg-white border border-slate-300 rounded-xl p-6">
        <div className="text-sm uppercase tracking-wider text-slate-500 text-center mb-2">
          {current.origin ? `${current.origin} root` : "Affix"} · meaning?
        </div>
        <div className="text-5xl font-mono font-bold text-center mb-2 text-slate-800">
          {current.root}
        </div>
        <div className="text-center text-slate-500 text-sm mb-6">
          as in <span className="font-mono">{current.example}</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {choices.map((c) => {
            const isCorrect = c === current.meaning;
            const isPicked = c === picked;
            let cls =
              "px-4 py-3 rounded-lg border-2 text-left transition ";
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
                disabled={picked !== null}
                className={cls}
              >
                {c}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className="mt-5 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {picked === current.meaning ? "Correct!" : `Answer: ${current.meaning}`}
            </div>
            <button
              onClick={advance}
              className="text-sm px-4 py-2 rounded-md border border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function makeChoices(target: Card, pool: Card[]): string[] {
  const seen = new Set([target.meaning]);
  const distractors: string[] = [];
  const shuffled = shuffle(pool);
  for (const c of shuffled) {
    if (distractors.length >= 3) break;
    if (seen.has(c.meaning)) continue;
    seen.add(c.meaning);
    distractors.push(c.meaning);
  }
  return shuffle([target.meaning, ...distractors]);
}
