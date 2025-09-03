"use client";

import { useGameStore } from "@/context/GameStore";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface Props {
  championId: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const loadConfetti = async () => (await import("canvas-confetti")).default;

export default function ChampionCelebration(props: Props) {
  const champion = useGameStore((store) => store.getTeam(props.championId));
  const resetChampion = useGameStore((store) => store.resetChampion);
  const competition = useGameStore((store) => store.competition);

  const onClose = () => {
    resetChampion();
  };

  useEffect(() => {
    let stop = false;
    if (!champion) return;

    const run = async () => {
      if (prefersReducedMotion()) return;

      const confetti = await loadConfetti();

      const bursts = 15;
      const interval = 1000;
      for (let i = 0; i < bursts && !stop; i++) {
        confetti({
          particleCount: 140,
          spread: 70,
          origin: { y: 0.7 },
          scalar: 0.9,
          ticks: 180,
        });
        await new Promise((r) => setTimeout(r, interval));
      }
      if (!stop) {
        confetti({
          particleCount: 220,
          spread: 100,
          startVelocity: 40,
          origin: { y: 0.5 },
          gravity: 0.8,
        });
      }
    };
    run();

    return () => {
      stop = true;
    };
  }, [champion]);

  return (
    <AnimatePresence>
      {champion && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Dim + spotlight */}
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_60%)]" />

          {/* Card */}
          <motion.div
            className="relative z-10 w-[min(640px,92vw)] rounded-3xl border border-white/10 bg-white/90 p-8 shadow-2xl backdrop-blur-lg text-center"
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Tiny badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-100/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
              <Trophy className="h-3.5 w-3.5" />
              Grand Winner
            </div>

            {/* Big centered logo with glow */}
            <div className="mx-auto mb-5 grid place-items-center">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-2xl blur-2xl bg-amber-400/30"
                  aria-hidden
                />
                <div className="relative h-36 w-36 md:h-44 md:w-44 rounded-2xl border border-black/10 bg-white shadow-xl grid place-items-center">
                  <Image
                    src={champion.logoUrl}
                    alt={`${champion.name} logo`}
                    width={176}
                    height={176}
                    className="h-32 w-32 md:h-40 md:w-40 object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Team name (biggest element) */}
            <h2
              className="mx-auto max-w-[28ch] text-3xl md:text-4xl font-extrabold tracking-tight
             flex items-center justify-center gap-3"
            >
              <Image
                src={`/competitions/bouclier-${competition}.png`}
                alt="Official trophy"
                width={64}
                height={64}
                className="inline-block h-[1em] w-[1em] object-contain translate-y-[0.04em]"
                priority
              />
              <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {champion.name}
              </span>
            </h2>

            {/* Optional subtle subtitle */}
            <p className="mt-1 text-[11px] uppercase tracking-wider text-gray-600">
              Season concluded • Congratulations!
            </p>

            <div className="mt-7 flex justify-center">
              <button
                onClick={onClose}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 active:scale-[0.98] transition"
                autoFocus
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
