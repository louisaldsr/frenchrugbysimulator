# French Rugby Simulator

**Predict the rest of the TOP 14 and PRO D2 seasons and see where every club finishes.**

🏉 **Live app: [frenchrugbysimulator.com](https://frenchrugbysimulator.com/)**

French Rugby Simulator is a web app for the two French professional rugby leagues, **TOP 14** and **PRO D2**. It loads the real fixtures and results of the current season. You enter scores for the matches still to be played, and the standings update instantly using the official league rules. You can then play out the finals bracket up to the champion.

---

## Features

- **Real season data.** Fixtures and results of the current season. Results are updated automatically from the official league website (see [Automated results](#automated-results)).
- **Score predictions.** Enter a score for any upcoming match, matchday by matchday, and toggle the winner's offensive bonus.
- **Live standings** computed with the official LNR rules:
  - 4 points for a win, 2 for a draw, 0 for a loss.
  - +1 offensive bonus for scoring 3 more tries than the opponent.
  - +1 defensive bonus for losing by 5 points or fewer.
  - Tie-breakers: head-to-head results, then overall points difference, then head-to-head points difference, then points scored.
- **Qualification and relegation zones** highlighted in the table: semi-final spots, play-off spots, relegation play-off, relegation.
- **Finals bracket.** The play-offs (3rd vs 6th, 4th vs 5th), semi-finals and final are generated from your final standings. Pick the winners to crown a champion, with a confetti celebration 🎉.
- **Saved in your browser.** Predictions persist between visits. When a real result comes in, it replaces your prediction for that match only.
- **Reset** a single matchday or the whole simulation at any time.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions, Turbopack) |
| UI | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), [Framer Motion](https://www.framer.com/motion/), [Lucide](https://lucide.dev) icons |
| Language | TypeScript (strict) |
| State management | [Zustand](https://zustand.docs.pmnd.rs) with `persist` middleware (localStorage) |
| Data | CSV files versioned in the repository (`public/data`) |
| Automation | GitHub Actions + a dependency-free Node.js scraper |
| Hosting | [Vercel](https://vercel.com), redeployed on every push to `main` |
| Quality | ESLint (`eslint-config-next`), Node's built-in test runner |

## How it works

```
 lnr.fr ──(GitHub Action, daily)──▶ public/data/*/calendar.csv ──▶ git push ──▶ Vercel deploy
                                                                                   │
                                                                                   ▼
                    Browser ◀── Zustand store (persisted) ◀── Server Action loads the CSVs
                       │
                       └─ score input ─▶ ranking engine ─▶ standings ─▶ finals bracket
```

1. **Data layer.** Each competition has a `teams.csv` and a `calendar.csv`. A Server Action ([`game-competition-store-loader.ts`](src/actions/game-competition-store-loader.ts)) parses them into typed `Team` and `Match` objects.
2. **State.** The data is passed to a Zustand store ([`GameStore.tsx`](src/context/GameStore.tsx)) persisted in localStorage. On each visit, the fresh calendar is merged with the saved one ([`refresh-calendar.ts`](src/helpers/calendar/refresh-calendar.ts)): real results take priority, and predictions are kept for matches not yet played.
3. **Ranking engine.** Pure TypeScript functions in [`src/helpers/ranking`](src/helpers/ranking) compute each team's record, points and bonuses, then sort the table with the official tie-breaker rules.
4. **Finals.** [`compute-finals.ts`](src/helpers/finals/compute-finals.ts) builds the bracket from the final standings.

### Automated results

A scheduled GitHub Action ([`sync-results.yml`](.github/workflows/sync-results.yml)) runs every day and on Sunday nights. It runs [`scripts/sync-results.mjs`](scripts/sync-results.mjs), which:

- reads each matchday page from the official LNR websites ([top14.lnr.fr](https://top14.lnr.fr), [prod2.lnr.fr](https://prod2.lnr.fr));
- extracts scores and offensive bonuses, skipping matches that are still being played;
- maps clubs to their IDs and updates `calendar.csv` in place;
- commits the changes only if something changed, which triggers a new Vercel deployment.

The script fails loudly (unknown club, unexpected page layout, missing fixture) instead of writing bad data. Its parser is covered by tests against saved copies of real pages.

## Project structure

```
src/
├── app/                # Next.js routes: home, /[competition], /[competition]/finals
├── actions/            # Server Actions (data loading, finals refresh)
├── components/         # UI: calendar, match, ranking, finals, competitions
├── context/            # Zustand game store
├── helpers/            # Pure logic: CSV loaders, ranking engine, finals, calendar merge
├── types/              # Domain types (Match, Team, TeamRanking, Finals…)
└── constants.ts        # Points rules, qualification and relegation positions
public/
├── data/{top14,prod2}/ # teams.csv and calendar.csv
└── team-logos/         # SVG club logos
scripts/                # Results scraper and its tests
.github/workflows/      # Scheduled results sync
```

## Getting started

Requires **Node.js 22+**.

```bash
git clone https://github.com/louisaldsr/frenchrugbysimulator.git
cd frenchrugbysimulator
npm install
VERCEL_ENV=local npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). `VERCEL_ENV=local` makes the app read the CSV files from the local server instead of the Vercel deployment URL.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | Lint the codebase |
| `npm run sync-results` | Fetch the latest results from lnr.fr into the CSV files |
| `npm run test:sync` | Run the results scraper tests |

## Data format

`teams.csv`: `id,name,initialPoints`. `initialPoints` holds any points deduction applied by the league.

`calendar.csv` (no header):

```
day,homeTeamId,awayTeamId,homeScore,awayScore,winnerOffensiveBonus
5,5cd94c08-…,92a6f37f-…,51,28,TRUE
6,660f5313-…,c1deb729-…,0,0,FALSE      ← not played yet
```

## License

[MIT](LICENSE) © louisaldsr
