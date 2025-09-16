import { Day } from "@/types/Calendar";

export function isDaySimulated(day: Day): boolean {
  return day.every((match) => match.simulated);
}
