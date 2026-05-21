"use client";

import { useEffect, useState } from "react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Weather = "sun" | "cloud" | "rain" | "snow" | "wind" | "storm";
const WEATHER_OPTS: { key: Weather; label: string; emoji: string }[] = [
  { key: "sun", label: "Sunny", emoji: "☀️" },
  { key: "cloud", label: "Cloudy", emoji: "☁️" },
  { key: "rain", label: "Rainy", emoji: "🌧️" },
  { key: "snow", label: "Snowy", emoji: "❄️" },
  { key: "wind", label: "Windy", emoji: "💨" },
  { key: "storm", label: "Stormy", emoji: "⛈️" },
];

const STORE_KEY = "calendar-board.v1";

type Stored = {
  history: Record<string, Weather>;
  lastVisit: string;
};

function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function calcStreak(history: Record<string, Weather>, today: string): number {
  let streak = 0;
  const cur = new Date(today + "T00:00:00");
  while (history[isoDay(cur)]) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export default function CalendarBoardClient() {
  const [now, setNow] = useState<Date | null>(null);
  const [history, setHistory] = useState<Record<string, Weather>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setNow(new Date());
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Stored;
        setHistory(parsed.history ?? {});
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const stored: Stored = {
        history,
        lastVisit: now ? isoDay(now) : "",
      };
      localStorage.setItem(STORE_KEY, JSON.stringify(stored));
    } catch {
      /* ignore */
    }
  }, [history, now, hydrated]);

  if (!now) {
    return <div className="p-6 text-slate-500">Loading...</div>;
  }

  const todayKey = isoDay(now);
  const todayWeather = history[todayKey];
  const streak = calcStreak(history, todayKey);

  const setWeather = (w: Weather) => {
    setHistory((prev) => ({ ...prev, [todayKey]: w }));
  };

  return (
    <div className="px-4 py-6">
      <header className="max-w-4xl mx-auto mb-6 text-center">
        <h1 className="text-2xl font-semibold">Calendar & Weather Board</h1>
        <p className="text-sm text-slate-500 mt-1">Good morning! Check today.</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-slate-300 rounded-xl p-6 text-center">
          <div className="text-sm uppercase tracking-wider text-slate-500 mb-2">
            Today is
          </div>
          <div className="text-4xl sm:text-5xl font-semibold text-slate-800">
            {DAYS[now.getDay()]}
          </div>
          <div className="mt-2 text-2xl sm:text-3xl text-slate-600">
            {MONTHS[now.getMonth()]} {now.getDate()}, {now.getFullYear()}
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-6">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-3 text-center">
            Days of the week
          </h2>
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((d, i) => (
              <div
                key={d}
                className={`text-center py-2 rounded-md text-xs sm:text-sm ${
                  i === now.getDay()
                    ? "bg-amber-300 text-slate-900 font-bold"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {d.slice(0, 3)}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-6">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-3 text-center">
            Months of the year
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
            {MONTHS.map((m, i) => (
              <div
                key={m}
                className={`text-center py-2 rounded-md text-xs sm:text-sm ${
                  i === now.getMonth()
                    ? "bg-emerald-300 text-slate-900 font-bold"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {m.slice(0, 3)}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-6">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-3 text-center">
            How is the weather today?
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {WEATHER_OPTS.map((w) => (
              <button
                key={w.key}
                onClick={() => setWeather(w.key)}
                className={`flex flex-col items-center py-3 rounded-lg border-2 transition ${
                  todayWeather === w.key
                    ? "border-amber-500 bg-amber-50"
                    : "border-slate-200 bg-white hover:border-slate-400"
                }`}
              >
                <span className="text-3xl">{w.emoji}</span>
                <span className="text-xs mt-1 text-slate-700">{w.label}</span>
              </button>
            ))}
          </div>
          {todayWeather && (
            <div className="text-center mt-4 text-slate-600">
              Today is {WEATHER_OPTS.find((w) => w.key === todayWeather)?.label.toLowerCase()}.
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-xl p-5 text-center">
          <div className="text-sm uppercase tracking-wider text-amber-800 mb-1">
            Daily streak
          </div>
          <div className="text-5xl font-bold text-amber-700">
            {streak} <span className="text-2xl">day{streak === 1 ? "" : "s"}</span>
          </div>
          <div className="text-xs text-amber-700/70 mt-1">
            Come back tomorrow to keep it going!
          </div>
        </div>
      </div>
    </div>
  );
}
