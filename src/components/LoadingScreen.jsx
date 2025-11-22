import './LoadingScreen.css'

function LoadingScreen({ message = 'Carregando dados...' }) {
  return (
    <div className="loading-screen">
      <div className="loading-background">
        <div className="loading-particle particle-1"></div>
        <div className="loading-particle particle-2"></div>
        <div className="loading-particle particle-3"></div>
        <div className="loading-particle particle-4"></div>
        <div className="loading-particle particle-5"></div>
        <div className="loading-particle particle-6"></div>
        <div className="loading-particle particle-7"></div>
        <div className="loading-particle particle-8"></div>
      </div>
      
      <div className="loading-content">
        <div className="loading-logo-container">
          <div className="loading-logo-glow"></div>
          <img src="/logo.png" alt="LoL Dashboard" className="loading-logo" />
        </div>
        
        <div className="loading-spinner-container">
          <div className="loading-spinner">
            <div className="spinner-ring ring-1"></div>
            <div className="spinner-ring ring-2"></div>
            <div className="spinner-ring ring-3"></div>
            <div className="spinner-core"></div>
          </div>
        </div>
        
        <div className="loading-text-container">
          <h2 className="loading-title">LoL Dashboard</h2>
          <p className="loading-message">{message}</p>
          <div className="loading-dots">
            <span className="dot dot-1"></span>
            <span className="dot dot-2"></span>
            <span className="dot dot-3"></span>
          </div>
        </div>
        
        <div className="loading-progress-bar">
          <div className="loading-progress-fill"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen

