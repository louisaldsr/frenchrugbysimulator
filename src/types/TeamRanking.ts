export interface TeamRanking {
  readonly teamId: string;
  points: number;
  bonuses: number;
  totalMatchs: {
    wins: number;
    draws: number;
    losses: number;
  };
  totalScore: {
    for: number;
    against: number;
  };
}
