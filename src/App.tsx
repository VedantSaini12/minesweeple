import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppNav from './components/AppNav'
import Game from './components/Game'
import { isDailyDone } from './logic/daily'
import { todayKey } from './logic/puzzle'

type Theme = 'light' | 'dark'

function RandomRoute({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return isDailyDone(todayKey())
    ? <Game mode="random" theme={theme} onToggle={onToggle} />
    : <Navigate to="/" replace />
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  return (
    <>
      <AppNav />
      <Routes>
        <Route path="/" element={<Game key="daily" mode="daily" theme={theme} onToggle={toggleTheme} />} />
        <Route path="/random" element={<RandomRoute theme={theme} onToggle={toggleTheme} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}