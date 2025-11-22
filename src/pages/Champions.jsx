import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts'
import { Search, TrendingUp, Award, AlertCircle } from 'lucide-react'
import { api } from '../services/api'
import './style/Champions.css'

function Champions() {
  const [championStats, setChampionStats] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = selectedRole ? { role: selectedRole } : {}
        const stats = await api.getChampionStats(params)
        setChampionStats(stats)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedRole])

  const filteredStats = championStats.filter(champ =>
    champ.champion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const topWinRate = [...filteredStats]
    .sort((a, b) => b.win_rate - a.win_rate)
    .slice(0, 15)

  const avgGoldXP = filteredStats.map(champ => ({
    champion: champ.champion,
    gold: champ.avg_gold_14,
    xp: champ.avg_xp_14,
    winRate: champ.win_rate * 100
  }))

  const roles = ['top', 'jungle', 'mid', 'adc', 'support']

  if (loading) {
    return (
      <div className="champions-page">
        <div className="loading">Carregando dados...</div>
      </div>
    )
  }

  return (
    <div className="champions-page">
      <div className="champions-content">
        <div className="page-header">
          <h1 className="page-title">Estatísticas de Campeões</h1>
          <p className="page-subtitle">Análise detalhada de performance por campeão</p>
        </div>

        <div className="filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar campeão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="role-filters">
            <button
              className={`role-btn ${selectedRole === '' ? 'active' : ''}`}
              onClick={() => setSelectedRole('')}
            >
              Todas
            </button>
            {roles.map(role => (
              <button
                key={role}
                className={`role-btn ${selectedRole === role ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
              >
                {role.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Top 15 Win Rate</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topWinRate} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 155, 60, 0.2)" />
                <XAxis type="number" domain={[0, 1]} tick={{ fill: '#C89B3C', fontSize: 12 }} />
                <YAxis dataKey="champion" type="category" tick={{ fill: '#C89B3C', fontSize: 11 }} width={100} />
                <Tooltip 
                  formatter={(value) => `${(value * 100).toFixed(1)}%`}
                  contentStyle={{ 
                    backgroundColor: '#1E2328', 
                    border: '1px solid rgba(200, 155, 60, 0.3)',
                    borderRadius: '8px',
                    color: '#F0E6D2'
                  }}
                />
                <Bar dataKey="win_rate" fill="#C89B3C" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Ouro vs XP aos 14min</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={avgGoldXP}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 155, 60, 0.2)" />
                <XAxis 
                  type="number" 
                  dataKey="gold" 
                  name="Ouro"
                  tick={{ fill: '#C89B3C', fontSize: 12 }}
                  label={{ value: 'Ouro aos 14min', position: 'insideBottom', offset: -5, fill: '#C89B3C' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="xp" 
                  name="XP"
                  tick={{ fill: '#C89B3C', fontSize: 12 }}
                  label={{ value: 'XP aos 14min', angle: -90, position: 'insideLeft', fill: '#C89B3C' }}
                />
                <ZAxis dataKey="winRate" range={[50, 400]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: '#1E2328', 
                    border: '1px solid rgba(200, 155, 60, 0.3)',
                    borderRadius: '8px',
                    color: '#F0E6D2'
                  }}
                />
                <Scatter dataKey="winRate" fill="#C89B3C" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stats-table">
          <h3 className="chart-title">Estatísticas Completas</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Campeão</th>
                  <th>Role</th>
                  <th>Partidas</th>
                  <th>Vitórias</th>
                  <th>Win Rate</th>
                  <th>Ouro Médio (14min)</th>
                  <th>XP Médio (14min)</th>
                </tr>
              </thead>
              <tbody>
                {filteredStats.slice(0, 50).map((champ, idx) => (
                  <tr key={idx}>
                    <td><strong>{champ.champion}</strong></td>
                    <td>{champ.role}</td>
                    <td>{champ.games}</td>
                    <td>{champ.wins}</td>
                    <td>{(champ.win_rate * 100).toFixed(1)}%</td>
                    <td>{champ.avg_gold_14?.toFixed(0) || '-'}</td>
                    <td>{champ.avg_xp_14?.toFixed(0) || '-'}</td>
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

export default Champions
