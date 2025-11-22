import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { BarChart3, TrendingUp, Target, Activity } from 'lucide-react'
import { api } from '../services/api'
import './Stats.css'

function Stats() {
  const [correlations, setCorrelations] = useState(null)
  const [kdaVsWin, setKdaVsWin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [corr, kda] = await Promise.all([
          api.getCorrelations(),
          api.getKDAVsWin()
        ])
        setCorrelations(corr)
        setKdaVsWin(kda)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="stats-page">
        <div className="loading">Carregando dados...</div>
      </div>
    )
  }

  const correlationData = correlations ? [
    { name: 'Ouro vs Vitória', value: (correlations.corr_gold14_win * 100).toFixed(2), fullValue: correlations.corr_gold14_win },
    { name: 'XP vs Vitória', value: (correlations.corr_xp14_win * 100).toFixed(2), fullValue: correlations.corr_xp14_win }
  ] : []

  const roleData = kdaVsWin?.byRole?.map(role => ({
    role: role.role.toUpperCase(),
    correlation: (role.corr_kda_win * 100).toFixed(1),
    games: role.games
  })) || []

  const radarData = kdaVsWin?.byRole?.map(role => ({
    role: role.role,
    correlation: Math.abs(role.corr_kda_win * 100)
  })) || []

  const COLORS = ['#2563eb', '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd']

  return (
    <div className="stats-page">
      <div className="stats-content">
        <div className="page-header">
          <h1 className="page-title">Estatísticas e Correlações</h1>
          <p className="page-subtitle">Análise de correlações entre métricas e vitórias</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-value">
              {correlations ? (correlations.corr_gold14_win * 100).toFixed(1) : '0'}%
            </div>
            <div className="stat-label">Correlação Ouro/Vitória</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Activity size={24} />
            </div>
            <div className="stat-value">
              {correlations ? (correlations.corr_xp14_win * 100).toFixed(1) : '0'}%
            </div>
            <div className="stat-label">Correlação XP/Vitória</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-value">
              {kdaVsWin?.global ? (kdaVsWin.global.corr_kda_win * 100).toFixed(1) : '0'}%
            </div>
            <div className="stat-label">Correlação KDA/Vitória (Global)</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-value">
              {kdaVsWin?.global?.games || 0}
            </div>
            <div className="stat-label">Total de Partidas Analisadas</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Correlações Early Game vs Vitória</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Correlação KDA vs Vitória por Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="role" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="correlation" fill="#1e40af" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Distribuição de Correlação por Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="role" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Correlação" dataKey="correlation" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stats-table">
          <h3 className="chart-title">Correlações Detalhadas por Role</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Correlação KDA/Vitória</th>
                  <th>Partidas</th>
                </tr>
              </thead>
              <tbody>
                {roleData.map((item, idx) => (
                  <tr key={idx}>
                    <td><strong>{item.role}</strong></td>
                    <td className="correlation-cell">{item.correlation}%</td>
                    <td>{item.games}</td>
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

export default Stats

