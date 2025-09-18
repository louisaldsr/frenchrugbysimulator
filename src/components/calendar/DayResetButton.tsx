"use client";

import { useGameStore } from "@/context/GameStore";

interface Props {
  dayNumber: number;
}

export default function DayResetButton(props: Props) {
  const resetDay = useGameStore((store) => store.resetDay);

  return (
    <button
      onClick={() => resetDay(dayNumber)}
      className="text-sm px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
      title={`Reset Day ${dayNumber}`}
    >
      Reset Day
    </button>
  );
}
