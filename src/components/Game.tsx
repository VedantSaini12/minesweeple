/* eslint-disable react-hooks/purity */
import { useEffect, useState } from 'react'
import { Container, Badge, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Landing from './Landing'
import Timer from './Timer'
import Grid from './Grid'
import GuessArea from './GuessArea'
import ResultModal from './Modal'
import Legend, { LegendCompact } from './Legend'
import { newPuzzle, dailyPuzzle, todayKey, puzzleNumber, type Puzzle } from '../logic/puzzle'
import { score, type Guess } from '../logic/score'
import { formatTime } from '../logic/format'
import { loadSaved, saveGame, saveResult } from '../logic/daily'

const MAX_PROBES = 12
const MAX_GUESSES = 1
type Phase = 'idle' | 'playing' | 'won' | 'lost'
type Props = { mode: 'daily' | 'random'; theme: 'light' | 'dark'; onToggle: () => void }

export default function Game({ mode, theme, onToggle }: Props) {
  const daily = mode === 'daily'
  const today = todayKey()
  const navigate = useNavigate()

  const [saved] = useState(() => (daily ? loadSaved(today) : null))
  const [phase, setPhase] = useState<Phase>(() => saved?.phase ?? (daily ? 'idle' : 'playing'))
  const [puzzle, setPuzzle] = useState<Puzzle | null>(() =>
    saved ? dailyPuzzle(today) : daily ? null : newPuzzle()
  )
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set(saved?.revealed))
  const [flags, setFlags] = useState<Set<number>>(() => new Set(saved?.flags))
  const [guesses, setGuesses] = useState<Guess[]>(saved?.guesses ?? [])
  const [startTime, setStartTime] = useState(saved?.startTime ?? Date.now())
  const [finalTime, setFinalTime] = useState(saved?.finalTime ?? 0)
  const [flagMode, setFlagMode] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // keep the daily board saved so it survives refreshes and visits to /random
  useEffect(() => {
    if (!daily || !puzzle || phase === 'idle') return
    saveGame({ date: today, phase, revealed: [...revealed], flags: [...flags], guesses, startTime, finalTime })
  }, [daily, puzzle, phase, revealed, flags, guesses, startTime, finalTime, today])

  const start = () => {
    setPuzzle(daily ? dailyPuzzle(today) : newPuzzle())
    setRevealed(new Set())
    setFlags(new Set())
    setFlagMode(false)
    setGuesses([])
    setStartTime(Date.now())
    setFinalTime(0)
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
      if (daily) {
        saveResult({
          date: today,
          puzzleNo: puzzleNumber(today),
          won,
          timeMs: ms,
          guesses: next.length,
          finishedAt: new Date().toISOString(),
        })
      }
    }
  }

  const playing = phase === 'playing'
  const playAgain = daily ? () => navigate('/random') : start
  const againLabel = daily ? 'Practice a random word' : 'Play again'

  return (
    <Container className="py-3">
      {phase === 'idle' && (
        <Landing theme={theme} onToggle={onToggle} onPlay={start} puzzleNo={puzzleNumber(today)} />
      )}

      {phase !== 'idle' && puzzle && (
        <>
          <div className="text-center font-monospace small text-body-secondary mb-2">
            {daily ? `Daily #${puzzleNumber(today)} · ${today}` : 'Random word'}
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
              <Button variant="outline-secondary" size="sm" onClick={onToggle} aria-label="Toggle theme">
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
                <span className="text-body-secondary">Flags: {flags.size}</span>
              </div>
              <GuessArea guesses={guesses} maxGuesses={MAX_GUESSES} disabled={!playing} onGuess={guess} />
            </div>
            <Legend />
          </div>

          {!playing && (
            <div className="text-center mt-4">
              <Button onClick={playAgain}>{againLabel}</Button>
            </div>
          )}
        </>
      )}

      <ResultModal
        show={showModal}
        won={phase === 'won'}
        time={formatTime(finalTime)}
        secret={puzzle?.secret ?? ''}
        playAgainLabel={againLabel}
        onPlayAgain={playAgain}
        onClose={() => setShowModal(false)}
      />
    </Container>
  )
}