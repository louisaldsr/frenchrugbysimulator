import { Finals, FinalsKeys } from "@/types/Finals";
import FinalsMatchBox from "./FinalsMatchBox";

interface StageColumnProps {
  stage: string;
  finals: Partial<Finals>;
}

export default function StageColumn(props: StageColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400/90 select-none">
        {props.stage}
      </h3>
      <div className="flex flex-col gap-4">
        {Array.from(Object.entries(props.finals)).map(([finalKey, match]) => {
          return (
            <FinalsMatchBox
              key={match.id}
              finalKey={finalKey as FinalsKeys}
              match={match}
            />
          );
        })}
      </div>
    </div>
  );
}
