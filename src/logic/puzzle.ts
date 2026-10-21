import WORDS from '../data/words.json'

export const SIZE = 6
const CELLS = SIZE * SIZE
const DECOYS = 'EEEEAAARRIIOOTTNNSSLLCUDPMHGBFYWKVXZJQ'
const LAUNCH = '2026-10-21'

export interface Puzzle { secret: string; letters: string[]; targets: number[] }

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

export const todayKey = (d = new Date()) => d.toLocaleDateString('en-CA') // YYYY-MM-DD, local time

export const puzzleNumber = (key: string) =>
  Math.floor((Date.parse(key) - Date.parse(LAUNCH)) / 864e5) + 1

export function newPuzzle(seed?: number): Puzzle {
  const r = seed === undefined ? Math.random : mulberry32(seed)
  const secret = (WORDS as string[])[Math.floor(r() * WORDS.length)].toUpperCase()
  const idx = [...Array(CELLS).keys()]
  for (let i = CELLS - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  const targets = idx.slice(0, 5)
  const letters = Array.from({ length: CELLS }, () => DECOYS[Math.floor(r() * DECOYS.length)])
  targets.forEach((t, k) => (letters[t] = secret[k]))
  return { secret, letters, targets }
}

export const dailyPuzzle = (key: string) => newPuzzle(hash('minesweeple-' + key))

export function neighbourCount(targets: number[], i: number): number {
  const x = i % SIZE, y = Math.floor(i / SIZE)
  let c = 0
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue
      const a = x + dx, b = y + dy
      if (a >= 0 && a < SIZE && b >= 0 && b < SIZE && targets.includes(b * SIZE + a)) c++
    }
  return c
}