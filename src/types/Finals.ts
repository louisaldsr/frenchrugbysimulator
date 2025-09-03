import { Match } from "./Match";

export enum FinalsKeys {
  PlayOff1 = "playoff 1",
  PlayOff2 = "playoff 2",
  SemiFinal1 = "semi final 1",
  SemiFinal2 = "semi final 2",
  Final = "final",
  Champion = "champion",
}

export type Finals = Record<FinalsKeys, Match>;
