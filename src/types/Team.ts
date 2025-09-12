export type TeamId = string;
export interface Team {
  readonly id: TeamId;
  readonly name: string;
  readonly logoUrl: string;
  readonly initialPoints: number;
}
