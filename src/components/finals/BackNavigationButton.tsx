"use client";

import { useGameStore } from "@/context/GameStore";
import Link from "next/link";

interface Props {
  className?: string;
}

export default function BackNavigationButton(props: Props) {
  const competition = useGameStore((store) => store.competition);
  return (
    <Link
      href={`/${competition}`}
      aria-label="Back to season"
      title="Back to season"
      className={`group inline-flex items-center gap-2 rounded-2xl border border-white/10
                  bg-slate-900/70 px-3 py-2 text-sm font-medium text-slate-100 shadow-sm
                  hover:bg-slate-900/80 focus:outline-none focus-visible:ring-2
                  focus-visible:ring-violet-400/60 active:scale-95 transition ${props.className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 -ml-0.5 transition-transform group-hover:-translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span className="hidden sm:inline">Back</span>
    </Link>
  );
}
