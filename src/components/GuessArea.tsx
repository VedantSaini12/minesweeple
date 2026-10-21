import { useState } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import type { Guess, Mark } from '../logic/score'

const BG: Record<Mark, string> = { g: 'bg-success', y: 'bg-warning', z: 'bg-secondary' }

type Props = { guesses: Guess[]; maxGuesses: number; disabled: boolean; onGuess: (w: string) => void }

export default function GuessArea({ guesses, maxGuesses, disabled, onGuess }: Props) {
  const [value, setValue] = useState('')
  const submit = () => {
    if (!/^[A-Za-z]{5}$/.test(value)) return
    onGuess(value.toUpperCase())
    setValue('')
  }
  return (
    <div className="mx-auto mt-4 font-monospace" style={{ maxWidth: 360 }}>
      {guesses.map((g, r) => (
        <div key={r} className="d-flex gap-2 mb-2">
          {[...g.word].map((ch, k) => (
            <div key={k} className={`flex-fill text-center text-white fw-bold fs-4 rounded py-1 ${BG[g.result[k]]}`}>
              {ch}
            </div>
          ))}
        </div>
      ))}
      <InputGroup>
        <Form.Control
          value={value}
          maxLength={5}
          disabled={disabled}
          placeholder="5-letter guess"
          onChange={e => setValue(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
        <Button className='btn btn-success' onClick={submit} disabled={disabled}>Guess</Button>
      </InputGroup>
      <div className="text-body-secondary small mt-1">{maxGuesses - guesses.length} guesses left</div>
    </div>
  )
}