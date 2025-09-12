"use client";

import { useGameStore } from "@/context/GameStore";
import { Calendar } from "@/types/Calendar";
import { Competition } from "@/types/Competition";
import { Team } from "@/types/Team";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  competition: Competition;
  teams: Team[];
  calendars: Record<Competition, Calendar>;
}

export default function CompetitionStoreLoader(props: Props) {
  const { competition, teams, calendars } = props;

  const [initalized, setInitalized] = useState<boolean>(false);

  const setCompetition = useGameStore((store) => store.setCompetition);
  const setTeams = useGameStore((store) => store.setTeams);
  const setCalendars = useGameStore((store) => store.setCalendars);
  const refreshFinals = useGameStore((store) => store.refreshFinals);

  useEffect(() => {
    setCompetition(competition);
    setTeams(teams);
    setCalendars(calendars);
    refreshFinals();
    setInitalized(true);
  }, [
    competition,
    teams,
    calendars,
    refreshFinals,
    setCalendars,
    setCompetition,
    setTeams,
  ]);

  if (!initalized && teams.length > 0 && Object.keys(calendars).length > 0) {
    return (
      <div
        className="grid place-items-center py-16"
        role="status"
        aria-live="polite"
      >
        <div className="relative h-28 w-28">
          <div
            className="absolute inset-0 rounded-full border-4 border-neutral-700/60 border-t-transparent animate-spin [animation-duration:1.1s]"
            aria-hidden
          />
          <div className="absolute inset-0 grid place-items-center">
            {competition ? (
              <Image
                src={`/competitions/${competition}.svg`}
                alt={`${competition} logo`}
                width={44}
                height={44}
                className="opacity-90 animate-pulse"
                priority
              />
            ) : (
              <span className="text-4xl animate-bounce" aria-hidden>
                🏉
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 w-64 space-y-2" aria-hidden>
          <div className="h-2.5 rounded bg-neutral-800/70 animate-pulse" />
          <div className="h-2.5 rounded bg-neutral-800/60 animate-pulse" />
          <div className="h-2.5 rounded bg-neutral-800/50 animate-pulse" />
        </div>
      </div>
    );
  }

  return <>{props.children}</>;
}
