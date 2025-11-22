import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Calendar, Filter, Download } from 'lucide-react'
import { api } from '../services/api'
import LoadingScreen from '../components/LoadingScreen'
import './style/Matches.css'

function Matches() {
  const [matches, setMatches] = useState([])
  const [championFilter, setChampionFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)

  // Função auxiliar para verificar se uma partida foi vitória
  const isWin = (match) => {
    if (!match || match.win === undefined || match.win === null) return false
    
    // Verificar explicitamente valores falsos primeiro
    if (match.win === false || 
        match.win === 0 || 
        match.win === 'false' || 
        match.win === '0' ||
        (typeof match.win === 'string' && match.win.toLowerCase() === 'false')) {
      return false
    }
    
    // Verificar valores verdadeiros
    return match.win === true || 
           match.win === 1 || 
           match.win === 'true' || 
           match.win === '1' ||
           (typeof match.win === 'string' && match.win.toLowerCase() === 'true')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {}
        if (championFilter) params.champion = championFilter
        if (roleFilter) params.role = roleFilter
        params.limit = 100

        const data = await api.getMatches(params)
        // Garantir que data seja um array e filtrar matches inválidos
        const validMatches = Array.isArray(data) 
          ? data.filter(m => m && m.champion && m.hasOwnProperty('win'))
          : []
        
        // Debug: verificar alguns valores de win
        if (validMatches.length > 0) {
          const sampleWins = validMatches.slice(0, 5).map(m => ({ 
            champion: m.champion, 
            win: m.win, 
            winType: typeof m.win 
          }))
          console.log('Sample matches win values:', sampleWins)
        }
        
        setMatches(validMatches)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setMatches([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [championFilter, roleFilter])

  const winRateByChampion = matches.reduce((acc, match) => {
    // Verificar se match tem champion válido
    if (!match || !match.champion) return acc
    
    const champion = match.champion
    if (!acc[champion]) {
      acc[champion] = { wins: 0, total: 0 }
    }
    
    acc[champion].total++
    
    if (isWin(match)) {
      acc[champion].wins++
    }
    
    return acc
  }, {})

  const winRateData = Object.entries(winRateByChampion)
    .filter(([champion, data]) => data.total > 0 && data.wins >= 0) // Filtrar campeões com pelo menos 1 partida
    .map(([champion, data]) => {
      // Garantir que wins não seja maior que total
      const wins = Math.min(data.wins, data.total)
      const winRate = data.total > 0 ? (wins / data.total) * 100 : 0
      
      // Validar que winRate está entre 0 e 100
      const validWinRate = Math.max(0, Math.min(100, winRate))
      
      return {
        champion,
        winRate: Number(validWinRate.toFixed(2)), // Arredondar para 2 casas decimais
        games: data.total,
        wins: wins
      }
    })
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 15)

  const goldDistribution = matches
    .filter(m => m.gold_14 != null && !isNaN(Number(m.gold_14)))
    .map(m => {
      const gold = Number(m.gold_14)
      return {
        range: Math.floor(gold / 500) * 500,
        value: gold
      }
    })
    .reduce((acc, item) => {
      const key = `${item.range}-${item.range + 500}`
      if (!acc[key]) acc[key] = 0
      acc[key]++
      return acc
    }, {})

  const goldData = Object.entries(goldDistribution)
    .map(([range, count]) => ({
      range: range.split('-')[0],
      count
    }))
    .sort((a, b) => parseInt(a.range) - parseInt(b.range))

  if (loading) {
    return <LoadingScreen message="Carregando dados das partidas..." />
  }

  return (
    <div className="matches-page">
      <div className="matches-content">
        <div className="page-header">
          <h1 className="page-title">Análise de Partidas</h1>
          <p className="page-subtitle">Estatísticas e distribuições de partidas</p>
        </div>

        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Filtrar por campeão..."
              value={championFilter}
              onChange={(e) => setChampionFilter(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas as roles</option>
              <option value="top">Top</option>
              <option value="jungle">Jungle</option>
              <option value="mid">Mid</option>
              <option value="adc">ADC</option>
              <option value="support">Support</option>
            </select>
          </div>
        </div>

        <div className="stats-summary">
          <div className="summary-card">
            <div className="summary-value">
              {matches.filter(m => m && m.champion).length}
            </div>
            <div className="summary-label">Total de Partidas</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">
              {(() => {
                const validMatches = matches.filter(m => m && m.champion)
                const wins = validMatches.filter(m => isWin(m)).length
                return wins
              })()}
            </div>
            <div className="summary-label">Vitórias</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">
              {(() => {
                const validMatches = matches.filter(m => m && m.champion)
                if (validMatches.length === 0) return '0.0'
                const wins = validMatches.filter(m => isWin(m)).length
                const winRate = (wins / validMatches.length) * 100
                return winRate.toFixed(1)
              })()}%
            </div>
            <div className="summary-label">Taxa de Vitória</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Win Rate por Campeão (Top 15)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={winRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 155, 60, 0.2)" />
                <XAxis dataKey="champion" tick={{ fill: '#C89B3C', fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#C89B3C', fontSize: 12 }}
                  label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft', fill: '#C89B3C' }}
                />
                <Tooltip 
                  formatter={(value) => {
                    const numValue = Number(value)
                    return !isNaN(numValue) ? `${numValue.toFixed(1)}%` : '-'
                  }}
                  labelFormatter={(label) => `Campeão: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#1E2328', 
                    border: '1px solid rgba(200, 155, 60, 0.3)',
                    borderRadius: '8px',
                    color: '#F0E6D2'
                  }}
                />
                <Bar dataKey="winRate" fill="#C89B3C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Distribuição de Ouro aos 14min</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={goldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 155, 60, 0.2)" />
                <XAxis dataKey="range" tick={{ fill: '#C89B3C', fontSize: 12 }} />
                <YAxis tick={{ fill: '#C89B3C', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E2328', 
                    border: '1px solid rgba(200, 155, 60, 0.3)',
                    borderRadius: '8px',
                    color: '#F0E6D2'
                  }}
                />
                <Bar dataKey="count" fill="#C89B3C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="matches-table">
          <h3 className="chart-title">Últimas Partidas</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Match ID</th>
                  <th>Campeão</th>
                  <th>Role</th>
                  <th>Resultado</th>
                  <th>Ouro (14min)</th>
                  <th>XP (14min)</th>
                </tr>
              </thead>
              <tbody>
                {matches.slice(0, 50).map((match, idx) => (
                  <tr key={idx}>
                    <td>{match.matchid_simplified}</td>
                    <td><strong>{match.champion}</strong></td>
                    <td>{match.role}</td>
                    <td>
                      <span className={`result-badge ${isWin(match) ? 'win' : 'loss'}`}>
                        {isWin(match) ? 'Vitória' : 'Derrota'}
                      </span>
                    </td>
                    <td>
                      {(() => {
                        const gold = match.gold_14 != null ? Number(match.gold_14) : null
                        return gold != null && !isNaN(gold) ? gold.toFixed(0) : '-'
                      })()}
                    </td>
                    <td>
                      {(() => {
                        const xp = match.xp_14 != null ? Number(match.xp_14) : null
                        return xp != null && !isNaN(xp) ? xp.toFixed(0) : '-'
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Matches

