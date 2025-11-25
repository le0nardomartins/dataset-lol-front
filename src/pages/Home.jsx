import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Trophy, Target } from 'lucide-react'
import { api } from '../services/api'
import LoadingScreen from '../components/LoadingScreen'
import './style/Home.css'

function Home() {
  const [championStats, setChampionStats] = useState([])
  const [kdaRanking, setKdaRanking] = useState([])
  const [advancedCorr, setAdvancedCorr] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [winRateData, ranking, advCorr] = await Promise.all([
          // GET /champions/win-rate - Win rate geral por campeão (todas as roles)
          api.getChampionWinRate({ minGames: 20, limit: 200 }),
          api.getChampionKDARanking({ limit: 10 }),
          // GET /stats/advanced-correlations - Correlações avançadas
          api.getAdvancedCorrelations()
        ])

        console.log('Win Rate Data:', winRateData)
        console.log('Advanced Correlations:', advCorr)

        const winRateArray = Array.isArray(winRateData) ? winRateData : []
        const rankingArray = Array.isArray(ranking) ? ranking : []

        // Top 10 campeões por win rate (percentual)
        // A API retorna win_rate como decimal (0-1), precisamos converter para porcentagem
        const topWinRate = winRateArray
          .filter(item => {
            if (!item || !item.champion) return false
            const rate = Number(item.win_rate)
            return !isNaN(rate) && isFinite(rate) && rate >= 0 && rate <= 1
          })
          .sort((a, b) => Number(b.win_rate) - Number(a.win_rate))
          .slice(0, 10)
          .map(item => {
            const rate = Number(item.win_rate) || 0
            // win_rate vem como decimal (0-1), converter para porcentagem (0-100)
            const percent = Math.max(0, Math.min(100, rate * 100))
            return {
              name: item.champion,
              value: Number(percent.toFixed(1))
            }
          })

        console.log('Top 10 Win Rate:', topWinRate)

        setChampionStats(topWinRate)
        setKdaRanking(rankingArray.slice(0, 10))
        setAdvancedCorr(advCorr && typeof advCorr === 'object' ? advCorr : null)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setChampionStats([])
        setKdaRanking([])
        setAdvancedCorr(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const safePercent = (value) => {
    const num = Number(value)
    if (!isFinite(num)) return '0.0'
    return num.toFixed(1)
  }

  if (loading) {
    return <LoadingScreen message="Carregando dados do dashboard..." />
  }

  // Extrair correlações do advanced-correlations
  // Estrutura esperada: { earlyGlobal: { corr_gold14_win, corr_xp14_win }, ... }
  const goldCorr = (() => {
    if (!advancedCorr || !advancedCorr.earlyGlobal) return '0.0'
    const value = advancedCorr.earlyGlobal.corr_gold14_win
    if (value == null || isNaN(Number(value))) return '0.0'
    return safePercent(Number(value) * 100)
  })()

  const xpCorr = (() => {
    if (!advancedCorr || !advancedCorr.earlyGlobal) return '0.0'
    const value = advancedCorr.earlyGlobal.corr_xp14_win
    if (value == null || isNaN(Number(value))) return '0.0'
    return safePercent(Number(value) * 100)
  })()

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="page-header">
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Estatísticas gerais do League of Legends</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-value">{championStats.length}</div>
            <div className="stat-label">Campeões Analisados</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Trophy size={24} />
            </div>
            <div className="stat-value">
              {goldCorr}%
            </div>
            <div className="stat-label">Correlação Ouro/Vitória</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-value">
              {kdaRanking.length > 0 ? kdaRanking[0].champion : '-'}
            </div>
            <div className="stat-label">Melhor KDA</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-value">
              {xpCorr}%
            </div>
            <div className="stat-label">Correlação XP/Vitória</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Top 10 Campeões por Win Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={championStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 155, 60, 0.2)" />
                <XAxis dataKey="name" tick={{ fill: '#C89B3C', fontSize: 12 }} />
                <YAxis
                  tick={{ fill: '#C89B3C', fontSize: 12 }}
                  domain={[0, 100]}
                  label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft', fill: '#C89B3C' }}
                />
                <Tooltip
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: '#1E2328',
                    border: '1px solid rgba(200, 155, 60, 0.3)',
                    borderRadius: '8px',
                    color: '#F0E6D2'
                  }}
                />
                <Bar dataKey="value" fill="#C89B3C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Top 10 KDA Ranking</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={kdaRanking}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 155, 60, 0.2)" />
                <XAxis dataKey="champion" tick={{ fill: '#C89B3C', fontSize: 12 }} />
                <YAxis tick={{ fill: '#C89B3C', fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => Number(value).toFixed(2)}
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
        </div>
      </div>
    </div>
  )
}

export default Home
