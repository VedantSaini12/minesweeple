import { formatTime } from '../logic/format'
import type { DailyResult } from '../logic/daily'
import { Button, Card, Container } from 'react-bootstrap'

type Props = {
  theme: 'light' | 'dark'
  onToggle: () => void
  onPlay: (mode: 'daily' | 'practice') => void
  todayResult: DailyResult | null
  puzzleNo: number
}
export default function Landing({ theme, onToggle, onPlay, todayResult, puzzleNo }: Props) {
  return (
    <Container className="py-4 font-monospace">
      {/* Theme button in the top-left */}
      <div className='position-relative text-center' >
      <Button
        className="position-absolute top-0 start-0"
        variant="outline-secondary"
        size="lg"
        onClick={onToggle}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </Button>

      {/* Play button centered */}
      
      <div className="mt-4 d-flex flex-column align-items-center gap-2">
  <Button
    className="font-monospace play-button"
    variant="success"
    size="lg"
    disabled={!!todayResult}
    onClick={() => onPlay('daily')}
  >
    {todayResult
      ? `${todayResult.won ? '✅' : '❌'} Daily #${puzzleNo} done · ${formatTime(todayResult.timeMs)}`
      : `▶️ Play daily #${puzzleNo}`}
  </Button>
  <Button variant="outline-secondary" className="font-monospace" onClick={() => onPlay('practice')}>
    Practice (random word)
  </Button>
</div>


      <Card
        className="how-to-play mx-auto mt-4 text-start"
        style={{ maxWidth: 520 }}
      >
        <Card.Header as="h5">How to play</Card.Header>
        <Card.Body>
          <ol className="mb-0">
            <li>Five of the 36 tiles spell a secret word, in scrambled order.</li>
            <li>
              Tap a tile to probe it. The number shows how many of its 8
              neighbours are secret letters.<br></br>
              🟩 ⟶ This tile is one of the five secret tiles <br />
              🟨 ⟶ Not a secret tile, but some neighbours are. The letter can <b>STILL</b> be part of the Wordle<br />
              ⬛ ⟶ Not a secret tile, and none are next to it
            </li>
            <li>Flag tiles you think are secret (🚩 button, or right-click).</li>
            <li>
              You have 10 probes. Then guess the word in 3 tries, the usual Wordle style.
            </li>
            <li>The clock starts when you press Play.</li>
          </ol>
          <br />
          <h3 className='text-center'> Good Luck! </h3>
        </Card.Body>
      </Card>

      </div>
      {/* How to play centered underneath */}
      </Container>
  )
}
