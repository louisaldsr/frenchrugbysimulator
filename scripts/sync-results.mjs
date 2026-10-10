// Fetches TOP14 / PROD2 results from lnr.fr and writes them into
// public/data/<competition>/calendar.csv. Run by .github/workflows/sync-results.yml.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COMPETITIONS = ["top14", "prod2"];
const REQUEST_DELAY_MS = 500;
const FETCH_ATTEMPTS = 3;

// lnr.fr club slug -> sanitized team name in teams.csv, when they differ.
const SLUG_ALIASES = {
  paris: "stade-francais",
  toulouse: "stade-toulousain",
  "bordeaux-begles": "union-bordeaux-begles",
};

// Same as sanitizeTeamName() in src/helpers/sanitizers.ts
export function sanitizeTeamName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/(\r\n|\n|\r)/gm, "")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// Reads a JSON-valued Vue prop such as <score-slider :weeks='[...]'>.
function readJsonProp(html, tag, prop) {
  const tagStart = html.indexOf(`<${tag}`);
  if (tagStart === -1) throw new Error(`<${tag}> not found in page`);
  const match = html.slice(tagStart).match(new RegExp(`\\s${prop}='([^']*)'`));
  if (!match) throw new Error(`${prop} not found on <${tag}>`);
  return JSON.parse(decodeHtmlEntities(match[1]));
}

function clubSlug(url) {
  const match = url.match(/\/club\/([a-z0-9-]+)/);
  if (!match) throw new Error(`Unexpected club url: ${url}`);
  return match[1];
}

/**
 * Parses the header score slider present on every calendar page: it always shows
 * the current round, with a live status per match.
 */
export function parseCurrentRound(html) {
  const seasons = readJsonProp(html, "filters-fixtures", ":filter-list").seasons;
  const season = [...seasons].sort(
    (a, b) => new Date(b.ends_at) - new Date(a.ends_at),
  )[0].name;
  const [week] = readJsonProp(html, "score-slider", ":weeks");
  const matches = readJsonProp(html, "score-slider", ":matches");
  const statuses = new Map(
    matches.map((match) => [
      `${clubSlug(match.hosting_club.url)}|${clubSlug(match.visiting_club.url)}`,
      match.status,
    ]),
  );
  return { season, round: week.number, statuses };
}

