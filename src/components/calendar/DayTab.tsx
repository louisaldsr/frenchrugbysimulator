import { isDaySimulated } from "@/helpers/calendar/day-helper";
import { Day } from "@/types/Calendar";
import Link from "next/link";

export interface DayTabsProps {
  day: Day;
  dayNumber: number;
  isSelected: boolean;
}

export function DayTab(props: DayTabsProps) {
  function getTabBackgroundColor(): string {
    if (props.isSelected) return "bg-selected text-white";
    const daySimulated = isDaySimulated(props.day);
    return daySimulated
      ? "bg-green-100 hover:bg-green-200"
      : "bg-gray-100 hover:bg-gray-200";
  }

  return (
    <Link
      href={`?day=${props.dayNumber}`}
      replace
      className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${getTabBackgroundColor()}`}
    >
      {`D${props.dayNumber}`}
    </Link>
  );
}
