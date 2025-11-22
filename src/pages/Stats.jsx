import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { BarChart3, TrendingUp, Target, Activity } from 'lucide-react'
import { api } from '../services/api'
import { useChartColors } from '../hooks/useChartColors'
import LoadingScreen from '../components/LoadingScreen'
import './style/Stats.css'

function Stats() {
  const [correlations, setCorrelations] = useState(null)
  const [kdaVsWin, setKdaVsWin] = useState(null)
  const [loading, setLoading] = useState(true)
  const colors = useChartColors()

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
    return <LoadingScreen message="Carregando estatísticas..." />
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

  const COLORS = colors.palette

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
                <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} />
                <XAxis dataKey="name" tick={{ fill: colors.tickFill, fontSize: 12 }} />
                <YAxis tick={{ fill: colors.tickFill, fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: colors.tooltipBg, 
                    border: `1px solid ${colors.tooltipBorder}`,
                    borderRadius: '8px',
                    color: colors.tickFill
                  }}
                />
                <Bar dataKey="value" fill={colors.barFill} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Correlação KDA vs Vitória por Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} />
                <XAxis dataKey="role" tick={{ fill: colors.tickFill, fontSize: 12 }} />
                <YAxis tick={{ fill: colors.tickFill, fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: colors.tooltipBg, 
                    border: `1px solid ${colors.tooltipBorder}`,
                    borderRadius: '8px',
                    color: colors.tickFill
                  }}
                />
                <Bar dataKey="correlation" fill={colors.barFillAlt} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Distribuição de Correlação por Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={colors.gridStroke} />
                <PolarAngleAxis dataKey="role" tick={{ fill: colors.tickFill, fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: colors.tickFill, fontSize: 10 }} />
                <Radar name="Correlação" dataKey="correlation" stroke={colors.primary} fill={colors.primary} fillOpacity={0.3} />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: colors.tooltipBg, 
                    border: `1px solid ${colors.tooltipBorder}`,
                    borderRadius: '8px',
                    color: colors.tickFill
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

