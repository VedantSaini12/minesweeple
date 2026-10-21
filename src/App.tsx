import { useEffect, useState } from 'react'
import { Container, Badge, Button } from 'react-bootstrap'
import AppNav from './components/AppNav'
import Landing from './components/Landing'
import Timer from './components/Timer'
import Grid from './components/Grid'
import GuessArea from './components/GuessArea'
import ResultModal from './components/Modal'
import Legend, { LegendCompact } from './components/Legend'
import { newPuzzle, dailyPuzzle, todayKey, puzzleNumber, type Puzzle } from './logic/puzzle'
import { score, type Guess } from './logic/score'
import { formatTime } from './logic/format'
import { loadHistory, saveResult, type DailyResult } from './logic/daily'

const MAX_PROBES = 10
const MAX_GUESSES = 3
type Phase = 'idle' | 'playing' | 'won' | 'lost'
type Mode = 'daily' | 'practice'
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
  const [mode, setMode] = useState<Mode>('daily')
  const [playDate, setPlayDate] = useState(todayKey())
  const [history, setHistory] = useState<Record<string, DailyResult>>(loadHistory)
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [flags, setFlags] = useState<Set<number>>(new Set())
  const [flagMode, setFlagMode] = useState(false)
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [startTime, setStartTime] = useState(0)
  const [finalTime, setFinalTime] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const today = todayKey()
  const todayResult = history[today] ?? null

  const start = (m: Mode) => {
    if (m === 'daily' && history[today]) return          // one daily attempt per date
    setMode(m)
    setPlayDate(today)
    setPuzzle(m === 'daily' ? dailyPuzzle(today) : newPuzzle())
    setRevealed(new Set())
    setFlags(new Set())
    setFlagMode(false)
    setGuesses([])
    setStartTime(Date.now())
    setShowModal(false)
    setPhase('playing')
  }

  const probe = (i: number) => {
    if (phase !== 'playing' || revealed.has(i) || revealed.size >= MAX_PROBES) return
    setRevealed(new Set(revealed).add(i))
    setFlags(prev => {
      const next = new Set(prev)
      next.delete(i)
      return next
    })
  }

  const toggleFlag = (i: number) => {
    if (phase !== 'playing' || revealed.has(i)) return
    setFlags(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const guess = (word: string) => {
    if (!puzzle || phase !== 'playing') return
    const next = [...guesses, { word, result: score(word, puzzle.secret) }]
    setGuesses(next)
    const won = word === puzzle.secret
    if (won || next.length >= MAX_GUESSES) {
      const ms = Date.now() - startTime
      setFinalTime(ms)
      setPhase(won ? 'won' : 'lost')
      setShowModal(true)
      if (mode === 'daily') {
        const r: DailyResult = {
          date: playDate,
          puzzleNo: puzzleNumber(playDate),
          won,
          timeMs: ms,
          guesses: next.length,
          finishedAt: new Date().toISOString(),
        }
        saveResult(r)
        setHistory(h => ({ ...h, [playDate]: r }))
      }
    }
  }

  const playing = phase === 'playing'

  return (
    <>
      <AppNav />
      <Container className="py-3">
        {phase === 'idle' && (
          <Landing
            theme={theme}
            onToggle={toggleTheme}
            onPlay={start}
            todayResult={todayResult}
            puzzleNo={puzzleNumber(today)}
          />
        )}

        {phase !== 'idle' && puzzle && (
          <>
            <div className="text-center font-monospace small text-body-secondary mb-2">
              {mode === 'daily' ? `Daily #${puzzleNumber(playDate)} · ${playDate}` : 'Practice round'}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              {playing ? (
                <Timer startTime={startTime} />
              ) : (
                <Badge bg="secondary" className="fs-6 font-monospace">⏱ {formatTime(finalTime)}</Badge>
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

            <div className="d-flex justify-content-center align-items-start gap-4">
              <div style={{ flex: '0 1 420px', width: '100%' }}>
                <LegendCompact />
                <Grid
                  letters={puzzle.letters}
                  targets={puzzle.targets}
                  revealed={revealed}
                  flags={flags}
                  flagMode={flagMode}
                  onProbe={probe}
                  onFlag={toggleFlag}
                />
                <div className="d-flex justify-content-center align-items-center gap-3 mt-3 font-monospace">
                  <Button
                    size="sm"
                    variant={flagMode ? 'danger' : 'outline-danger'}
                    disabled={!playing}
                    onClick={() => setFlagMode(f => !f)}
                  >
                    🚩 Flag mode: {flagMode ? 'on' : 'off'}
                  </Button>
                </div>
                <GuessArea guesses={guesses} maxGuesses={MAX_GUESSES} disabled={!playing} onGuess={guess} />
              </div>
              <Legend />
            </div>

            {!playing && (
              <div className="text-center mt-4">
                <Button onClick={() => start('practice')}>Play a practice round</Button>
              </div>
            )}
          </>
        )}

        <ResultModal
          show={showModal}
          won={phase === 'won'}
          time={formatTime(finalTime)}
          secret={puzzle?.secret ?? ''}
          onPlayAgain={() => start('practice')}
          onClose={() => setShowModal(false)}
        />
      </Container>
    </>
  )
}