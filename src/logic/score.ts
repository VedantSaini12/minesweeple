export type Mark = 'g' | 'y' | 'z'
export interface Guess { word: string; result: Mark[] }

export function score(guess: string, secret: string): Mark[] {
  const result: Mark[] = Array(5).fill('z')
  const left: Record<string, number> = {}
  for (let i = 0; i < 5; i++) {
    if (guess[i] === secret[i]) result[i] = 'g'
    else left[secret[i]] = (left[secret[i]] ?? 0) + 1
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] !== 'g' && (left[guess[i]] ?? 0) > 0) {
      result[i] = 'y'
      left[guess[i]]--
    }
  }
  return result
}