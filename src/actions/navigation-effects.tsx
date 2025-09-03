"use client";

import { useGameStore } from "@/context/GameStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function NavigationEffects() {
  const pathname = usePathname();
  const refreshFinals = useGameStore((store) => store.refreshFinals);

  useEffect(() => {
    if (pathname.includes("/finals")) {
      refreshFinals();
    }
  }, [pathname, refreshFinals]);

  return null;
}
