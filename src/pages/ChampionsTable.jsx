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

        // Buscar dados de todas as roles da API
        const roles = ['top', 'jungle', 'mid', 'adc', 'support']
        try {
          const allStats = await Promise.all(
            roles.map(role => api.getChampionStats({ role }))
          )

          // Preencher dados da API quando disponíveis
          allStats.forEach((roleStats, roleIndex) => {
            roleStats.forEach(stat => {
              const champName = stat.champion
              // Se o campeão não existe no mapa, adiciona (caso tenha dados na API mas não no mapeamento)
              if (!championMap[champName]) {
                championMap[champName] = {
                  champion: champName,
              classes: normalizeClasses(championClasses[champName]),
                  top: null,
                  jungle: null,
                  mid: null,
                  adc: null,
                  support: null
                }
              }
              // Preenche os dados da role
              championMap[champName][roles[roleIndex]] = {
                winRate: stat.win_rate,
                games: stat.games,
                wins: stat.wins
              }
            })
          })
        } catch (apiError) {
          console.warn('Erro ao buscar dados da API, mostrando campeões sem dados:', apiError)
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


  if (loading) {
    return <LoadingScreen message="Carregando dados dos campeões..." />
  }

  return (
    <div className="champions-table-page">
      <div className="champions-table-content">
        <div className="page-header">
          <h1 className="page-title">Tabela Completa de Campeões</h1>
          <p className="page-subtitle">Taxa de vitória por posição e classe de cada campeão</p>
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
                    {champ.top ? (
                      <span className="win-rate">
                        {(champ.top.winRate * 100).toFixed(1)}%
                        <span className="games-count"> ({champ.top.games})</span>
                      </span>
                    ) : (
                      <span className="no-data">-</span>
                    )}
                  </td>
                  <td className="win-rate-cell">
                    {champ.jungle ? (
                      <span className="win-rate">
                        {(champ.jungle.winRate * 100).toFixed(1)}%
                        <span className="games-count"> ({champ.jungle.games})</span>
                      </span>
                    ) : (
                      <span className="no-data">-</span>
                    )}
                  </td>
                  <td className="win-rate-cell">
                    {champ.mid ? (
                      <span className="win-rate">
                        {(champ.mid.winRate * 100).toFixed(1)}%
                        <span className="games-count"> ({champ.mid.games})</span>
                      </span>
                    ) : (
                      <span className="no-data">-</span>
                    )}
                  </td>
                  <td className="win-rate-cell">
                    {champ.adc ? (
                      <span className="win-rate">
                        {(champ.adc.winRate * 100).toFixed(1)}%
                        <span className="games-count"> ({champ.adc.games})</span>
                      </span>
                    ) : (
                      <span className="no-data">-</span>
                    )}
                  </td>
                  <td className="win-rate-cell">
                    {champ.support ? (
                      <span className="win-rate">
                        {(champ.support.winRate * 100).toFixed(1)}%
                        <span className="games-count"> ({champ.support.games})</span>
                      </span>
                    ) : (
                      <span className="no-data">-</span>
                    )}
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

