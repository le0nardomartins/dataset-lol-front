import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Champions from './pages/Champions'
import ChampionsTable from './pages/ChampionsTable'
import Matches from './pages/Matches'
import Rankings from './pages/Rankings'
import Stats from './pages/Stats'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/champions" element={<Champions />} />
          <Route path="/champions-table" element={<ChampionsTable />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

