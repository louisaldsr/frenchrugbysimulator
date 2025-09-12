"use client";
import { useGameStore } from "@/context/GameStore";
import { FinalsKeys } from "@/types/Finals";
import { Team } from "@/types/Team";
import Image from "next/image";
import { useRef, useState } from "react";

interface TeamButtonProps {
  finalKey: FinalsKeys;
  teamId: string | null;
  winner: string | null;
  disabled?: boolean;
}

const TBD_TEAM: Team = {
  id: "",
  name: "To Be Determined",
  logoUrl: "/team-logos/tobedetermined.svg",
  initialPoints: 0,
};

const HOLD_MS = 2000;

export default function TeamButton(props: TeamButtonProps) {
  const { finalKey, teamId, winner, disabled } = props;

  const getTeam = useGameStore((store) => store.getTeam);
  const qualifyTeam = useGameStore((store) => store.qualifyTeam);

  let team: Team = TBD_TEAM;
  if (teamId) {
    try {
      team = getTeam(teamId);
    } catch {}
  }

  let resultMatchStyle = "";
  const winnerStyle = "bg-green-400";
  const looserStyle = "bg-red-400";
  if (winner && teamId === winner) {
    resultMatchStyle = winnerStyle;
  } else if (winner && teamId !== winner) {
    resultMatchStyle = looserStyle;
  }

  const [isPressing, setIsPressing] = useState(false);
  const holdTimeoutRef = useRef<number>(null);

  const triggerAction = () => {
    if (teamId) {
      qualifyTeam(teamId, finalKey);
    }
  };

  const startHold = () => {
    if (disabled) return;
    setIsPressing(true);
    holdTimeoutRef.current = window.setTimeout(() => {
      setIsPressing(false);
      holdTimeoutRef.current = null;
      triggerAction();
    }, HOLD_MS);
  };

  const cancelHold = () => {
    setIsPressing(false);
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      startHold();
    }
  };
  const onKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      cancelHold();
    }
  };

  return (
    <button
      disabled={disabled}
      aria-disabled={disabled}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative overflow-hidden group flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition active:scale-[0.99] select-none touch-none ${resultMatchStyle} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 bg-green-400/40 ${
          isPressing
            ? "transition-[width] duration-[3000ms]"
            : "transition-none"
        }`}
        style={{ width: isPressing ? "100%" : "0%" }}
      />
      <div className="h-8 w-8 overflow-hidden ">
        <Image
          src={team.logoUrl}
          alt={`${team.name} logo`}
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
      </div>
      <div className="relative z-10 min-w-0 flex-1">
        <div className="truncate text-sm font-medium leading-tight text-gray-900">
          {team.name}
        </div>
        {!disabled && (
          <div className="relative z-10 text-[10px] text-gray-600">
            Hold 2s to qualify
          </div>
        )}
      </div>
    </button>
  );
}
