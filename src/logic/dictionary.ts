import valid from '../data/valid.json'
import answers from '../data/words.json'

// answers are always valid guesses too, so the secret word can never be rejected
const VALID = new Set<string>([...(valid as string[]), ...(answers as string[])])

export const isValidWord = (w: string) => VALID.has(w.toLowerCase())