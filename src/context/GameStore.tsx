"use client";

import { MatchNotFoundError } from "@/errors/MatchNotFound.error";
import { TeamNotFoundError } from "@/errors/TeamNotFound.error";
import refreshCalendar from "@/helpers/calendar/refresh-calendar";
import { computeFinals } from "@/helpers/finals/compute-finals";
import { computeRanking } from "@/helpers/ranking/ranking-computer";
import { Calendar } from "@/types/Calendar";
import { Competition } from "@/types/Competition";
import { Finals, FinalsKeys } from "@/types/Finals";
import { Match } from "@/types/Match";
import { Team, TeamId } from "@/types/Team";
import { TeamRanking } from "@/types/TeamRanking";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UpdateMatchParams {
  matchId: string;
  homeScore?: number;
  awayScore?: number;
  offensiveBonus?: boolean;
}

export interface GameStore {
  competition: Competition;
  calendars: Record<Competition, Calendar | null>;
  teams: Team[];
  finals: Finals;
  championId: TeamId | null;

  isInitialized: boolean;
  setInitialized: (value: boolean) => void;

  /* TEAMS */
  setTeams: (teams: Team[]) => void;
  getTeam: (id: TeamId) => Team;

  /* COMPETITION */
  setCompetition: (competition: Competition) => void;

  /* CALENDAR */
  getCalendar: () => Calendar;
  setCalendars: (calendars: Record<Competition, Calendar>) => void;

  /* RANKING */
  getRanking: () => TeamRanking[];

  /* MATCH */
  getMatch(matchId: string): Match;
  setMatch(match: Match): void;
  updateMatch(params: UpdateMatchParams): void;

  /* FINALS */
  refreshFinals(): void;
  setChampion(championId: TeamId | null): void;
  qualifyTeam(teamId: TeamId, finalKey: FinalsKeys): void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      competition: "top14",
      calendars: {
        prod2: null,
        top14: null,
      },
      teams: [],
      finals: {} as Finals,
      championId: null,

      isInitialized: false,
      setInitialized: (value: boolean) => set({ isInitialized: value }),

      /* TEAMS */
      setTeams: (teams) => set({ teams }),
      getTeam: (id) => {
        const team = get().teams.find((team) => team.id === id);
        if (!team) throw new TeamNotFoundError({ id });
        return team;
      },

      /* COMPETITION */
      setCompetition: (competition) => set({ competition }),

      /* CALENDAR */
      getCalendar: () => {
        const { competition, calendars } = get();
        if (!calendars[competition]) throw new Error("Calendar not found");
        return calendars[competition];
      },
      setCalendars: (freshCalendars) => {
        const refreshedCalendars = {
          prod2: freshCalendars.prod2,
          top14: freshCalendars.top14,
        };
        const inMemoryCalendars = get().calendars;
        if (inMemoryCalendars.prod2) {
          refreshedCalendars.prod2 = refreshCalendar(
            freshCalendars.prod2,
            inMemoryCalendars.prod2
          );
        }
        if (inMemoryCalendars.top14) {
          refreshedCalendars.top14 = refreshCalendar(
            freshCalendars.top14,
            inMemoryCalendars.top14
          );
        }

        set({ calendars: refreshedCalendars, isInitialized: true });
      },

      /* RANKING */
      getRanking() {
        const calendar = get().getCalendar();
        const teams = get().teams;
        return computeRanking(calendar, teams);
      },

      /* MATCH */
      getMatch(id) {
        const calendar = get().getCalendar();
        const match = calendar.flat().find((match) => match.id === id);
        if (!match) throw new MatchNotFoundError({ id });
        return match;
      },
      setMatch(match) {
        get().getMatch(match.id);
        const calendar = get().getCalendar();
        const updatedCalendar = calendar.map((day) =>
          day.map((calendarMatch) =>
            calendarMatch.id === match.id
              ? { ...calendarMatch, ...match }
              : calendarMatch
          )
        );

        set({
          calendars: {
            ...get().calendars,
            [get().competition]: updatedCalendar,
          },
        });
      },
      updateMatch(params) {
        const match = get().getMatch(params.matchId);
        if (params.homeScore !== undefined)
          match.homeTeamScore = params.homeScore;
        if (params.awayScore !== undefined)
          match.awayTeamScore = params.awayScore;
        if (params.offensiveBonus !== undefined)
          match.hasWinnerBonus = params.offensiveBonus;
        if (match.homeTeamScore || match.awayTeamScore) match.simulated = true;
        get().setMatch(match);
      },

      /* FINALS */
      refreshFinals() {
        const ranking = get().getRanking();
        const finals = computeFinals(ranking);
        set({ finals });
      },
      setChampion: (championId) => set({ championId }),
      qualifyTeam(teamId, finalKey) {
        const finals = Object.assign({}, get().finals);
        finals[finalKey].winner = teamId;
        switch (finalKey) {
          case FinalsKeys.PlayOff1:
            finals[FinalsKeys.SemiFinal1].away = teamId;
            break;
          case FinalsKeys.PlayOff2:
            finals[FinalsKeys.SemiFinal2].away = teamId;
            break;
          case FinalsKeys.SemiFinal1:
            finals[FinalsKeys.Final].home = teamId;
            break;
          case FinalsKeys.SemiFinal2:
            finals[FinalsKeys.Final].away = teamId;
            break;
          case FinalsKeys.Final:
            get().setChampion(teamId);
            break;
        }
        set({ finals });
      },
    }),
    {
      name: "gameStore",
      version: 1,
    }
  )
);
