import { TeamId } from "./Team";

export enum FinalsKeys {
  PlayOff1 = "playoff 1",
  PlayOff2 = "playoff 2",
  SemiFinal1 = "semi final 1",
  SemiFinal2 = "semi final 2",
  Final = "final",
}

export interface Final {
  home: TeamId | null;
  away: TeamId | null;
  winner: TeamId | null;
}

export type Finals = Record<FinalsKeys, Final>;
