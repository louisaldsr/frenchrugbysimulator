"use client";

import { useGameStore } from "@/context/GameStore";
import { Match, MatchSide } from "@/types/Match";
import { useEffect, useState } from "react";
import ScoreDisplay from "./ScoreInput";
import WinnerBonusToggle from "./WinnerBonusToggle";

export interface MatchScoreProps {
  match: Match;
}

export default function MatchScore(props: MatchScoreProps) {
  const updateMatch = useGameStore((store) => store.updateMatch);

  const { match } = props;
  const matchId = match.id;
  const [homeScore, setHomeScore] = useState<number>(match.homeTeamScore);
  const [awayScore, setAwayScore] = useState<number>(match.awayTeamScore);

  useEffect(() => {
    if (homeScore !== match.homeTeamScore) setHomeScore(match.homeTeamScore);
    if (awayScore !== match.awayTeamScore) setAwayScore(match.awayTeamScore);
  }, [match.homeTeamScore, match.awayTeamScore]);

  const [offensiveBonus, setOffensiveBonus] = useState<boolean>(
    match.hasWinnerBonus || false
  );
  useEffect(() => {
    updateMatch({
      matchId,
      offensiveBonus,
    });
  }, [offensiveBonus, matchId, updateMatch]);

  const [winner, setWinner] = useState<MatchSide | null>(null);
  useEffect(() => {
    if (homeScore > awayScore) setWinner("home");
    else if (homeScore < awayScore) setWinner("away");
    else setWinner(null);
  }, [homeScore, awayScore]);

  return (
    <div className="relative flex items-center justify-center">
      {winner === "home" && (
        <div className="absolute -left-12">
          <WinnerBonusToggle
            bonus={offensiveBonus}
            side={"home"}
            onToggle={() => setOffensiveBonus(!offensiveBonus)}
          />
        </div>
      )}

      <div className="flex items-center justify-center min-w-[120px] tabular-nums font-semibold">
        <ScoreDisplay
          score={homeScore}
          setScore={setHomeScore}
          changeScoreAction={(newScore: number) =>
            updateMatch({ matchId, homeScore: newScore })
          }
        />
        <div className="text-center font-bold">-</div>
        <ScoreDisplay
          score={awayScore}
          setScore={setAwayScore}
          changeScoreAction={(newScore: number) =>
            updateMatch({ matchId, awayScore: newScore })
          }
        />
      </div>

      {winner === "away" && (
        <div className="absolute -right-12">
          <WinnerBonusToggle
            bonus={offensiveBonus}
            side={"away"}
            onToggle={() => setOffensiveBonus(!offensiveBonus)}
          />
        </div>
      )}
    </div>
  );
}
