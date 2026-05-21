"use client";

import { useCallback, useState } from "react";

type Mode = "free" | "show" | "challenge";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function TenFrameClient() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [mode, setMode] = useState<Mode>("free");
  const [target, setTarget] = useState({ a: 4, b: 3 });

  const total = a + b;

  const newChallenge = useCallback(() => {
    setTarget({ a: randInt(1, 9), b: randInt(1, 9) });
    setA(0);
    setB(0);
  }, []);

  const showTarget = mode === "show" ? target : null;
  const challengeOK =
    mode === "challenge" && a === target.a && b === target.b;

  return (
    <div className="px-4 py-6">
      <header className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Ten-Frame Builder</h1>
          <p className="text-sm text-slate-500">
            Click a square to add or remove a counter
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={mode}
            onChange={(e) => {
              const m = e.target.value as Mode;
              setMode(m);
              if (m === "challenge") {
                newChallenge();
              }
            }}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Mode"
          >
            <option value="free">Free play</option>
            <option value="show">Show me 4 + 3</option>
            <option value="challenge">Challenge mode</option>
          </select>
          {mode === "show" && (
            <button
              onClick={() => setTarget({ a: randInt(1, 9), b: randInt(1, 9) })}
              className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
            >
              New problem
            </button>
          )}
          {mode === "challenge" && (
            <button
              onClick={newChallenge}
              className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
            >
              New challenge
            </button>
          )}
          <button
            onClick={() => {
              setA(0);
              setB(0);
            }}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {showTarget && (
          <div className="mb-4 text-center text-2xl font-mono">
            Build: <span className="text-blue-700">{showTarget.a}</span>
            {" + "}
            <span className="text-orange-600">{showTarget.b}</span>
          </div>
        )}
        {mode === "challenge" && (
          <div className="mb-4 text-center">
            <div className="text-2xl font-mono">
              <span className="text-blue-700">{target.a}</span>
              {" + "}
              <span className="text-orange-600">{target.b}</span>
              {" = "}
              <span className={challengeOK ? "text-green-600" : "text-slate-400"}>
                {challengeOK ? total : "?"}
              </span>
            </div>
            {challengeOK && (
              <div className="text-green-600 text-lg mt-1">Nice work!</div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center">
          <Frame
            count={a}
            setCount={setA}
            color="blue"
            label={`First number: ${a}`}
          />
          <div className="text-5xl text-slate-500 font-mono">+</div>
          <Frame
            count={b}
            setCount={setB}
            color="orange"
            label={`Second number: ${b}`}
          />
          <div className="text-5xl text-slate-500 font-mono">=</div>
          <div className="text-6xl font-mono w-20 text-center">{total}</div>
        </div>

        <div className="mt-8 max-w-md mx-auto text-center text-slate-600">
          <div className="text-lg font-mono">
            <span className="text-blue-700">{a}</span> +{" "}
            <span className="text-orange-600">{b}</span> = {total}
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame({
  count,
  setCount,
  color,
  label,
}: {
  count: number;
  setCount: (n: number) => void;
  color: "blue" | "orange";
  label: string;
}) {
  const dotClass =
    color === "blue" ? "bg-blue-600" : "bg-orange-500";

  const handleClick = (idx: number) => {
    if (idx < count) {
      setCount(idx);
    } else {
      setCount(idx + 1);
    }
  };

  return (
    <div role="group" aria-label={label}>
      <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded">
        {Array.from({ length: 10 }).map((_, k) => {
          const filled = k < count;
          return (
            <button
              key={k}
              onClick={() => handleClick(k)}
              className="w-14 h-14 bg-white hover:bg-slate-50 flex items-center justify-center"
              aria-label={`Slot ${k + 1}, ${filled ? "filled" : "empty"}`}
            >
              {filled && <div className={`w-10 h-10 rounded-full ${dotClass}`} />}
            </button>
          );
        })}
      </div>
      <div className="text-center text-sm text-slate-500 mt-1">{count} / 10</div>
    </div>
  );
}
