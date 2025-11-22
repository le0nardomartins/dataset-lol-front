import { useEffect, useState } from 'react'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react'
import { api } from '../services/api'
import { championClasses, getChampionUrl } from '../data/championClasses'
import './style/ChampionsTable.css'

function ChampionsTable() {
  const [allChampions, setAllChampions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sortField, setSortField] = useState('champion')
  const [sortDirection, setSortDirection] = useState('asc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllChampions = async () => {
      try {
        // Começar com TODOS os campeões do mapeamento
        const allChampionsList = Object.keys(championClasses).map(champName => ({
          champion: champName,
          class: championClasses[champName] || 'Desconhecida',
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
                  class: championClasses[champName] || 'Desconhecida',
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
          class: championClasses[champName] || 'Desconhecida',
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSorted = allChampions
    .filter(champ => {
      const matchesSearch = champ.champion.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClass = !classFilter || champ.class === classFilter
      // Se roleFilter está vazio, mostra todos. Se tem filtro, mostra apenas os que têm dados nessa role
      const matchesRole = !roleFilter || champ[roleFilter] !== null
      return matchesSearch && matchesClass && matchesRole
    })
    .sort((a, b) => {
      let aValue, bValue

      if (sortField === 'champion') {
        aValue = a.champion.toLowerCase()
        bValue = b.champion.toLowerCase()
      } else if (sortField === 'class') {
        aValue = a.class
        bValue = b.class
      } else {
        // Ordenar por win rate de uma role específica
        const role = sortField
        aValue = a[role]?.winRate || 0
        bValue = b[role]?.winRate || 0
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

  const classes = [...new Set(Object.values(championClasses))]
  const roles = [
    { key: 'top', label: 'Top' },
    { key: 'jungle', label: 'JG' },
    { key: 'mid', label: 'Mid' },
    { key: 'adc', label: 'ADC' },
    { key: 'support', label: 'Sup' }
  ]

  const handleRowClick = (champion) => {
    const url = getChampionUrl(champion)
    window.open(url, '_blank')
  }

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} />
    }
    return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
  }

  if (loading) {
    return (
      <div className="champions-table-page">
        <div className="loading">Carregando dados dos campeões...</div>
      </div>
    )
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
            <label>Classe:</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              {classes.sort().map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Com dados em:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas as posições</option>
              {roles.map(role => (
                <option key={role.key} value={role.key}>{role.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-info">
          <p>Total: {filteredAndSorted.length} campeões</p>
          <p className="info-text">Clique em uma linha para abrir a página oficial do campeão</p>
        </div>

        <div className="table-wrapper">
          <table className="champions-table">
            <thead>
              <tr>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('champion')}
                >
                  Campeão {getSortIcon('champion')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('class')}
                >
                  Classe {getSortIcon('class')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('top')}
                >
                  Top {getSortIcon('top')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('jungle')}
                >
                  JG {getSortIcon('jungle')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('mid')}
                >
                  Mid {getSortIcon('mid')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('adc')}
                >
                  ADC {getSortIcon('adc')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('support')}
                >
                  Sup {getSortIcon('support')}
                </th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((champ, idx) => (
                <tr 
                  key={idx} 
                  className="table-row-clickable"
                  onClick={() => handleRowClick(champ.champion)}
                >
                  <td className="champion-name">
                    <strong>{champ.champion}</strong>
                  </td>
                  <td>{champ.class}</td>
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
                  <td className="action-cell">
                    <a
                      href={getChampionUrl(champ.champion)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="external-link"
                    >
                      <ExternalLink size={16} />
                    </a>
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

