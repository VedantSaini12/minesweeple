import { useEffect, useState } from 'react'
import { Container, Badge, Button } from 'react-bootstrap'
import AppNav from './components/AppNav'
import Landing from './components/Landing'
import Timer from './components/Timer'
import Grid from './components/Grid'
import GuessArea from './components/GuessArea'
import { newPuzzle, type Puzzle } from './logic/puzzle'
import { score, type Guess } from './logic/score'
import { formatTime } from './logic/format'

const MAX_PROBES = 12
const MAX_GUESSES = 3
type Phase = 'idle' | 'playing' | 'won' | 'lost'
type Theme = 'light' | 'dark'

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  const [phase, setPhase] = useState<Phase>('idle')
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [startTime, setStartTime] = useState(0)
  const [finalTime, setFinalTime] = useState(0)

  const start = () => {
    setPuzzle(newPuzzle())
    setRevealed(new Set())
    setGuesses([])
    setStartTime(Date.now())
    setPhase('playing')
  }

  const probe = (i: number) => {
    if (phase !== 'playing' || revealed.has(i) || revealed.size >= MAX_PROBES) return
    setRevealed(new Set(revealed).add(i))
  }

  const guess = (word: string) => {
    if (!puzzle || phase !== 'playing') return
    const next = [...guesses, { word, result: score(word, puzzle.secret) }]
    setGuesses(next)
    const won = word === puzzle.secret
    if (won || next.length >= MAX_GUESSES) {
      setFinalTime(Date.now() - startTime)
      setPhase(won ? 'won' : 'lost')
    }
  }

  const playing = phase === 'playing'

  return (
    <>
      <AppNav />
      <Container className="py-3">
        {phase === 'idle' && <Landing theme={theme} onToggle={toggleTheme} onPlay={start} />}

        {phase !== 'idle' && puzzle && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              {playing ? (
                <Timer startTime={startTime} />
              ) : (
                <Badge bg="secondary" className="fs-6 font-monospace">
                  ⏱ {formatTime(finalTime)}
                </Badge>
              )}
              <div className="d-flex align-items-center gap-3">
                <span className="text-body-secondary font-monospace">
                  Probes left: {MAX_PROBES - revealed.size}
                </span>
                <Button variant="outline-secondary" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === 'light' ? '🌙' : '☀️'}
                </Button>
              </div>
            </div>

            <Grid letters={puzzle.letters} targets={puzzle.targets} revealed={revealed} onProbe={probe} />
            <GuessArea guesses={guesses} maxGuesses={MAX_GUESSES} disabled={!playing} onGuess={guess} />

            {!playing && (
              <div className="text-center mt-4">
                <Button onClick={start}>Play again</Button>
              </div>
            )}
          </>
        )}

      </Container>
    </>
  )
}