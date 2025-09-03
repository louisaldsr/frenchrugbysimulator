"use server";
import { sanitizeId, sanitizeTeamName } from "@/helpers/sanitizers";
import { Calendar } from "@/types/Calendar";
import { Match } from "@/types/Match";
import { Team } from "@/types/Team";
import { promises as fs } from "fs";

import { CompetitionStore } from "@/context/GameStore";
import { Competition } from "@/types/Competition";
import { Finals, FinalsKeys } from "@/types/Finals";
import path from "path";
import { v4 } from "uuid";

interface MatchSideInitProps {
  id: string;
  score: number;
}

async function readCsv(
  competition: string,
  fileName: string
): Promise<string[]> {
  const csvPath = path.join(
    process.cwd(),
    "public",
    "data",
    competition,
    fileName
  );
  const rawFileContent = await fs.readFile(csvPath, "utf-8");
  return rawFileContent.split("\n");
}

export async function loadGameCompetitionStore(
  competition: Competition
): Promise<CompetitionStore> {
  /* TEAMS */
  const rawTeams = await readCsv(competition, "teams.csv");
  const teams = rawTeams.map((rawTeam) => {
    const teamData = rawTeam.split(",");
    const id = teamData[0];
    const name = teamData[1];
    const initialPoints = Number(teamData[2]);
    return createTeam(id, name, initialPoints);
  });

  /* CALENDAR SEASON */
  const regularSeasonDays = (teams.length - 1) * 2;
  const calendar: Calendar = Array.from(
    { length: regularSeasonDays },
    () => []
  );
  const rawCalendar = await readCsv(competition, "calendar.csv");
  rawCalendar.forEach((rawMatch) => {
    const matchData = rawMatch.split(",");
    const rawDay = Number(matchData[0]);
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

  /* FINALS */
  const emptyTeam: MatchSideInitProps = {
    id: "",
    score: 0,
  };
  const finals: Finals = {
    [FinalsKeys.PlayOff1]: createMatch(1, emptyTeam, emptyTeam),
    [FinalsKeys.PlayOff2]: createMatch(1, emptyTeam, emptyTeam),
    [FinalsKeys.SemiFinal1]: createMatch(2, emptyTeam, emptyTeam),
    [FinalsKeys.SemiFinal2]: createMatch(2, emptyTeam, emptyTeam),
    [FinalsKeys.Final]: createMatch(3, emptyTeam, emptyTeam),
    [FinalsKeys.Champion]: createMatch(3, emptyTeam, emptyTeam),
  };

  return {
    championId: "",
    calendar,
    teams,
    finals,
  };
}

function createTeam(id: string, name: string, initialPoints: number): Team {
  const logoUrl = `/team-logos/${sanitizeTeamName(name)}.svg`;
  return {
    id,
    name,
    logoUrl,
    initialPoints,
  };
}

function createMatch(
  dayNumber: number,
  home: MatchSideInitProps,
  away: MatchSideInitProps,
  hasWinnerBonus: boolean = false
): Match {
  const simulated = Boolean(home.score || away.score);
  return {
    id: v4(),
    dayNumber,
    homeTeamId: home.id,
    homeTeamScore: home.score,
    awayTeamId: away.id,
    awayTeamScore: away.score,
    simulated,
    hasWinnerBonus,
  };
}
