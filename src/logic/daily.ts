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