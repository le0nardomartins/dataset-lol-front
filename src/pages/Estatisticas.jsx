import './Estatisticas.css'

function Estatisticas() {
  return (
    <div className="estatisticas-page">
      <div className="page-background">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
      </div>

      <div className="estatisticas-content">
        <h1 className="page-title">Estatísticas</h1>
        <p className="page-subtitle">Análise detalhada de dados e métricas</p>
        
        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-box-header">
              <h3>Taxa de Vitória</h3>
            </div>
            <div className="stat-box-value">52.3%</div>
            <div className="stat-box-chart">
              <div className="chart-bar" style={{ width: '52.3%' }}></div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-box-header">
              <h3>KDA Médio</h3>
            </div>
            <div className="stat-box-value">2.8</div>
            <div className="stat-box-chart">
              <div className="chart-bar" style={{ width: '70%' }}></div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-box-header">
              <h3>Partidas Jogadas</h3>
            </div>
            <div className="stat-box-value">1,234</div>
            <div className="stat-box-chart">
              <div className="chart-bar" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Estatisticas

