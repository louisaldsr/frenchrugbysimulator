"use client";
import { useGameStore } from "@/context/GameStore";
import { Finals, FinalsKeys } from "@/types/Finals";
import ChampionCelebration from "./ChampionCelebration";
import StageColumn from "./StageColumn";

export default function FinalsBrackets() {
  const finals = useGameStore((store) => store.getFinals());
  const championId = useGameStore((store) => store.getChampion());
  if (championId) {
    return (
      <>
        <ChampionCelebration championId={championId} />
      </>
    );
  }

  const pickStage = (finalKeys: FinalsKeys[]): Partial<Finals> => {
    const stage: Partial<Finals> = {};
    finalKeys.forEach((key) => {
      stage[key] = finals[key];
    });
    return stage;
  };

  return (
    <div className="w-full min-h-[60vh] p-6 text-slate-100">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <StageColumn
          stage={"playOffs"}
          finals={pickStage([FinalsKeys.PlayOff1, FinalsKeys.PlayOff2])}
        />
        <StageColumn
          stage={"semiFinals"}
          finals={pickStage([FinalsKeys.SemiFinal1, FinalsKeys.SemiFinal2])}
        />
        <StageColumn stage={"final"} finals={pickStage([FinalsKeys.Final])} />
      </div>
    </div>
  );
}
