import { RANKING_QUALIFICATION_POSITIONS } from "@/constants";
import { Finals, FinalsKeys } from "@/types/Finals";
import { Match } from "@/types/Match";
import { TeamRanking } from "@/types/TeamRanking";
import { v4 } from "uuid";

export function computeFinals(ranking: TeamRanking[]): Finals {
  const playOffTeams = RANKING_QUALIFICATION_POSITIONS.PLAY_OFFS.map(
    (qualifyingPosition) => ranking[qualifyingPosition - 1].teamId
  );
  const semiFinalsTeams = RANKING_QUALIFICATION_POSITIONS.SEMI_FINALS.map(
    (qualifyingPosition) => ranking[qualifyingPosition - 1].teamId
  );

  return {
    [FinalsKeys.PlayOff1]: createFinal(playOffTeams[0], playOffTeams[3]),
    [FinalsKeys.PlayOff2]: createFinal(playOffTeams[1], playOffTeams[2]),
    [FinalsKeys.SemiFinal1]: createFinal(semiFinalsTeams[0], ""),
    [FinalsKeys.SemiFinal2]: createFinal(semiFinalsTeams[1], ""),
    [FinalsKeys.Final]: createFinal("", ""),
    [FinalsKeys.Champion]: createFinal("", ""),
  };
}

function createFinal(homeTeamId: string, awayTeamId: string): Match {
  return {
    id: v4(),
    dayNumber: 0,
    homeTeamId,
    homeTeamScore: 0,
    awayTeamId,
    awayTeamScore: 0,
    simulated: false
  };
}
