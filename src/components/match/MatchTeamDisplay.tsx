"use client";
import { useGameStore } from "@/context/GameStore";
import { Match, MatchSide } from "@/types/Match";
import MatchTeamLogo from "./MatchTeamLogo";
import MatchTeamName from "./MatchTeamName";

interface MatchTeamDisplayProps {
  match: Match;
  side: MatchSide;
}

export default function MatchTeamDisplay(props: MatchTeamDisplayProps) {
  const { match, side } = props;
  const teamId = side === "home" ? match.homeTeamId : match.awayTeamId;
  const getTeam = useGameStore((store) => store.getTeam);
  const team = getTeam(teamId);

  if (side === "home") {
    return (
      <div key={team.id} className="flex items-center gap-3 min-w-0">
        <MatchTeamLogo name={team.name} logoUrl={team.logoUrl} />
        <MatchTeamName name={team.name} />
      </div>
    );
  } else {
    return (
      <div
        key={team.id}
        className="flex items-center gap-3 justify-end min-w-0"
      >
        <MatchTeamName name={team.name} />
        <MatchTeamLogo name={team.name} logoUrl={team.logoUrl} />
      </div>
    );
  }
}
