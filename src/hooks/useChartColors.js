import { useTheme } from '../contexts/ThemeContext'

export const useChartColors = () => {
  const { theme } = useTheme()

  const isDark = theme === 'dark'

  return {
    // Cores principais do LoL
    primary: '#C89B3C', // Dourado
    secondary: '#0AC8B9', // Azul ciano
    gold: '#C89B3C',
    goldLight: '#F0E6D2',
    goldDark: '#785A28',
    
    // Cores para gráficos
    barFill: isDark ? '#C89B3C' : '#C89B3C',
    barFillAlt: isDark ? '#0AC8B9' : '#0AC8B9',
    
    // Cores de grid e eixos
    gridStroke: isDark ? 'rgba(200, 155, 60, 0.2)' : 'rgba(200, 155, 60, 0.3)',
    tickFill: isDark ? '#C89B3C' : '#785A28',
    
    // Tooltip
    tooltipBg: isDark ? '#1E2328' : '#FFFFFF',
    tooltipBorder: isDark ? 'rgba(200, 155, 60, 0.3)' : 'rgba(200, 155, 60, 0.2)',
    
    // Paleta de cores para múltiplas séries
    palette: [
      '#C89B3C', // Dourado principal
      '#0AC8B9', // Azul ciano
      '#F0E6D2', // Dourado claro
      '#785A28', // Dourado escuro
      '#0397AB', // Azul escuro
      '#005A82', // Azul mais escuro
      '#C8AA6E', // Dourado alternativo
      '#A09B8C', // Cinza dourado
    ],
    
    // Cores para linhas
    lineStroke: isDark ? '#C89B3C' : '#C89B3C',
    lineStrokeAlt: isDark ? '#0AC8B9' : '#0AC8B9',
  }
}

