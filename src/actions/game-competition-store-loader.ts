"use server";

import { Calendar } from "@/types/Calendar";
import { Competition } from "@/types/Competition";
import { Team } from "@/types/Team";
import { promises as fs } from "fs";

export interface GameStoreLoaderResult {
  teams: Team[];
  calendars: Record<Competition, Calendar>;
}

export async function loadGameStore(): Promise<GameStoreLoaderResult> {
  const teams = await loadTeams();
  const calendars: Record<Competition, Calendar> = {
    top14: await loadCalendar("top14", 14),
    prod2: await loadCalendar("prod2", 16),
  };
  return { teams, calendars };
}

async function loadTeams(): Promise<Team[]> {
  const rawTeams = (
    await Promise.all([
      readCsv("prod2", "teams.csv"),
      readCsv("top14", "teams.csv"),
    ])
  ).flat();

  const teams = rawTeams.map((rawTeam) => {
    const teamData = rawTeam.split(",");
    const id = teamData[0];
    const name = teamData[1];
    const initialPoints = Number(teamData[2]);
    return createTeam(id, name, initialPoints);
  });

  return teams;
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

import { sanitizeId, sanitizeTeamName } from "@/helpers/sanitizers";
import { Match } from "@/types/Match";
import path from "path";
import { v4 } from "uuid";

async function loadCalendar(
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

export async function readCsv(
  competition: Competition,
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
