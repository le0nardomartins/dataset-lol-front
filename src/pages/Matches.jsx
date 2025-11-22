import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Calendar, Filter, Download } from 'lucide-react'
import { api } from '../services/api'
import './style/Matches.css'

function Matches() {
  const [matches, setMatches] = useState([])
  const [championFilter, setChampionFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {}
        if (championFilter) params.champion = championFilter
        if (roleFilter) params.role = roleFilter
        params.limit = 100

        const data = await api.getMatches(params)
        setMatches(data)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [championFilter, roleFilter])

  const winRateByChampion = matches.reduce((acc, match) => {
    if (!acc[match.champion]) {
      acc[match.champion] = { wins: 0, total: 0 }
    }
    acc[match.champion].total++
    if (match.win) acc[match.champion].wins++
    return acc
  }, {})

  const winRateData = Object.entries(winRateByChampion)
    .map(([champion, data]) => ({
      champion,
      winRate: (data.wins / data.total) * 100,
      games: data.total
    }))
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 15)

  const goldDistribution = matches
    .filter(m => m.gold_14)
    .map(m => ({
      range: Math.floor(m.gold_14 / 500) * 500,
      value: m.gold_14
    }))
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
    return (
      <div className="matches-page">
        <div className="loading">Carregando dados...</div>
      </div>
    )
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
            <div className="summary-value">{matches.length}</div>
            <div className="summary-label">Total de Partidas</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">
              {matches.filter(m => m.win).length}
            </div>
            <div className="summary-label">Vitórias</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">
              {matches.length > 0 
                ? ((matches.filter(m => m.win).length / matches.length) * 100).toFixed(1)
                : 0}%
            </div>
            <div className="summary-label">Taxa de Vitória</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Win Rate por Campeão (Top 15)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={winRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="champion" tick={{ fill: '#64748b', fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => `${value.toFixed(1)}%`}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="winRate" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Distribuição de Ouro aos 14min</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={goldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#1e40af" radius={[8, 8, 0, 0]} />
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
                      <span className={`result-badge ${match.win ? 'win' : 'loss'}`}>
                        {match.win ? 'Vitória' : 'Derrota'}
                      </span>
                    </td>
                    <td>{match.gold_14?.toFixed(0) || '-'}</td>
                    <td>{match.xp_14?.toFixed(0) || '-'}</td>
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

