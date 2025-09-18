"use client";

import { useGameStore } from "@/context/GameStore";
import { useState } from "react";
import RefreshIcon from "../global/RefreshIcon";

interface Props {
  dayNumber: number;
}

export default function DayResetButton(props: Props) {
  const [busy, setBusy] = useState(false);

  const competition = useGameStore((store) => store.competition);
  const calendars = useGameStore((store) => store.calendars);
  const setCalendars = useGameStore((store) => store.setCalendars);

  const resetDay = () => {
    try {
      setBusy(true);
      setCalendars(
        {
          ...calendars,
          [competition]: calendars[competition].map((day, index) => {
            if (index === props.dayNumber - 1) {
              return day.map((match) => ({
                ...match,
                homeTeamScore: 0,
                awayTeamScore: 0,
                simulated: false,
              }));
            }
            return day;
          }),
        },
        true
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={() => resetDay()}
      className="inline-flex items-center gap-2 px-15 py-1.5 
        text-sm font-medium
        bg-slate-900/70 hover:bg-selected 
        text-white
        border border-gray-200
        rounded-xl transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed"
      title={`Reset Day ${props.dayNumber}`}
      disabled={busy}
    >
      <RefreshIcon busy={busy} />
      <span>Reset Day</span>
    </button>
  );
}
