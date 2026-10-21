import { useState } from 'react'
import { Card, Collapse, Button } from 'react-bootstrap'

const ITEMS = [
  {
    bg: 'bg-success',
    name: 'Green',
    short: 'Secret tile',
    text: 'This tile is one of the five secret tiles.',
  },
  {
    bg: 'bg-warning',
    name: 'Yellow',
    short: 'Next to one',
    text: 'This tile is not secret, but a secret tile is next to it. Its letter could still be in the word.',
  },
  {
    bg: 'bg-secondary',
    name: 'Gray',
    short: 'None near',
    text: 'This tile is not secret and none of its neighbours are. Its letter could still be in the word.',
  },
]

const NUMBER_NOTE = 'The small number is how many of the 8 surrounding tiles are secret tiles.'

function Details() {
  return (
    <div className="d-flex flex-column gap-3">
      {ITEMS.map(it => (
        <div key={it.name} className="d-flex gap-2">
          <span className={`rounded flex-shrink-0 ${it.bg}`} style={{ width: 20, height: 20 }} />
          <div>
            <strong>{it.name}</strong>
            <div>{it.text}</div>
          </div>
        </div>
      ))}
      <div className="border-top pt-2">{NUMBER_NOTE}</div>
    </div>
  )
}

export default function Legend() {
  return (
    <Card className="d-none d-md-block font-monospace small" style={{ flex: '1 1 220px', maxWidth: 280 }}>
      <Card.Header className="fw-bold">Tile colours</Card.Header>
      <Card.Body>
        <Details />
      </Card.Body>
    </Card>
  )
}

/* Phone: one-line strip above the grid, tap ? for the full text */
export function LegendCompact() {
  const [open, setOpen] = useState(true)
  return (
    <div className="d-md-none mb-3 font-monospace small">
      <div className="position-relative">
        <div className="d-flex flex-wrap justify-content-center column-gap-3 row-gap-1 px-5">
          {ITEMS.map(it => (
            <span key={it.name} className="d-flex align-items-center gap-1">
              <span className={`rounded ${it.bg}`} style={{ width: 14, height: 14 }} />
              {it.short}
            </span>
          ))}
        </div>
        <Button
          variant="outline-secondary"
          size="sm"
          className="position-absolute top-50 end-0 translate-middle-y"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-label="Explain tile colours"
        >
          ?
        </Button>
      </div>
      <Collapse in={open}>
        <div>
          <div className="border rounded p-3 mt-2 bg-body-tertiary">
            <Details />
          </div>
        </div>
      </Collapse>
    </div>
  )
}