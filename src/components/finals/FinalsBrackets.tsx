"use client";
import { useGameStore } from "@/context/GameStore";
import { FinalsKeys } from "@/types/Finals";
import ChampionCelebration from "./ChampionCelebration";
import StageColumn from "./StageColumn";

export default function FinalsBrackets() {
  const finals = useGameStore((store) => store.finals);
  const championId = useGameStore((store) => store.championId);

  if (championId) {
    return (
      <>
        <ChampionCelebration championId={championId} />
      </>
    );
  }

  return (
    <div className="w-full min-h-[60vh] p-6 text-slate-100">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <StageColumn
          stage={"playOffs"}
          finals={{
            [FinalsKeys.PlayOff1]: finals[FinalsKeys.PlayOff1],
            [FinalsKeys.PlayOff2]: finals[FinalsKeys.PlayOff2],
          }}
        />
        <StageColumn
          stage={"semiFinals"}
          finals={{
            [FinalsKeys.SemiFinal1]: finals[FinalsKeys.SemiFinal1],
            [FinalsKeys.SemiFinal2]: finals[FinalsKeys.SemiFinal2],
          }}
        />
        <StageColumn
          stage={"final"}
          finals={{
            [FinalsKeys.Final]: finals[FinalsKeys.Final],
          }}
        />
      </div>
    </div>
  );
}
