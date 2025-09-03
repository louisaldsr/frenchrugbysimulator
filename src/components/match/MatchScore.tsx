"use client";

import { useGameStore } from "@/context/GameStore";
import { useScoreUpdate } from "@/context/ScoreContext";
import { Match, MatchSide } from "@/types/Match";
import { useEffect, useState } from "react";
import ScoreDisplay from "./ScoreInput";
import WinnerBonusToggle from "./WinnerBonusToggle";

export interface MatchScoreProps {
  match: Match;
}

export default function MatchScore(props: MatchScoreProps) {
  const { notify } = useScoreUpdate();
  const changeMatchScore = useGameStore((store) => store.updateMatchScore);
  const changeOffensiveBonus = useGameStore(
    (store) => store.updateOffensiveBonus
  );

  const { match } = props;
  const matchId = match.id;
  const isSimulatable = match.homeTeamId === "" || match.awayTeamId === "";
  const [inputHomeScore, setInputHomeScore] = useState<string>(
    match.homeTeamScore.toString()
  );
  const [inputAwayScore, setInputAwayScore] = useState<string>(
    match.awayTeamScore.toString()
  );

  const [offensiveBonus, setOffensiveBonus] = useState<boolean>(
    match.hasWinnerBonus || false
  );
  useEffect(() => {
    changeOffensiveBonus(matchId, offensiveBonus);
    notify();
  }, [offensiveBonus]);

  const getWinner = (): MatchSide | null => {
    if (inputHomeScore > inputAwayScore) return "home";
    if (inputHomeScore < inputAwayScore) return "away";
    return null;
  };
  const [winner, setWinner] = useState<MatchSide | null>(null);
  useEffect(() => {
    setWinner(getWinner);
  }, [inputHomeScore, inputAwayScore]);

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
          inputScore={inputHomeScore}
          setInputScore={setInputHomeScore}
          changeScoreAction={(newScore: number) =>
            changeMatchScore({ matchId, homeScore: newScore, awayScore: null })
          }
          isSimulatable={isSimulatable}
        />
        <div className="text-center font-bold">-</div>
        <ScoreDisplay
          inputScore={inputAwayScore}
          setInputScore={setInputAwayScore}
          changeScoreAction={(newScore: number) =>
            changeMatchScore({ matchId, homeScore: null, awayScore: newScore })
          }
          isSimulatable={isSimulatable}
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
