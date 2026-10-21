import { Button } from 'react-bootstrap'
import { neighbourCount } from '../logic/puzzle'

type Props = {
  letters: string[]
  targets: number[]
  revealed: Set<number>
  onProbe: (i: number) => void
}

export default function Grid({ letters, targets, revealed, onProbe }: Props) {
  return (
    <div className="d-grid gap-2 mx-auto" style={{ gridTemplateColumns: 'repeat(6, 1fr)', maxWidth: 360 }}>
      {letters.map((ch, i) => {
        const rv = revealed.has(i)
        const n = neighbourCount(targets, i)
        const variant = !rv ? 'outline-secondary' : targets.includes(i) ? 'success' : n > 0 ? 'warning' : 'secondary'
        return (
          <Button
            key={i}
            variant={variant}
            onClick={() => onProbe(i)}
            className="position-relative fw-bold fs-4 font-monospace p-0"
            style={{ aspectRatio: '1' }}
          >
            {ch}
            {rv && <small className="position-absolute bottom-0 end-0 me-1 fs-6">{n}</small>}
          </Button>
        )
      })}
    </div>
  )
}