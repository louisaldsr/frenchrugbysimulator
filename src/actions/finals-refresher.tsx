"use client";

import { useGameStore } from "@/context/GameStore";
import { useEffect } from "react";

export default function FinalsRefreshEffect() {
  const refreshFinals = useGameStore((store) => store.refreshFinals);
  const calendar = useGameStore((store) => store.getCalendar());

  useEffect(() => {
    refreshFinals();
  }, [calendar, refreshFinals]);

  return null;
}