export function parseRoundNumber(html) {
  const match = html.match(/calendar-results__title[^"]*">\s*Journée\s+(\d+)/);
  return match ? Number(match[1]) : null;
}

/** Parses the main match list of a round page. `score` is null for unplayed matches. */
export function parseRoundMatches(html) {
  return html
    .split('class="match-calendar-line "')
    .slice(1)
    .map((block) => {
      const slugs = [
        ...block.matchAll(/href="https?:\/\/[a-z0-9]+\.lnr\.fr\/club\/([a-z0-9-]+)"/g),
      ].map((match) => match[1]);
      if (slugs.length < 2) throw new Error("Match block without two clubs");
      const [homeSlug, awaySlug] = slugs;

      const scoreMatch = block.match(
        /class="match-line__score"[^>]*>\s*(\d+)\s*-\s*(\d+)\s*</,
      );
      if (!scoreMatch) return { homeSlug, awaySlug, score: null };

      // Bonus icons are rendered before the score for the home team, after it for the away team.
      const bonusIndexes = [
        ...block.matchAll(/club-special-icon--active">\s*Bo\s*</g),
      ].map((match) => match.index);
      return {
        homeSlug,
        awaySlug,
        score: [Number(scoreMatch[1]), Number(scoreMatch[2])],
        homeOffensiveBonus: bonusIndexes.some((index) => index < scoreMatch.index),
        awayOffensiveBonus: bonusIndexes.some((index) => index > scoreMatch.index),
      };
    });
}

/** Returns a resolver from lnr.fr club slug to team id, based on teams.csv. */
export function createTeamResolver(teamsCsv) {
  const idsByName = new Map(
    teamsCsv
      .split(/\r?\n/)
      .map((line) => line.split(","))
      .filter((columns) => columns.length >= 2)
      .map(([id, name]) => [sanitizeTeamName(name.trim()), id.trim()]),
  );
  return (slug) => {
    const id = idsByName.get(SLUG_ALIASES[slug] ?? slug);
    if (!id) {
      throw new Error(
        `Unknown club "${slug}": add it to teams.csv or to SLUG_ALIASES in scripts/sync-results.mjs`,
      );
    }
    return id;
  };
}

export function maxCalendarDay(calendarCsv) {
  return Math.max(
    ...calendarCsv.split("\n").map((line) => Number(line.split(",")[0]) || 0),
  );
}

/**
 * Writes results into calendar.csv content, keeping every other row untouched.
 * results: [{ day, homeId, awayId, homeScore, awayScore, winnerOffensiveBonus }]
 */
export function applyResults(calendarCsv, results) {
  const eol = calendarCsv.includes("\r\n") ? "\r\n" : "\n";
  const lines = calendarCsv.split(eol);
  const lineIndexes = new Map();
  lines.forEach((line, index) => {
    const [day, homeId, awayId] = line.split(",").map((value) => value.trim());
    if (Number(day)) lineIndexes.set(`${Number(day)},${homeId},${awayId}`, index);
  });

  const changes = [];
  for (const result of results) {
    const index = lineIndexes.get(`${result.day},${result.homeId},${result.awayId}`);
    if (index === undefined) {
      throw new Error(
        `No calendar row for day ${result.day}: ${result.homeId} vs ${result.awayId}`,
      );
    }
    const [day, homeId, awayId] = lines[index].split(",");
    const updated = [
      day,
      homeId,
      awayId,
      result.homeScore,
      result.awayScore,
      result.winnerOffensiveBonus ? "TRUE" : "FALSE",
    ].join(",");
    if (updated !== lines[index]) {
      changes.push({ before: lines[index], after: updated });
      lines[index] = updated;
    }
  }
  return { csv: lines.join(eol), changes };
}

export function toResult(day, match, resolveTeam) {
  const [homeScore, awayScore] = match.score;
  const winnerOffensiveBonus =
    homeScore > awayScore
      ? match.homeOffensiveBonus
      : awayScore > homeScore && match.awayOffensiveBonus;
  return {
    day,
    homeId: resolveTeam(match.homeSlug),
    awayId: resolveTeam(match.awaySlug),
    homeScore,
    awayScore,
    winnerOffensiveBonus,
  };
}

async function fetchPage(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "frenchrugbysimulator results sync" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      if (attempt >= FETCH_ATTEMPTS) throw new Error(`${url}: ${error.message}`);
      await sleep(attempt * 2000);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncCompetition(competition) {
  const dataDir = path.join(ROOT, "public", "data", competition);
  const calendarPath = path.join(dataDir, "calendar.csv");
  const calendarCsv = await readFile(calendarPath, "utf8");
  const resolveTeam = createTeamResolver(
    await readFile(path.join(dataDir, "teams.csv"), "utf8"),
  );

  const baseUrl = `https://${competition}.lnr.fr/calendrier-et-resultats`;
  const current = parseCurrentRound(await fetchPage(baseUrl));
  const lastRound = Math.min(current.round, maxCalendarDay(calendarCsv));
  console.log(`[${competition}] season ${current.season}, current round ${current.round}`);

  const results = [];
  for (let round = 1; round <= lastRound; round++) {
    await sleep(REQUEST_DELAY_MS);
    const html = await fetchPage(`${baseUrl}/${current.season}/j${round}`);
    const pageRound = parseRoundNumber(html);
    if (pageRound !== round) {
      throw new Error(`[${competition}] asked for round ${round}, got ${pageRound}`);
    }
    for (const match of parseRoundMatches(html)) {
      if (!match.score) continue;
      const key = `${match.homeSlug}|${match.awaySlug}`;
      if (round === current.round && current.statuses.get(key) !== "finished") {
        console.log(`[${competition}] J${round} ${key}: not finished yet, skipped`);
        continue;
      }
      results.push(toResult(round, match, resolveTeam));
    }
  }

  const { csv, changes } = applyResults(calendarCsv, results);
  for (const change of changes) {
    console.log(`[${competition}] ${change.before} -> ${change.after}`);
  }
  console.log(`[${competition}] ${results.length} results found, ${changes.length} rows updated`);
  if (changes.length) await writeFile(calendarPath, csv);
}

async function main() {
  for (const competition of COMPETITIONS) {
    await syncCompetition(competition);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
