import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { api } from '../services/api'
import { championClasses, getChampionUrl } from '../data/championClasses'
import fighterIcon from '../../assets/fighter.png'
import mageIcon from '../../assets/mage.png'
import assasinIcon from '../../assets/assasin.png'
import shooterIcon from '../../assets/shooter.png'
import tankIcon from '../../assets/tank.png'
import supIcon from '../../assets/sup.png'
import LoadingScreen from '../components/LoadingScreen'
import './style/ChampionsTable.css'

function ChampionsTable() {
  const [allChampions, setAllChampions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [classFilter, setClassFilter] = useState('todos')

  const availableClasses = ['Lutador', 'Mago', 'Assassino', 'Atirador', 'Tanque', 'Suporte']

  const normalizeClasses = (rawClass) => {
    if (!rawClass) return ['Desconhecida']
    if (Array.isArray(rawClass)) return rawClass
    if (typeof rawClass === 'string') {
      const parts = rawClass
        .split(/[\/,]/)
        .map((part) => part.trim())
        .filter(Boolean)
      return parts.length > 0 ? parts : ['Desconhecida']
    }
    return ['Desconhecida']
  }

  const getClassIcon = (className) => {
    switch (className) {
      case 'Lutador':
        return fighterIcon
      case 'Mago':
        return mageIcon
      case 'Assassino':
        return assasinIcon
      case 'Atirador':
        return shooterIcon
      case 'Tanque':
        return tankIcon
      case 'Suporte':
        return supIcon
      default:
        return null
    }
  }

  useEffect(() => {
    const fetchAllChampions = async () => {
      try {
        // Começar com TODOS os campeões do mapeamento
        const allChampionsList = Object.keys(championClasses).map(champName => ({
          champion: champName,
          classes: normalizeClasses(championClasses[champName]),
          top: null,
          jungle: null,
          mid: null,
          adc: null,
          support: null
        }))

        // Criar mapa inicial com todos os campeões
        const championMap = {}
        allChampionsList.forEach(champ => {
          championMap[champ.champion] = { ...champ }
        })

        // Buscar dados de pick-rate por role usando a API específica
        // GET /champions/roles/pick-rate - Percentual de aparição (pick rate) dos campeões em cada role
        try {
          const pickRateData = await api.getPickRateByRole({ minGames: 0 })
          console.log('Pick Rate Data:', pickRateData)

          // Mapear roles da API para as chaves do objeto
          const roleMapping = {
            'TOP': 'top',
            'JUNGLE': 'jungle',
            'JG': 'jungle',
            'MID': 'mid',
            'ADC': 'adc',
            'SUPPORT': 'support',
            'SUP': 'support'
          }

          // Preencher dados de pick-rate quando disponíveis
          if (Array.isArray(pickRateData)) {
            pickRateData.forEach(item => {
              const champName = item.champion
              const roleKey = roleMapping[item.role?.toUpperCase()] || item.role?.toLowerCase()

              // Se o campeão não existe no mapa, adiciona
              if (!championMap[champName]) {
                championMap[champName] = {
                  champion: champName,
                  classes: normalizeClasses(championClasses[champName] || []),
                  top: null,
                  jungle: null,
                  mid: null,
                  adc: null,
                  support: null
                }
              }

              // Preenche os dados de pick-rate da role
              if (roleKey && (roleKey === 'top' || roleKey === 'jungle' || roleKey === 'mid' || roleKey === 'adc' || roleKey === 'support')) {
                championMap[champName][roleKey] = {
                  pickRate: item.pick_rate != null ? Number(item.pick_rate) : null,
                  games: item.games != null ? Number(item.games) : null,
                  totalGames: item.total_games != null ? Number(item.total_games) : null,
                  pickRank: item.pick_rank != null ? Number(item.pick_rank) : null
                }
              }
            })
          }
        } catch (apiError) {
          console.warn('Erro ao buscar dados de pick-rate da API, mostrando campeões sem dados:', apiError)
          // Continua mesmo se a API falhar
        }

        setAllChampions(Object.values(championMap))
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        // Em caso de erro, ainda mostra os campeões do mapeamento
        const fallbackChampions = Object.keys(championClasses).map(champName => ({
          champion: champName,
          classes: normalizeClasses(championClasses[champName]),
          top: null,
          jungle: null,
          mid: null,
          adc: null,
          support: null
        }))
        setAllChampions(fallbackChampions)
      } finally {
        setLoading(false)
      }
    }

    fetchAllChampions()
  }, [])

  const filteredChampions = allChampions
    .filter(champ =>
      champ.champion.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(champ =>
      classFilter === 'todos'
        ? true
        : Array.isArray(champ.classes) && champ.classes.includes(classFilter),
    )

  const handleRowClick = (champion) => {
    const url = getChampionUrl(champion)
    window.open(url, '_blank')
  }

  // Função auxiliar para formatar pick rate
  // Se houver pelo menos 1 jogo, mostra o pick rate (ou ">0.0%" se for muito pequeno)
  // Se não houver jogos, mostra "-"
  const formatPickRate = (roleData) => {
    if (!roleData) return null
    
    const games = roleData.games || 0
    const pickRate = roleData.pickRate
    
    // Se não houver jogos, não há aparição
    if (games === 0 || games == null) {
      return null
    }
    
    // Se houver pelo menos 1 jogo, deve mostrar algo
    if (pickRate != null) {
      const ratePercent = pickRate * 100
      // Se o pick rate for 0 mas houver games, mostra ">0.0%"
      if (ratePercent === 0 || ratePercent < 0.1) {
        return { display: '>0.0%', games }
      }
      // Caso contrário, mostra o valor real
      return { display: `${ratePercent.toFixed(1)}%`, games }
    }
    
    // Se houver games mas não houver pickRate, mostra ">0.0%"
    return { display: '>0.0%', games }
  }


  if (loading) {
    return <LoadingScreen message="Carregando dados dos campeões..." />
  }

  return (
    <div className="champions-table-page">
      <div className="champions-table-content">
        <div className="page-header">
          <h1 className="page-title">Tabela Completa de Campeões</h1>
          <p className="page-subtitle">Taxa de aparição (pick rate) por posição e classe de cada campeão</p>
        </div>

        <div className="table-filters">
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

          <div className="filter-group">
            <label htmlFor="classFilter">Classe</label>
            <select
              id="classFilter"
              className="filter-select"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="todos">Todas</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-info">
          <p>Total: {filteredChampions.length} campeões</p>
          <p className="info-text">Clique em uma linha para abrir a página oficial do campeão</p>
        </div>

        <div className="table-wrapper">
          <table className="champions-table">
            <thead>
              <tr>
                <th>Campeão</th>
                <th>Classe</th>
                <th>Top</th>
                <th>JG</th>
                <th>Mid</th>
                <th>ADC</th>
                <th>Sup</th>
              </tr>
            </thead>
            <tbody>
              {filteredChampions.map((champ, idx) => (
                <tr 
                  key={idx} 
                  className="table-row-clickable"
                  onClick={() => handleRowClick(champ.champion)}
                >
                  <td className="champion-name">
                    {champ.champion}
                  </td>
                  <td className="class-cell">
                {Array.isArray(champ.classes) && champ.classes.length > 0 ? (
                  champ.classes.map((cls) => {
                    const icon = getClassIcon(cls)
                    return icon ? (
                      <img
                        key={cls}
                        src={icon}
                        alt={cls}
                        className="class-icon"
                      />
                    ) : (
                      <span key={cls}>{cls}</span>
                    )
                  })
                ) : (
                  <span>-</span>
                )}
              </td>
                  <td className="win-rate-cell">
                    {(() => {
                      const formatted = formatPickRate(champ.top)
                      return formatted ? (
                        <span className="win-rate">
                          {formatted.display}
                          <span className="games-count"> ({formatted.games})</span>
                        </span>
                      ) : (
                        <span className="no-data">-</span>
                      )
                    })()}
                  </td>
                  <td className="win-rate-cell">
                    {(() => {
                      const formatted = formatPickRate(champ.jungle)
                      return formatted ? (
                        <span className="win-rate">
                          {formatted.display}
                          <span className="games-count"> ({formatted.games})</span>
                        </span>
                      ) : (
                        <span className="no-data">-</span>
                      )
                    })()}
                  </td>
                  <td className="win-rate-cell">
                    {(() => {
                      const formatted = formatPickRate(champ.mid)
                      return formatted ? (
                        <span className="win-rate">
                          {formatted.display}
                          <span className="games-count"> ({formatted.games})</span>
                        </span>
                      ) : (
                        <span className="no-data">-</span>
                      )
                    })()}
                  </td>
                  <td className="win-rate-cell">
                    {(() => {
                      const formatted = formatPickRate(champ.adc)
                      return formatted ? (
                        <span className="win-rate">
                          {formatted.display}
                          <span className="games-count"> ({formatted.games})</span>
                        </span>
                      ) : (
                        <span className="no-data">-</span>
                      )
                    })()}
                  </td>
                  <td className="win-rate-cell">
                    {(() => {
                      const formatted = formatPickRate(champ.support)
                      return formatted ? (
                        <span className="win-rate">
                          {formatted.display}
                          <span className="games-count"> ({formatted.games})</span>
                        </span>
                      ) : (
                        <span className="no-data">-</span>
                      )
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ChampionsTable

