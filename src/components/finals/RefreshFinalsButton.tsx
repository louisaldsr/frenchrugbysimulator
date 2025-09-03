"use client";
import { useGameStore } from "@/context/GameStore";
import { useState } from "react";

interface Props {
  className?: string;
}

export default function RefreshFinalsButton(props: Props) {
  const refreshFinals = useGameStore((store) => store.refreshFinals);
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    try {
      setBusy(true);
      await refreshFinals();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onClick}
      aria-label="Recompute finals from ranking"
      title="Recompute finals from ranking"
      aria-busy={busy}
      className={`group inline-flex items-center gap-2 rounded-2xl border border-white/10
                  bg-slate-900/70 px-3 py-2 text-sm font-medium text-slate-100 shadow-sm
                  hover:bg-slate-900/80 focus:outline-none focus-visible:ring-2
                  focus-visible:ring-violet-400/60 active:scale-95 transition ${props.className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 transition-transform ${
          busy ? "animate-spin" : "group-hover:rotate-180"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 3v6h-6" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 1 1-9-9"
        />
      </svg>
      <span className="hidden sm:inline">Recompute</span>
    </button>
  );
}
