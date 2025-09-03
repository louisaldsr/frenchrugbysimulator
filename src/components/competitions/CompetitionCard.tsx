"use client";
import { Competition } from "@/types/Competition";
import Image from "next/image";
import Link from "next/link";

interface Props {
  competition: Competition;
}

export default function CompetitionCard(props: Props) {
  const { competition } = props;

  return (
    <Link
      href={`/${competition}`}
      className="group relative overflow-hidden rounded-3xl w-full max-w-3xl mx-auto min-h-[180px] sm:min-h-[440px] border border-neutral-800 bg-neutral-900/60 text-left shadow transition hover:border-neutral-700 active:scale-[0.99]"
      aria-label={`Choose ${competition.toUpperCase()}`}
      prefetch={false}
    >
      <div className="absolute inset-0">
        <Image
          src={`/competitions/bouclier-${competition}.png`}
          alt="Trophy background"
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.45),rgba(0,0,0,0.45))]" />
      </div>

      <div className="relative z-10 grid h-full w-full place-items-center p-6">
        <div className="rounded-2xl bg-black/40 backdrop-blur px-6 py-6 shadow-lg ring-1 ring-white/10">
          <Image
            src={`/competitions/${competition}.svg`}
            width={72}
            height={72}
            alt={`${competition} logo`}
          />
        </div>
      </div>
    </Link>
  );
}
