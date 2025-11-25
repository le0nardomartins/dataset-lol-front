const API_BASE_URL = 'https://dataset-lol-server-production.up.railway.app/api';

// Função auxiliar para fazer requisições com tratamento de erro
const fetchWithErrorHandling = async (url) => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error);
    throw error;
  }
};

export const api = {
  // Matches
  getMatches: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/matches${queryParams ? `?${queryParams}` : ''}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  getMatch: async (matchId) => {
    const url = `${API_BASE_URL}/matches/${matchId}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  // Champions
  getChampionStats: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/champions/stats${queryParams ? `?${queryParams}` : ''}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  getChampionWinRate: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/champions/win-rate${queryParams ? `?${queryParams}` : ''}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  getChampionKDARanking: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/champions/kda-ranking${queryParams ? `?${queryParams}` : ''}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  getChampionMatches: async (champion, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/champions/${champion}/matches${queryParams ? `?${queryParams}` : ''}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  getChampionBestMatches: async (champion, limit = 20) => {
    const url = `${API_BASE_URL}/champions/${champion}/best-matches?limit=${limit}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  getChampionWorstMatches: async (champion, limit = 20) => {
    const url = `${API_BASE_URL}/champions/${champion}/worst-matches?limit=${limit}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  // Champions by role
  getRolesKDATop: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/champions/roles/kda-top20${queryParams ? `?${queryParams}` : ''}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  getRolesWinRateKDATop: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/champions/roles/winrate-kda-top15${queryParams ? `?${queryParams}` : ''}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  getRoleRanking: async (role, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/champions/roles/${role}/ranking${queryParams ? `?${queryParams}` : ''}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  getPickRateByRole: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/champions/roles/pick-rate${queryParams ? `?${queryParams}` : ''}`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  // Stats
  getCorrelations: async () => {
    const url = `${API_BASE_URL}/stats/correlations`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  getKDAVsWin: async () => {
    const url = `${API_BASE_URL}/stats/kda-vs-win`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },

  getAdvancedCorrelations: async () => {
    const url = `${API_BASE_URL}/stats/advanced-correlations`;
    console.log('GET:', url);
    return fetchWithErrorHandling(url);
  },
};

