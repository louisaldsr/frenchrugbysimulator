"use client";

import { loadGameStore } from "@/actions/game-competition-store-loader";
import { useGameStore } from "@/context/GameStore";
import { useState } from "react";
import RefreshIcon from "../global/RefreshIcon";

export default function GlobalResetButton() {
  const [busy, setBusy] = useState(false);

  const competition = useGameStore((store) => store.competition);
  const calendars = useGameStore((store) => store.calendars);
  const setCalendars = useGameStore((store) => store.setCalendars);

  const handleReset = async () => {
    try {
      setBusy(true);
      if (confirm("Are you sure you want to reset all simulations?")) {
        const refreshedStore = await loadGameStore();
        setCalendars(
          {
            ...calendars,
            [competition]: refreshedStore.calendars[competition],
          },
          true
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleReset}
      disabled={busy}
      className="inline-flex items-center gap-2 px-4 py-2 
        bg-red-300 hover:bg-red-600 
        border border-gray-300 
        text-gray-700 
        rounded-lg transition-all duration-200 
        shadow-sm hover:shadow 
        focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshIcon busy={busy} />
      <span className="font-medium">Reset ALL</span>
    </button>
  );
}
