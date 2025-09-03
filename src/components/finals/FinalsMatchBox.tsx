import { FinalsKeys } from "@/types/Finals";
import { Match } from "@/types/Match";
import TeamButton from "./TeamButton";

interface FinalsMatchBoxProps {
  finalKey: FinalsKeys;
  match: Match;
}

export default function FinalsMatchBox(props: FinalsMatchBoxProps) {
  const { finalKey, match } = props;

  return (
    <div className="p-[1px] rounded-3xl">
      <div className="flex flex-col gap-2 p-3 rounded-[calc(theme(borderRadius.3xl)-1px)] ring-1 ring-white/10 backdrop-blur-sm shadow-lg shadow-black/20">
        <TeamButton
          key={`${finalKey}Home`}
          finalKey={finalKey}
          side={"home"}
          match={match}
        />
        <TeamButton
          key={`${finalKey}Away`}
          finalKey={finalKey}
          side={"away"}
          match={match}
        />
      </div>
    </div>
  );
}
