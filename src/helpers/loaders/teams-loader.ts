import { Team } from "@/types/Team";
import { sanitizeTeamName } from "../sanitizers";
import readCsv from "./csv-reader";

export default async function loadTeams(): Promise<Team[]> {
  const rawTeams = (
    await Promise.all([
      readCsv("top14", "teams.csv"),
      readCsv("prod2", "teams.csv"),
    ])
  ).flat();

  const teams = rawTeams.map((rawTeam) => {
    const teamData = rawTeam.split(",");
    const id = teamData[0];
    const name = teamData[1];
    const initialPoints = Number(teamData[2]);
    return createTeam(id, name, initialPoints);
  });

  return teams;
}

function createTeam(id: string, name: string, initialPoints: number): Team {
  const logoUrl = `/team-logos/${sanitizeTeamName(name)}.svg`;
  return {
    id,
    name,
    logoUrl,
    initialPoints,
  };
}
