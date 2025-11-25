import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3, TrendingUp, Target, Activity } from 'lucide-react'
import { api } from '../services/api'
import { useChartColors } from '../hooks/useChartColors'
import LoadingScreen from '../components/LoadingScreen'
import './style/Stats.css'

function Stats() {
  const [advancedCorr, setAdvancedCorr] = useState(null)
  const [loading, setLoading] = useState(true)
  const colors = useChartColors()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // GET /stats/advanced-correlations - Correlações avançadas (KDA/Ouro/XP vs Vitória, global e por role)
        const data = await api.getAdvancedCorrelations()
        console.log('Advanced Correlations:', data)
        setAdvancedCorr(data)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setAdvancedCorr(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingScreen message="Carregando estatísticas..." />
  }

  // Função auxiliar para formatar porcentagem de forma segura
  const safePercent = (value) => {
    const num = Number(value)
    if (!isFinite(num)) return '0.0'
    return num.toFixed(1)
  }

  // Dados para o gráfico "Correlações Early Game vs Vitória"
  const correlationData = advancedCorr?.earlyGlobal ? [
    { 
      name: 'Ouro vs Vitória', 
      value: Number(safePercent(advancedCorr.earlyGlobal.corr_gold14_win * 100))
    },
    { 
      name: 'XP vs Vitória', 
      value: Number(safePercent(advancedCorr.earlyGlobal.corr_xp14_win * 100))
    }
  ] : []

  // Dados para o gráfico "Correlação KDA vs Vitória por Role"
  const roleData = advancedCorr?.kdaByRole?.map(role => ({
    role: role.role?.toUpperCase() || role.role || '-',
    correlation: Number(safePercent(role.corr_kda_win * 100)),
    games: role.games || 0
  })) || []

  // Valores para os cards
  const goldCorr = advancedCorr?.earlyGlobal?.corr_gold14_win != null
    ? safePercent(advancedCorr.earlyGlobal.corr_gold14_win * 100)
    : '0.0'

  const xpCorr = advancedCorr?.earlyGlobal?.corr_xp14_win != null
    ? safePercent(advancedCorr.earlyGlobal.corr_xp14_win * 100)
    : '0.0'

  const kdaGlobalCorr = advancedCorr?.kdaGlobal?.corr_kda_win != null
    ? safePercent(advancedCorr.kdaGlobal.corr_kda_win * 100)
    : '0.0'

  const totalGames = advancedCorr?.kdaGlobal?.games || 0

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
              {goldCorr}%
            </div>
            <div className="stat-label">Correlação Ouro/Vitória</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Activity size={24} />
            </div>
            <div className="stat-value">
              {xpCorr}%
            </div>
            <div className="stat-label">Correlação XP/Vitória</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-value">
              {kdaGlobalCorr}%
            </div>
            <div className="stat-label">Correlação KDA/Vitória (Global)</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-value">
              {totalGames.toLocaleString('pt-BR')}
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
                <YAxis 
                  tick={{ fill: colors.tickFill, fontSize: 12 }}
                  label={{ value: 'Correlação (%)', angle: -90, position: 'insideLeft', fill: colors.tickFill }}
                />
                <Tooltip 
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                  contentStyle={{ 
                    backgroundColor: colors.tooltipBg, 
                    border: `1px solid ${colors.tooltipBorder}`,
                    borderRadius: '8px',
                    color: colors.tickFill
                  }}
                />
                <Bar dataKey="value" fill={colors.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Correlação KDA vs Vitória por Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} />
                <XAxis dataKey="role" tick={{ fill: colors.tickFill, fontSize: 12 }} />
                <YAxis 
                  tick={{ fill: colors.tickFill, fontSize: 12 }}
                  label={{ value: 'Correlação (%)', angle: -90, position: 'insideLeft', fill: colors.tickFill }}
                />
                <Tooltip 
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                  contentStyle={{ 
                    backgroundColor: colors.tooltipBg, 
                    border: `1px solid ${colors.tooltipBorder}`,
                    borderRadius: '8px',
                    color: colors.tickFill
                  }}
                />
                <Bar dataKey="correlation" fill={colors.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
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

