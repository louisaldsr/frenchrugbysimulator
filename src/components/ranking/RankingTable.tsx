"use client";

import {
  RANKING_QUALIFICATION_POSITIONS,
  RANKING_RELEGATION_POSITIONS,
} from "@/constants";
import { useGameStore } from "@/context/GameStore";
import { backgroundColors } from "@/styles/colors";
import RankingHeader from "./RankingHeader";
import RankingRow from "./RankingRow";

export default function RankingTable() {
  const { getTeam, getRanking } = useGameStore();
  const ranking = getRanking();
  const numberOfTeams = ranking.length;

  const getBackgroundColor = (position: number): string | undefined => {
    if (RANKING_QUALIFICATION_POSITIONS.SEMI_FINALS.includes(position)) {
      return backgroundColors.ranking.semiQualified;
    }
    if (RANKING_QUALIFICATION_POSITIONS.PLAY_OFFS.includes(position)) {
      return backgroundColors.ranking.playOffsQualified;
    }
    if (
      RANKING_RELEGATION_POSITIONS.RELEGATION.includes(
        numberOfTeams - position + 1
      )
    ) {
      return backgroundColors.ranking.relagated;
    }
    if (
      RANKING_RELEGATION_POSITIONS.PLAY_OFFS.includes(
        numberOfTeams - position + 1
      )
    ) {
      return backgroundColors.ranking.playOffsRelegated;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <RankingHeader />
        <tbody>
          {Array.from(ranking).map((teamRanking, index) => {
            const team = getTeam(teamRanking.teamId);
            return (
              <RankingRow
                key={team.id}
                position={index + 1}
                teamRanking={teamRanking}
                teamLogoUrl={team.logoUrl}
                teamName={team.name}
                backgroundColor={getBackgroundColor(index + 1)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
