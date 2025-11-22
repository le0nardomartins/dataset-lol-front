const API_BASE_URL = 'https://dataset-lol-server-production.up.railway.app/api';

export const api = {
  // Matches
  getMatches: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/matches${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url);
    return response.json();
  },

  getMatch: async (matchId) => {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`);
    return response.json();
  },

  // Champions
  getChampionStats: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/champions/stats${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url);
    return response.json();
  },

  getChampionKDARanking: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/champions/kda-ranking${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url);
    return response.json();
  },

  getChampionMatches: async (champion, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/champions/${champion}/matches${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url);
    return response.json();
  },

  getChampionBestMatches: async (champion, limit = 20) => {
    const response = await fetch(`${API_BASE_URL}/champions/${champion}/best-matches?limit=${limit}`);
    return response.json();
  },

  getChampionWorstMatches: async (champion, limit = 20) => {
    const response = await fetch(`${API_BASE_URL}/champions/${champion}/worst-matches?limit=${limit}`);
    return response.json();
  },

  // Stats
  getCorrelations: async () => {
    const response = await fetch(`${API_BASE_URL}/stats/correlations`);
    return response.json();
  },

  getKDAVsWin: async () => {
    const response = await fetch(`${API_BASE_URL}/stats/kda-vs-win`);
    return response.json();
  },
};

