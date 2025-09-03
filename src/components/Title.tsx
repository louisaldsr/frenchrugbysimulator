"use client";

import { useGameStore } from "@/context/GameStore";
import Image from "next/image";

export default function Title() {
  const competition = useGameStore((store) => store.competition);
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Image
        src={`/competitions/${competition}.svg`}
        alt={`${competition} logo`}
        width={48}
        height={48}
        className="h-15 w-auto"
      />
      <h1 className="text-4xl font-bold tracking-tight">Simulator</h1>
    </div>
  );
}
