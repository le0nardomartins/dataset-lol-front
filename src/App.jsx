import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Champions from './pages/Champions'
import ChampionsTable from './pages/ChampionsTable'
import Rankings from './pages/Rankings'
import Stats from './pages/Stats'
import LoadingScreen from './components/LoadingScreen'
import './App.css'

function App() {
  const [initialLoading, setInitialLoading] = useState(true)
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    // Tela de carregamento inicial de 3 segundos
    // Após 2.5s inicia o fade out, após 3s remove completamente
    const fadeOutTimer = setTimeout(() => {
      setFadingOut(true)
    }, 2500)

    const hideTimer = setTimeout(() => {
      setInitialLoading(false)
    }, 3000)

    return () => {
      clearTimeout(fadeOutTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  return (
    <>
      {initialLoading && (
        <div className={fadingOut ? 'loading-screen fading-out' : 'loading-screen'}>
          <LoadingScreen message="Carregando dashboard..." />
        </div>
      )}
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className={`app ${!initialLoading ? 'fading-in' : ''}`}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/champions" element={<Champions />} />
            <Route path="/champions-table" element={<ChampionsTable />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App

