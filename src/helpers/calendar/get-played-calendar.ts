import { Calendar } from "@/types/Calendar";
import { Match } from "@/types/Match";

/**
 * From a calendar, returns a part of it that only contains the played games
 * @param {Calendar} calendar Loaded calendar with all games
 * @returns {Calendar} A calendar with only played games
 */
export default function getPlayedCalendar(calendar: Calendar): Calendar {
  const playedCalendar = calendar.map((day) => day.filter(isMatchPlayed));
  return playedCalendar;
}

function isMatchPlayed(match: Match): boolean {
  return match.homeTeamScore !== null && match.awayTeamScore !== null;
}
