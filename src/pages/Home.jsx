import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Users, Trophy, Target } from 'lucide-react'
import { api } from '../services/api'
import LoadingScreen from '../components/LoadingScreen'
import './style/Home.css'

function Home() {
  const [championStats, setChampionStats] = useState([])
  const [kdaRanking, setKdaRanking] = useState([])
  const [correlations, setCorrelations] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, ranking, corr] = await Promise.all([
          api.getChampionStats({}),
          api.getChampionKDARanking({ limit: 10 }),
          api.getCorrelations()
        ])
        
        // Top 10 campeões por win rate
        const topWinRate = [...stats]
          .sort((a, b) => b.win_rate - a.win_rate)
          .slice(0, 10)
          .map(item => ({
            name: item.champion,
            value: parseFloat((item.win_rate * 100).toFixed(1))
          }))

        setChampionStats(topWinRate)
        setKdaRanking(ranking.slice(0, 10))
        setCorrelations(corr)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const COLORS = ['#C89B3C', '#F0E6D2', '#785A28', '#C8AA6E', '#A09B8C', '#C89B3C', '#F0E6D2', '#785A28', '#C8AA6E', '#A09B8C']

  if (loading) {
    return <LoadingScreen message="Carregando dados do dashboard..." />
  }

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
              {correlations ? (correlations.corr_gold14_win * 100).toFixed(1) : '0'}%
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
              {correlations ? (correlations.corr_xp14_win * 100).toFixed(1) : '0'}%
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
                <YAxis tick={{ fill: '#C89B3C', fontSize: 12 }} />
                <Tooltip 
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
