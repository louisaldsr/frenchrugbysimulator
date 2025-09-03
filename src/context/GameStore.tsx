"use client";

import { MatchNotFoundError } from "@/errors/MatchNotFound.error";
import { TeamNotFoundError } from "@/errors/TeamNotFound.error";
import { computeFinals } from "@/helpers/compute-finals";
import { getNextFinalsFlow } from "@/helpers/get-next-final";
import { computeRanking } from "@/helpers/ranking/ranking-computer";
import { Calendar } from "@/types/Calendar";
import { Competition } from "@/types/Competition";
import { Finals, FinalsKeys } from "@/types/Finals";
import { Team } from "@/types/Team";
import { TeamRanking } from "@/types/TeamRanking";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UpdateMatchScoreParams {
  matchId: string;
  homeScore: number | null;
  awayScore: number | null;
}

export interface CompetitionStore {
  championId: string;
  calendar: Calendar;
  finals: Finals;
  teams: Team[];
}

export interface GameStore {
  competition: Competition;
  competitionStores: Record<Competition, CompetitionStore | null>;
  setCompetition: (competition: Competition) => void;
  initializeCompetition: (
    competition: Competition,
    store: CompetitionStore
  ) => void;
  getCompetitionStore: () => CompetitionStore;
  updateCompetitionStore: (
    updater: (store: CompetitionStore) => CompetitionStore
  ) => void;
  updateMatchScore: (params: UpdateMatchScoreParams) => void;
  updateOffensiveBonus: (matchId: string, bonus: boolean) => void;
  getCalendar: () => Calendar;
  getFinals: () => Finals;
  getTeams: () => Team[];
  getTeam: (id: string) => Team;
  getChampion: () => string;
  getRanking: () => TeamRanking[];
  refreshFinals: () => void;
  qualifyTeamForNextFinal: (teamId: string, finalKey: FinalsKeys) => void;
  resetChampion: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      competition: "top14",
      competitionStores: {
        prod2: null,
        top14: null,
      },
      initialized: false,

      setCompetition: (competition: Competition) => {
        set({
          competition,
        });
      },

      initializeCompetition: (
        competition: Competition,
        store: CompetitionStore
      ) => {
        const existingStores = get().competitionStores;
        if (existingStores[competition]) return;
        set({
          competitionStores: {
            ...existingStores,
            [competition]: store,
          },
        });
      },

      getCompetitionStore: (): CompetitionStore => {
        const competition = get().competition;
        const store = get().competitionStores[competition];
        if (store === null)
          throw new Error(
            `Store of competition not initialized [competition: ${competition}]`
          );
        return store;
      },

      updateCompetitionStore: (
        updater: (store: CompetitionStore) => CompetitionStore
      ): void => {
        set((store) => {
          const competition = store.competition;
          const currentStore = store.getCompetitionStore();
          return {
            competitionStores: {
              ...store.competitionStores,
              [competition]: updater(currentStore!),
            },
          };
        });
      },

      getCalendar: (): Calendar => {
        return get().getCompetitionStore().calendar;
      },

      getFinals: (): Finals => {
        return get().getCompetitionStore().finals;
      },

      getTeams: (): Team[] => {
        return get().getCompetitionStore().teams;
      },

      getChampion: (): string => {
        return get().getCompetitionStore().championId;
      },

      updateMatchScore: (params: UpdateMatchScoreParams) => {
        const calendar = get().getCalendar();
        const match = calendar
          .flat()
          .find((match) => match.id === params.matchId);

        if (!match) throw new MatchNotFoundError({ id: params.matchId });
        if (params.homeScore) match.homeTeamScore = params.homeScore;
        if (params.awayScore) match.awayTeamScore = params.awayScore;
        match.simulated = true;
      },

      updateOffensiveBonus: (matchId: string, bonus: boolean) => {
        set((store) => {
          const calendar = store.getCalendar();
          const match = calendar.flat().find((match) => match.id === matchId);
          if (!match) return store;
          match.hasWinnerBonus = bonus;
          return store;
        });
      },

      getTeam(teamId: string): Team {
        const team = get()
          .getTeams()
          .find((team) => team.id === teamId);
        if (!team) throw new TeamNotFoundError({ id: teamId });
        return team;
      },

      getRanking(): TeamRanking[] {
        const calendar = get().getCalendar();
        const teams = get().getTeams();
        return computeRanking(calendar, teams);
      },

      refreshFinals(): void {
        const ranking = get().getRanking();
        const newFinals = computeFinals(ranking);
        get().updateCompetitionStore((store) => ({
          ...store,
          finals: newFinals,
        }));
      },

      qualifyTeamForNextFinal(teamId: string, finalKey: FinalsKeys): void {
        const existingFinals = get().getFinals();
        let championId = "";

        /* Represent winner with symbol score */
        const playedFinal = existingFinals[finalKey];
        if (playedFinal.homeTeamId === teamId) {
          playedFinal.homeTeamScore = 1;
          playedFinal.awayTeamScore = 0;
        } else {
          playedFinal.awayTeamScore = 1;
          playedFinal.homeTeamScore = 0;
        }

        /* Send winner to next final */
        const nextFinalFlow = getNextFinalsFlow(finalKey);
        if (nextFinalFlow.next === FinalsKeys.Champion) {
          championId = teamId;
        }
        const nextFinal = existingFinals[nextFinalFlow.next];
        if (nextFinalFlow.side === "home") {
          nextFinal.homeTeamId = teamId;
        } else {
          nextFinal.awayTeamId = teamId;
        }

        const updatedFinals: Finals = {
          ...existingFinals,
          [finalKey]: playedFinal,
          [nextFinalFlow.next]: nextFinal,
        };
        get().updateCompetitionStore((store) => ({
          ...store,
          championId,
          finals: updatedFinals,
        }));
      },

      resetChampion(): void {
        get().updateCompetitionStore((store) => ({ ...store, championId: "" }));
      },
    }),
    {
      name: "gameStore",
    }
  )
);
