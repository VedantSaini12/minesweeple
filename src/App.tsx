import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import AppNav from './components/AppNav'
import Landing from './components/Landing'
import './App.css'

function App() {

  return (
    <div id='root'>
      <AppNav />
      <Landing theme='dark' onPlay={() => {}} onToggle={() => {}}/>
    </div>
  )
}

export default App
