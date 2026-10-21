import { Modal, Button } from 'react-bootstrap'

type Props = { show: boolean; won: boolean; time: string; secret: string; onPlayAgain: () => void; onClose: () => void }

export default function ResultModal({ show, won, time, secret, onPlayAgain, onClose }: Props) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{won ? 'You got it! 🎉' : 'Out of guesses'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {won ? <>Time taken: <strong>{time}</strong></> : <>The word was <strong>{secret}</strong>.</>}
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn btn-success' onClick={onPlayAgain}>▶️ Play again</Button>
      </Modal.Footer>
    </Modal>
  )
}