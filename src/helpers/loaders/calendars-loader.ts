import { Calendar } from "@/types/Calendar";
import { Competition } from "@/types/Competition";
import { Match } from "@/types/Match";
import { sanitizeId } from "../sanitizers";
import readCsv from "./csv-reader";

export default async function loadCalendar(
  competition: Competition,
  supposedTeamNumber: number
): Promise<Calendar> {
  const regularSeasonDays = (supposedTeamNumber - 1) * 2;
  const calendar: Calendar = Array.from(
    { length: regularSeasonDays },
    () => []
  );
  const rawCalendar = await readCsv(competition, "calendar.csv");
  rawCalendar.forEach((rawMatch) => {
    const matchData = rawMatch.split(",");
    const rawDay = Number(matchData[0]);
    if (!rawDay) return;
    const home: MatchSideInitProps = {
      id: sanitizeId(matchData[1]),
      score: Number(matchData[3] ?? 0),
    };
    const away: MatchSideInitProps = {
      id: sanitizeId(matchData[2]),
      score: Number(matchData[4] ?? 0),
    };
    const winnerBonus = matchData[5].includes("TRUE") ? true : false;
    const match = createMatch(rawDay, home, away, winnerBonus);
    calendar[rawDay - 1].push(match);
  });

  return calendar;
}

interface MatchSideInitProps {
  id: string;
  score: number;
}

function createMatch(
  dayNumber: number,
  home: MatchSideInitProps,
  away: MatchSideInitProps,
  hasWinnerBonus: boolean = false
): Match {
  const simulated = Boolean(home.score || away.score);
  return {
    id: `${dayNumber}-${home.id}-${away.id}`,
    dayNumber,
    homeTeamId: home.id,
    homeTeamScore: home.score,
    awayTeamId: away.id,
    awayTeamScore: away.score,
    simulated,
    hasWinnerBonus,
  };
}
