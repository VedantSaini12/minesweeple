import type { Guess } from './score'
export interface DailyResult {
  date: string        // YYYY-MM-DD the puzzle belongs to
  puzzleNo: number
  won: boolean
  timeMs: number
  guesses: number
  finishedAt: string  // ISO timestamp of completion
}

const KEY = 'minesweeple-history'

export function loadHistory(): Record<string, DailyResult> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') } catch { return {} }
}

export function saveResult(r: DailyResult) {
  try {
    const h = loadHistory()
    h[r.date] = r
    localStorage.setItem(KEY, JSON.stringify(h))
  } catch { /* storage unavailable, ignore */ }
}

export interface SavedGame {
  date: string
  phase: 'playing' | 'won' | 'lost'
  revealed: number[]   // in click order
  flags: number[]
  guesses: Guess[]
  startTime: number
  finalTime: number
}

const GKEY = 'minesweeple-daily-state'

export function loadSaved(date: string): SavedGame | null {
  try {
    const s = JSON.parse(localStorage.getItem(GKEY) ?? 'null') as SavedGame | null
    return s && s.date === date ? s : null
  } catch { return null }
}

export function saveGame(s: SavedGame) {
  try { localStorage.setItem(GKEY, JSON.stringify(s)) } catch { /* ignore */ }
}

export const isDailyDone = (date: string) => {
  const s = loadSaved(date)
  return s?.phase === 'won' || s?.phase === 'lost'
}