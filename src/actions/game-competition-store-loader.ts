"use server";
import "server-only";

import loadCalendar from "@/helpers/loaders/calendars-loader";
import loadTeams from "@/helpers/loaders/teams-loader";
import { Calendar } from "@/types/Calendar";
import { Competition } from "@/types/Competition";
import { Team } from "@/types/Team";

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
