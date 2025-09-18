"use client";
import { useGameStore } from "@/context/GameStore";
import MatchRow from "../match/MatchRow";
import DayResetButton from "./DayResetButton";

export interface DayMatchsProps {
  selectedDay: number;
}

export default function DayMatchs(props: DayMatchsProps) {
  const calendar = useGameStore((store) => store.getCalendar());
  const dayMatchs = calendar[props.selectedDay - 1];

  if (!dayMatchs) {
    return <div>No match for this day</div>;
  }

  return (
    <div>
      {dayMatchs.map((match) => {
        return <MatchRow key={match.id} match={match} />;
      })}
      <div className="flex justify-center mt-4">
        <DayResetButton dayNumber={props.selectedDay} />
      </div>
    </div>
  );
}
