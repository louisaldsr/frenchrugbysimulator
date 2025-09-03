"use client";

import { useGameStore } from "@/context/GameStore";
import Link from "next/link";

export default function FinalsButton() {
  const competition = useGameStore((store) => store.competition);

  return (
    <Link
      href={`/${competition}/finals`}
      aria-label="Go to Finals Simulation"
      className="group block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">
            Let’s Play Finals
          </h3>
          <p className="mt-1 text-sm text-zinc-500">Playoffs → Semis → Final</p>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white transition group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}
