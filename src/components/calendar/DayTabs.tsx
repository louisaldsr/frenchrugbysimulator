"use client";

import { useGameStore } from "@/context/GameStore";
import { useSearchParams } from "next/navigation";
import { DayTab } from "./DayTab";

export default function DayTabs() {
  const searchParams = useSearchParams();
  const urlSelectedDay = searchParams.get("day");
  const selectedDay = urlSelectedDay ? Number(urlSelectedDay) : 1;

  const calendar = useGameStore((store) => store.getCalendar());

  return (
    <div className="flex gap-2 overflow-x-auto border-b pb-2">
      {calendar.map((day, index) => {
        const dayNumber = index + 1;
        const isSelected = selectedDay === dayNumber;
        return (
          <DayTab
            key={dayNumber}
            dayNumber={dayNumber}
            day={day}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  );
}
