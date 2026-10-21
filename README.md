# 💣 Minesweeple

**Wordle meets Minesweeper.** Five tiles on the board spell a secret word. Sweep for them with Minesweeper-style number clues, then guess the word.

**[Play it live →](https://YOUR-SITE.netlify.app)**

<!-- Replace with a short screen recording of a full round -->
![Gameplay](docs/gameplay.gif)

## How to play

1. Five of the 36 letter tiles are the **secret tiles**. Together they spell a 5-letter word, in scrambled order.
2. Tap a tile to **probe** it. The small number shows how many of its 8 neighbours are secret tiles.
   - 🟩 **Green:** this tile is one of the five secret tiles.
   - 🟨 **Yellow:** not secret, but a secret tile is next to it.
   - ⬛ **Gray:** not secret, and none are next to it.
3. Decoy tiles can repeat a letter from the word, so a yellow or gray tile's letter can still be in the answer.
4. You get **12 probes**. Then guess the word in **3 tries**, with the usual Wordle colours.
5. Guesses must be real words. A rejected guess doesn't cost a try.
6. Flag tiles you suspect (🚩 button, or right-click). Flags are free and unlimited.
7. A timer runs from the moment you press Play.

There is one **daily puzzle** that is the same for everyone. Finish it (win or lose) and you unlock **practice mode** with random words.

## Features

- Daily puzzle with no backend: everyone gets the same board each day
- Practice mode with random words, unlocked after the daily
- Your board, flags and guesses are saved, so refreshing or leaving the page doesn't lose progress, and you can come back to look at a finished board
- Dictionary-validated guesses (about 15,000 valid words)
- Wordle-accurate duplicate-letter scoring
- Light and dark themes (follows your system setting, remembers your choice)
- Responsive: collapsible tile-colour guide on phones, side panel on desktop

## Tech stack

- [React](https://react.dev/) + TypeScript, built with [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) for the daily (`/`) and practice (`/random`) routes
- [Bootstrap 5.3](https://getbootstrap.com/) via [React-Bootstrap](https://react-bootstrap.netlify.app/), using Bootstrap's built-in dark mode
- Deployed on [Netlify](https://www.netlify.com/)

## How it works

**Seeded daily puzzle, no server.** The local date (`YYYY-MM-DD`) is hashed into a seed for a small PRNG (mulberry32). That one seed picks the word, the positions of the five secret tiles, and the decoy letters, so any device generates an identical board for a given date without any backend.

**Neighbour clues.** For a tile at `(x, y)`, the game counts secret tiles among the 8 surrounding cells, bounds-checked, exactly as in classic Minesweeper. Clues are computed on reveal and never stored.

**Wordle scoring with repeated letters.** Guess scoring runs in two passes: greens first, then yellows against the remaining unmatched letters. This handles duplicates correctly (for example a guess with two E's against a word with one).

**Two word lists.** A small curated list of common words provides the answers. A much larger list is used only to accept or reject guesses, so obscure words are valid guesses but never answers. The answer list is frozen after launch, since the daily seed indexes into it.

**Persistence.** The daily board (probes in click order, flags, guesses, start time) is saved to `localStorage` on every change and restored on load if it belongs to today's date. Finished dailies are also recorded with a completion timestamp.

## Project structure

```
src/
  components/   AppNav, Landing, Game, Timer, Grid, GuessArea, Legend, Modal
  logic/        puzzle.ts (generation, seeding, neighbour counts)
                score.ts (guess scoring)
                dictionary.ts (guess validation)
                daily.ts (saved state and results)
                format.ts (time formatting)
  data/         words.json (answers), valid.json (valid guesses)
scripts/        fetch-answers.mjs, fetch-valid.mjs
public/         _redirects (SPA fallback for Netlify)
```

## Getting started

```bash
git clone https://github.com/YOUR-USERNAME/minesweeple.git
cd minesweeple
npm install
npm run dev
```

Other scripts:

```bash
npm run build      # type-check and production build
npm run preview    # serve the production build locally
```

To regenerate the word lists:

```bash
node scripts/fetch-answers.mjs   # writes src/data/words.json
node scripts/fetch-valid.mjs     # writes src/data/valid.json
```

> Don't change `words.json` after launch: it changes which word each day maps to.

## Deployment

The site is deployed on Netlify from this repo.

- Build command: `npm run build`
- Publish directory: `dist`
- `public/_redirects` contains `/* /index.html 200` so direct links to `/random` work

## Ideas for later

- Streaks and a stats screen
- Global leaderboard

## Credits

Inspired by [Wordle](https://www.nytimes.com/games/wordle/) and Minesweeper. Word lists come from [tabatkins/wordle-list](https://github.com/tabatkins/wordle-list) and [charlesreid1/five-letter-words](https://github.com/charlesreid1/five-letter-words).