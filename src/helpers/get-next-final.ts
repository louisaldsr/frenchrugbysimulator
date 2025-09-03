import { FinalsKeys } from "@/types/Finals";
import { MatchSide } from "@/types/Match";

interface FinalsFlow {
  next: FinalsKeys;
  side: MatchSide;
}

export function getNextFinalsFlow(finalKey: FinalsKeys): FinalsFlow {
  switch (finalKey) {
    case FinalsKeys.PlayOff1:
      return { next: FinalsKeys.SemiFinal1, side: "away" };
    case FinalsKeys.PlayOff2:
      return { next: FinalsKeys.SemiFinal2, side: "away" };
    case FinalsKeys.SemiFinal1:
      return { next: FinalsKeys.Final, side: "home" };
    case FinalsKeys.SemiFinal2:
      return { next: FinalsKeys.Final, side: "away" };
    case FinalsKeys.Final:
      return { next: FinalsKeys.Champion, side: "home" };
  }
  throw new Error("FinalsKey unknwon");
}
