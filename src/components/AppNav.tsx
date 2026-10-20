import { Navbar, Container} from 'react-bootstrap'

export default function AppNav() {
  return (
    <Navbar className="bg-body-tertiary border-bottom py-3">
  <Container className="justify-content-center">
    <Navbar.Brand className="fw-bold font-monospace fs-2 mb-0">
      MINESWEEPLE
    </Navbar.Brand>
  </Container>
</Navbar>
  )
}