"use client";

import { useMemo, useState } from "react";

type TreeNode = {
  value: number;
  prime: boolean;
  left?: TreeNode;
  right?: TreeNode;
};

function smallestFactor(n: number): number {
  if (n % 2 === 0) return 2;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return i;
  }
  return n;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  return smallestFactor(n) === n;
}

function buildTree(n: number): TreeNode {
  if (n < 2 || isPrime(n)) return { value: n, prime: true };
  const f = smallestFactor(n);
  return {
    value: n,
    prime: false,
    left: { value: f, prime: true },
    right: buildTree(n / f),
  };
}

function primesOf(n: number): number[] {
  if (n < 2) return [];
  const out: number[] = [];
  let m = n;
  while (m > 1) {
    const f = smallestFactor(m);
    out.push(f);
    m = m / f;
  }
  return out;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function exponentForm(primes: number[]): string {
  if (primes.length === 0) return "";
  const counts = new Map<number, number>();
  for (const p of primes) counts.set(p, (counts.get(p) ?? 0) + 1);
  const sorted = Array.from(counts.entries()).sort((a, b) => a[0] - b[0]);
  return sorted
    .map(([p, c]) => (c === 1 ? `${p}` : `${p}^${c}`))
    .join(" × ");
}

export default function FactorTreeClient() {
  const [a, setA] = useState<string>("36");
  const [b, setB] = useState<string>("24");
  const [mode, setMode] = useState<"single" | "pair">("pair");

  const na = Math.min(9999, Math.max(2, Number(a) || 0));
  const nb = Math.min(9999, Math.max(2, Number(b) || 0));
  const aValid = !isNaN(na) && na >= 2;
  const bValid = !isNaN(nb) && nb >= 2;

  const treeA = useMemo(() => (aValid ? buildTree(na) : null), [na, aValid]);
  const treeB = useMemo(
    () => (mode === "pair" && bValid ? buildTree(nb) : null),
    [mode, nb, bValid],
  );
  const primesA = useMemo(() => (aValid ? primesOf(na) : []), [na, aValid]);
  const primesB = useMemo(() => (bValid ? primesOf(nb) : []), [nb, bValid]);

  const sharedGCD = aValid && bValid ? gcd(na, nb) : null;
  const sharedLCM = aValid && bValid ? lcm(na, nb) : null;

  return (
    <div className="px-4 py-6">
      <header className="max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Factor Tree & GCF / LCM</h1>
          <p className="text-sm text-slate-500">
            Enter a number to see its prime factor tree. Add a second to find GCF and LCM.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "single" | "pair")}
            className="text-sm px-2 py-1.5 rounded-md border border-slate-300 bg-white"
            aria-label="Mode"
          >
            <option value="single">One number</option>
            <option value="pair">Two numbers (GCF/LCM)</option>
          </select>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-6 mb-6 justify-center">
          <NumberInput value={a} setValue={setA} label="Number A" />
          {mode === "pair" && (
            <NumberInput value={b} setValue={setB} label="Number B" />
          )}
        </div>

        <div className={`grid gap-6 ${mode === "pair" ? "md:grid-cols-2" : ""}`}>
          <TreeCard
            title={`Factors of ${na}`}
            tree={treeA}
            primes={primesA}
          />
          {mode === "pair" && (
            <TreeCard
              title={`Factors of ${nb}`}
              tree={treeB}
              primes={primesB}
            />
          )}
        </div>

        {mode === "pair" && sharedGCD !== null && sharedLCM !== null && (
          <div className="mt-6 bg-white border border-slate-300 rounded-lg p-5">
            <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-3">
              Shared
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Stat label={`GCF(${na}, ${nb})`} value={sharedGCD} hint="Greatest Common Factor — multiply the primes both numbers share" />
              <Stat label={`LCM(${na}, ${nb})`} value={sharedLCM} hint="Least Common Multiple — use the highest power of each prime that appears" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NumberInput({
  value,
  setValue,
  label,
}: {
  value: string;
  setValue: (v: string) => void;
  label: string;
}) {
  return (
    <label className="flex flex-col items-center">
      <span className="text-xs uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </span>
      <input
        type="number"
        min={2}
        max={9999}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-28 text-3xl font-mono text-center px-2 py-1 rounded-md border-2 border-slate-700 bg-white"
      />
    </label>
  );
}

function TreeCard({
  title,
  tree,
  primes,
}: {
  title: string;
  tree: TreeNode | null;
  primes: number[];
}) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg p-4">
      <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-3">
        {title}
      </h2>
      {tree ? (
        <>
          <div className="overflow-x-auto">
            <TreeView node={tree} />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 text-sm space-y-1">
            <div>
              <span className="text-slate-500">Primes: </span>
              <span className="font-mono">{primes.join(" × ") || "—"}</span>
            </div>
            <div>
              <span className="text-slate-500">Exponent form: </span>
              <span className="font-mono">{exponentForm(primes) || "—"}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-slate-400">Enter a number ≥ 2</div>
      )}
    </div>
  );
}

function TreeView({ node }: { node: TreeNode }) {
  return (
    <div className="flex flex-col items-center font-mono text-lg">
      <NodeBubble value={node.value} prime={node.prime} />
      {!node.prime && node.left && node.right && (
        <>
          <div className="flex items-center my-1">
            <div className="w-20 border-r border-slate-400 h-4 rounded-bl" />
            <div className="w-20 border-l border-slate-400 h-4 rounded-br" />
          </div>
          <div className="flex gap-10 items-start">
            <TreeView node={node.left} />
            <TreeView node={node.right} />
          </div>
        </>
      )}
    </div>
  );
}

function NodeBubble({ value, prime }: { value: number; prime: boolean }) {
  return (
    <div
      className={`min-w-[40px] px-2 py-1 rounded-full border-2 text-center ${
        prime
          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
          : "border-slate-700 bg-white text-slate-800"
      }`}
    >
      {value}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-3xl font-mono">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{hint}</div>
    </div>
  );
}
