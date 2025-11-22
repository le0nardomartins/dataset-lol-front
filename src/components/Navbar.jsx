import { Link, useLocation } from 'react-router-dom'
import { Home, Trophy, BarChart3, Users, TrendingUp, Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import './Navbar.css'

function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/logo.png" alt="LoL Dashboard" className="logo-image" />
          <span className="logo-text">LoL Dashboard</span>
        </div>
        
        <ul className="navbar-menu">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <Home size={18} />
              <span className="nav-text">Início</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/champions" 
              className={`nav-link ${isActive('/champions') ? 'active' : ''}`}
            >
              <Users size={18} />
              <span className="nav-text">Campeões</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/champions-table" 
              className={`nav-link ${isActive('/champions-table') ? 'active' : ''}`}
            >
              <Users size={18} />
              <span className="nav-text">Tabela Completa</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/matches" 
              className={`nav-link ${isActive('/matches') ? 'active' : ''}`}
            >
              <Trophy size={18} />
              <span className="nav-text">Partidas</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/rankings" 
              className={`nav-link ${isActive('/rankings') ? 'active' : ''}`}
            >
              <TrendingUp size={18} />
              <span className="nav-text">Rankings</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/stats" 
              className={`nav-link ${isActive('/stats') ? 'active' : ''}`}
            >
              <BarChart3 size={18} />
              <span className="nav-text">Estatísticas</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Alternar tema claro/escuro"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </li>
        </ul>
      </div>
      <div className="navbar-glow"></div>
    </nav>
  )
}

export default Navbar
