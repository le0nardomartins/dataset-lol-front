# 🎮 Dashboard Analítico de League of Legends

![League of Legends Dashboard](https://www.oficinadanet.com.br/imagens/post/29025/capa-lol-e-o-game-mais-assistido-da-twitch-de-2019_1400x875_5df95c7508bfd.jpg)

## 👋 Fala pessoal, beleza?!

Este projeto foi feito para **treino, aprendizado e fins acadêmicos**. Nele, transformei um dataset de **8GB de dados** em um dashboard analítico completo sobre matchups, partidas e campeões de **League of Legends**.

As análises foram feitas com base nos dados, que em grande parte são dos servidores da **América do Norte**, todos do **ano de 2025**. 

Esse dashboard não foi feito levando em conta partidas normais, e sim **apenas rankeds a nível Diamante e Challenger**. Mais de **126 mil partidas** foram extraídas e o servidor analisa elas, tornando bem preciso, para o ano de 2025, as métricas e resultados estatísticos.

**Link para o projeto na vercel: https://dataset-lol-front.vercel.app/**

> ⚠️ **Atenção**: Para anos posteriores, desconsidere essas análises. Alguns campeões podem ter sido nerfados, builds podem ter mudado e diversos outros fatores podem ter alterado o meta do jogo.

## 🎯 Objetivo Principal

O intuito principal foi criar, para fins educacionais, um **dashboard interativo**, usando um enorme dataset, para visualização de dados e estatísticas do League of Legends.

## 📊 Funcionalidades da Aplicação

Esta aplicação transforma um dataset de League of Legends em uma demonstração gráfica visual, apresentando:

### 🏠 **Página Inicial**
- Visão geral com métricas principais
- Gráficos de performance dos top 10 campeões
- Cards de correlação (Ouro/Vitória, XP/Vitória, KDA/Vitória)

### 👥 **Campeões**
- Análise detalhada de cada campeão
- Win rate, KDA e estatísticas por posição
- Gráficos de distribuição de ouro e XP aos 14 minutos
- Tabela completa com todas as estatísticas

### 📋 **Tabela Completa**
- Lista de todos os campeões disponíveis
- Taxa de aparição (pick rate) por posição (Top, JG, Mid, ADC, Sup)
- Classes e categorias de cada campeão
- Filtros por classe e busca por nome

### 🏆 **Rankings**
- Classificação de campeões por KDA
- Performance geral e por role
- Filtros por posição e número mínimo de partidas

### 📈 **Estatísticas e Correlações**
- Análise avançada de correlações entre métricas e vitórias
- Correlações Early Game vs Vitória (Ouro e XP)
- Correlação KDA vs Vitória por role
- Total de partidas analisadas

## 🛠️ Tecnologias Utilizadas

- **React** - Framework frontend
- **Recharts** - Biblioteca de gráficos
- **React Router** - Roteamento
- **Vite** - Build tool
- **API REST** - Backend para processamento de dados

## 📝 Nota

Este projeto foi criado por mim como parte do meu processo de aprendizado e treinamento em desenvolvimento web e visualização de dados.

## 🔗 Links Relacionados

- **[Site Oficial do League of Legends](https://www.leagueoflegends.com/pt-br/)** - Descubra mais sobre o jogo que inspirou este projeto
