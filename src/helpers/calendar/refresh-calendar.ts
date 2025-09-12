import { Calendar } from "@/types/Calendar";
import getPlayedCalendar from "./get-played-calendar";

/**
 * From a calendar in memory, override the matchs played of the freshly fetched calendar
 * @param freshCalendar The newly fetched calendar
 * @param inMemoryCalendar The calendar currently in memory
 * @returns A calendar that merges the two calendars, keeping the scores from the in-memory calendar
 */
export default function refreshCalendar(
  freshCalendar: Calendar,
  inMemoryCalendar: Calendar
): Calendar {
  const playedFreshCalendar = getPlayedCalendar(freshCalendar);
  const refreshedCalendar = playedFreshCalendar.map((day, dayIndex) =>
    day.map((freshMatch) => {
      const inMemoryMatch = inMemoryCalendar[dayIndex].find(
        (match) => match.id === freshMatch.id
      );
      return inMemoryMatch ?? freshMatch;
    })
  );
  return refreshedCalendar;
}
