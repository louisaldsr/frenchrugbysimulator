import { Calendar } from "@/types/Calendar";

/**
 * From a calendar in memory, override the matchs played of the freshly fetched calendar
 * @param freshCalendar The newly fetched calendar
 * @param savedCalendar The calendar currently in memory
 * @returns A calendar that merges the two calendars, keeping the scores from the in-memory calendar
 */
export default function refreshCalendar(
  freshCalendar: Calendar,
  savedCalendar: Calendar
): Calendar {
  return freshCalendar.map((day, dayIndex) => {
    const savedDay = savedCalendar[dayIndex] || [];
    return day.map((freshMatch) => {
      const savedMatch = savedDay.find((match) => match.id === freshMatch.id);
      if (!savedMatch) return freshMatch;
      if (freshMatch.simulated) return freshMatch;
      return savedMatch;
    });
  });
}
