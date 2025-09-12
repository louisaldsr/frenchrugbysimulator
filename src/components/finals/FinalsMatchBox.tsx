import { Final, FinalsKeys } from "@/types/Finals";
import TeamButton from "./TeamButton";

interface FinalsMatchBoxProps {
  finalKey: FinalsKeys;
  final: Final;
}

export default function FinalsMatchBox(props: FinalsMatchBoxProps) {
  const { finalKey, final } = props;
  const { home, away, winner } = final;
  const disabled = Boolean(!home || !away || winner);

  return (
    <div className="p-[1px] rounded-3xl">
      <div className="flex flex-col gap-2 p-3 rounded-[calc(theme(borderRadius.3xl)-1px)] ring-1 ring-white/10 backdrop-blur-sm shadow-lg shadow-black/20">
        <TeamButton
          key={`${finalKey}Home`}
          finalKey={finalKey}
          teamId={home}
          winner={winner}
          disabled={disabled}
        />
        <TeamButton
          key={`${finalKey}Away`}
          finalKey={finalKey}
          teamId={away}
          winner={winner}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
