import './Sobre.css'

function Sobre() {
  return (
    <div className="sobre-page">
      <div className="page-background">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
      </div>

      <div className="sobre-content">
        <h1 className="page-title">Sobre</h1>
        
        <div className="sobre-card">
          <h2>Dashboard League of Legends</h2>
          <p>
            Este dashboard foi criado para fornecer uma experiência visual rica e imersiva
            para explorar dados e estatísticas do League of Legends.
          </p>
          <p>
            Desenvolvido com React, Vite e estilizado com inspiração no universo de Runeterra,
            oferecendo uma interface moderna com efeitos visuais impressionantes.
          </p>
          
          <div className="tech-stack">
            <h3>Tecnologias Utilizadas</h3>
            <div className="tech-items">
              <span className="tech-badge">React</span>
              <span className="tech-badge">Vite</span>
              <span className="tech-badge">CSS3</span>
              <span className="tech-badge">React Router</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sobre

