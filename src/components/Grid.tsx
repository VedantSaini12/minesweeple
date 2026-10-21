import { Button } from 'react-bootstrap'
import { neighbourCount, SIZE } from '../logic/puzzle'

type Props = {
  letters: string[]
  targets: number[]
  revealed: Set<number>
  flags: Set<number>
  flagMode: boolean
  onProbe: (i: number) => void
  onFlag: (i: number) => void
}

export default function Grid({ letters, targets, revealed, flags, flagMode, onProbe, onFlag }: Props) {
  return (
    <div className="d-grid gap-2 mx-auto" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, maxWidth: 360 }}>
      {letters.map((ch, i) => {
        const rv = revealed.has(i)
        const flagged = flags.has(i)
        const n = neighbourCount(targets, i)
        const variant = rv
          ? targets.includes(i) ? 'success' : n > 0 ? 'warning' : 'secondary'
          : flagged ? 'outline-danger' : 'outline-secondary'
        return (
          <Button
            key={i}
            variant={variant}
            onClick={() => (flagMode ? onFlag(i) : onProbe(i))}
            onContextMenu={e => { e.preventDefault(); onFlag(i) }}   // right-click on desktop
            className="position-relative fw-bold fs-4 font-monospace p-0"
            style={{ aspectRatio: '1' }}
          >
            {ch}
            {rv && <small className="position-absolute bottom-0 end-0 me-1 fs-6">{n}</small>}
            {!rv && flagged && <small className="position-absolute top-0 start-0 ms-1 fs-6">🚩</small>}
          </Button>
        )
      })}
    </div>
  )
}