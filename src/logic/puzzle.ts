const WORDS = ['crane','flint','ghost','plumb','stork','brave','charm','drift','eagle','grape',
  'haste','ivory','lemon','mango','noble','ocean','pearl','quilt','raven','siren','tiger',
  'vivid','waltz','yacht','blaze','cloud','dance','ember','flame','glide','honey','laser']
const DECOYS = 'EEEEAAARRIIOOTTNNSSLLCUDPMHGBFYWKVXZJQ'
const SIZE = 6
const CELLS = SIZE * SIZE

export interface Puzzle { secret: string; letters: string[]; targets: number[] }

export function newPuzzle(): Puzzle {
  const secret = (WORDS as string[])[Math.floor(Math.random() * WORDS.length)].toUpperCase()
  const idx = [...Array(CELLS).keys()]
  for (let i = CELLS - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  const targets = idx.slice(0, 5)
  const letters = Array.from({ length: CELLS }, () => DECOYS[Math.floor(Math.random() * DECOYS.length)])
  targets.forEach((t, k) => (letters[t] = secret[k]))
  return { secret, letters, targets }
}

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

