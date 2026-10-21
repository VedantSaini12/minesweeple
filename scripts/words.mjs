import { writeFileSync, mkdirSync } from 'node:fs'

const res = await fetch('https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt')
const all = (await res.text())
  .split('\n')
  .map(w => w.trim())
  .filter(w => /^[a-z]{5}$/.test(w))
  
const answers = all.slice(150, 1650)

mkdirSync('src/data', { recursive: true })
writeFileSync('src/data/words.json', JSON.stringify(answers))
console.log(answers.length, 'answers saved')