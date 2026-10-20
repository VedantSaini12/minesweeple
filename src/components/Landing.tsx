
import { Button, Card, Container } from 'react-bootstrap'

type Props = {
  theme: 'light' | 'dark'
  onToggle: () => void
  onPlay: () => void
}

export default function Landing({ theme, onToggle, onPlay }: Props) {
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
      
<div className="mt-4">
  <Button
    className="font-monospace play-button"
    variant="success"
    size="lg"
    onClick={onPlay}
  >
    ▶️ Play now 
  </Button>
</div>


      <Card
        className="how-to-play mx-auto mt-4 text-start"
        style={{ maxWidth: 520 }}
      >
        <Card.Header as="h5">How to play</Card.Header>
        <Card.Body>
          <ol className="mb-0">
            <li>Five of the 25 letters spell a secret word, in scrambled order.</li>
            <li>
              Tap a tile to probe it. The number shows how many of its 8
              neighbours are secret letters.<br></br>
              🟩 ⟶ Wordle contains the letter <br></br>
              🟨 ⟶ A neighbour contains a wordle letter <br></br>
              ⬛ ⟶ No neighbours nor itself is part of the wordle
            </li>
            <li>
              You have 10 probes. Then guess the word in 3 tries, the usual Worlde style.
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
