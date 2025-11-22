import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Trophy, TrendingUp, Award, Filter } from 'lucide-react'
import { api } from '../services/api'
import LoadingScreen from '../components/LoadingScreen'
import './style/Rankings.css'

function Rankings() {
  const [kdaRanking, setKdaRanking] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [minGames, setMinGames] = useState(20)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          minGames,
          limit: 50
        }
        if (selectedRole) params.role = selectedRole

        const data = await api.getChampionKDARanking(params)
        setKdaRanking(data)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedRole, minGames])

  const topKDA = kdaRanking.slice(0, 20)
  const winRateData = kdaRanking.slice(0, 15).map(item => ({
    champion: item.champion,
    winRate: item.win_rate * 100,
    kda: item.avg_kda
  }))

  if (loading) {
    return <LoadingScreen message="Carregando rankings..." />
  }

  return (
    <div className="rankings-page">
      <div className="rankings-content">
        <div className="page-header">
          <h1 className="page-title">Rankings de Campeões</h1>
          <p className="page-subtitle">Classificação por KDA e performance</p>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              <option value="top">Top</option>
              <option value="jungle">Jungle</option>
              <option value="mid">Mid</option>
              <option value="adc">ADC</option>
              <option value="support">Support</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Mínimo de Partidas:</label>
            <input
              type="number"
              value={minGames}
              onChange={(e) => setMinGames(parseInt(e.target.value) || 20)}
              className="filter-input"
              min="1"
            />
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Top 20 KDA Ranking</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topKDA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 155, 60, 0.2)" />
                <XAxis dataKey="champion" tick={{ fill: '#C89B3C', fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fill: '#C89B3C', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E2328', 
                    border: '1px solid rgba(200, 155, 60, 0.3)',
                    borderRadius: '8px',
                    color: '#F0E6D2'
                  }}
                />
                <Bar dataKey="avg_kda" fill="#C89B3C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Win Rate vs KDA (Top 15)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={winRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 155, 60, 0.2)" />
                <XAxis dataKey="champion" tick={{ fill: '#C89B3C', fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" tick={{ fill: '#C89B3C', fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#C89B3C', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E2328', 
                    border: '1px solid rgba(200, 155, 60, 0.3)',
                    borderRadius: '8px',
                    color: '#F0E6D2'
                  }}
                />
                <Line yAxisId="left" type="monotone" dataKey="winRate" stroke="#C89B3C" strokeWidth={2} name="Win Rate %" />
                <Line yAxisId="right" type="monotone" dataKey="kda" stroke="#F0E6D2" strokeWidth={2} name="KDA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rankings-table">
          <h3 className="chart-title">Ranking Completo</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Campeão</th>
                  <th>Role</th>
                  <th>Partidas</th>
                  <th>Vitórias</th>
                  <th>KDA Médio</th>
                  <th>Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {kdaRanking.map((item, idx) => (
                  <tr key={idx}>
                    <td className="rank-cell">{idx + 1}</td>
                    <td><strong>{item.champion}</strong></td>
                    <td>{item.role}</td>
                    <td>{item.games}</td>
                    <td>{item.wins}</td>
                    <td className="kda-cell">{item.avg_kda?.toFixed(2) || '-'}</td>
                    <td>{(item.win_rate * 100).toFixed(1)}%</td>
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

export default Rankings
