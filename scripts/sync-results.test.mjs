import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  applyResults,
  createTeamResolver,
  maxCalendarDay,
  parseCurrentRound,
  parseRoundMatches,
  parseRoundNumber,
  toResult,
} from "./sync-results.mjs";

const dir = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) =>
  readFileSync(path.join(dir, "__fixtures__", name), "utf8");

const TEAMS_CSV = [
  "1aeebcc9,Stade Français,0",
  "92a6f37f,Lyon,0",
  "5cd94c08,Union Bordeaux-Bègles,0",
  "18d8107f,Stade Toulousain,0",
  "0de1f7d7,Angoulême,0",
].join("\r\n");

describe("parseRoundMatches", () => {
  const top14j5 = parseRoundMatches(fixture("top14-j5.html"));

  it("reads clubs and scores in home/away order", () => {
    assert.equal(top14j5.length, 7);
    assert.deepEqual(top14j5[0], {
      homeSlug: "bordeaux-begles",
      awaySlug: "lyon",
      score: [51, 28],
      homeOffensiveBonus: true,
      awayOffensiveBonus: false,
    });
  });

  it("ignores losing bonus markers", () => {
    const bayonneParis = top14j5.find((m) => m.homeSlug === "bayonne");
    assert.deepEqual(bayonneParis.score, [35, 32]);
    assert.equal(bayonneParis.homeOffensiveBonus, false);
    assert.equal(bayonneParis.awayOffensiveBonus, false);
  });

  it("detects an away offensive bonus", () => {
    const matches = parseRoundMatches(fixture("prod2-j6.html"));
    const narbonneOyonnax = matches.find((m) => m.homeSlug === "narbonne");
    assert.deepEqual(narbonneOyonnax.score, [14, 57]);
    assert.equal(narbonneOyonnax.homeOffensiveBonus, false);
    assert.equal(narbonneOyonnax.awayOffensiveBonus, true);
  });

  it("returns a null score for unplayed matches", () => {
    const matches = parseRoundMatches(fixture("top14-j6.html"));
    assert.equal(matches.length, 7);
    assert.ok(matches.every((m) => m.score === null));
  });
});

describe("parseCurrentRound / parseRoundNumber", () => {
  it("reads season, current round and match statuses", () => {
    const current = parseCurrentRound(fixture("prod2-j6.html"));
    assert.equal(current.season, "2026-2027");
    assert.equal(current.round, 6);
    assert.equal(current.statuses.get("montauban|brive"), "finished");
  });

  it("flags not started matches", () => {
    const current = parseCurrentRound(fixture("top14-j6.html"));
    assert.equal(current.statuses.get("paris|montpellier"), "not-started");
  });

  it("reads the round displayed by the page", () => {
    assert.equal(parseRoundNumber(fixture("top14-j5.html")), 5);
    assert.equal(parseRoundNumber(fixture("top14-j6.html")), 6);
  });
});

describe("createTeamResolver", () => {
  const resolve = createTeamResolver(TEAMS_CSV);

  it("maps slugs to team ids, including aliases and accents", () => {
    assert.equal(resolve("lyon"), "92a6f37f");
    assert.equal(resolve("paris"), "1aeebcc9");
    assert.equal(resolve("toulouse"), "18d8107f");
    assert.equal(resolve("bordeaux-begles"), "5cd94c08");
    assert.equal(resolve("angouleme"), "0de1f7d7");
  });

  it("throws on unknown clubs", () => {
    assert.throws(() => resolve("carcassonne"), /Unknown club "carcassonne"/);
  });
});

describe("toResult", () => {
  const resolve = createTeamResolver(TEAMS_CSV);
  const base = { homeSlug: "lyon", awaySlug: "paris" };

  it("keeps the bonus of the winner only", () => {
    const home = { ...base, score: [40, 10], homeOffensiveBonus: true, awayOffensiveBonus: false };
    const away = { ...base, score: [10, 40], homeOffensiveBonus: false, awayOffensiveBonus: true };
    const loser = { ...base, score: [20, 21], homeOffensiveBonus: true, awayOffensiveBonus: false };
    assert.equal(toResult(1, home, resolve).winnerOffensiveBonus, true);
    assert.equal(toResult(1, away, resolve).winnerOffensiveBonus, true);
    assert.equal(toResult(1, loser, resolve).winnerOffensiveBonus, false);
  });

  it("never gives a bonus on a draw", () => {
    const draw = { ...base, score: [22, 22], homeOffensiveBonus: true, awayOffensiveBonus: true };
    assert.equal(toResult(1, draw, resolve).winnerOffensiveBonus, false);
  });
});

describe("applyResults", () => {
  const csv = "1,a,b,0,0,FALSE\n1,c,d,0,0,FALSE\n2,b,a,0,0,FALSE\n";

  it("updates matching rows and keeps the file format", () => {
    const { csv: updated, changes } = applyResults(csv, [
      { day: 1, homeId: "c", awayId: "d", homeScore: 30, awayScore: 3, winnerOffensiveBonus: true },
    ]);
    assert.equal(updated, "1,a,b,0,0,FALSE\n1,c,d,30,3,TRUE\n2,b,a,0,0,FALSE\n");
    assert.equal(changes.length, 1);
  });

  it("is idempotent", () => {
    const result = { day: 2, homeId: "b", awayId: "a", homeScore: 12, awayScore: 9, winnerOffensiveBonus: false };
    const first = applyResults(csv, [result]).csv;
    const second = applyResults(first, [result]);
    assert.equal(second.csv, first);
    assert.equal(second.changes.length, 0);
  });

  it("throws when the match is not in the calendar", () => {
    assert.throws(
      () => applyResults(csv, [{ day: 3, homeId: "a", awayId: "b", homeScore: 1, awayScore: 0, winnerOffensiveBonus: false }]),
      /No calendar row for day 3/,
    );
  });

  it("finds the last regular season day", () => {
    assert.equal(maxCalendarDay(csv), 2);
  });
});
