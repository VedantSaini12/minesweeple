/* eslint-disable react-hooks/purity */
import { useEffect, useState } from 'react'
import { Badge } from 'react-bootstrap'
import { formatTime } from '../logic/format'

export default function Timer({ startTime }: { startTime: number }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [])
  return <Badge bg="secondary" className="fs-6 font-monospace">⏱ {formatTime(now - startTime)}</Badge>
}