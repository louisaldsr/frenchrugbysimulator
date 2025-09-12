import { RANKING_QUALIFICATION_POSITIONS } from "@/constants";
import { Final, Finals, FinalsKeys } from "@/types/Finals";
import { TeamRanking } from "@/types/TeamRanking";

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
    [FinalsKeys.SemiFinal1]: createFinal(semiFinalsTeams[0], null),
    [FinalsKeys.SemiFinal2]: createFinal(semiFinalsTeams[1], null),
    [FinalsKeys.Final]: createFinal(null, null),
  };
}

function createFinal(home: string | null, away: string | null): Final {
  return {
    home,
    away,
    winner: null,
  };
}
