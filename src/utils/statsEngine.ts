import { GameHistoryItem } from '../storage/historyStorage';

export interface PlayerGameBreakdown {
  gameName: string;
  games: number;
  wins: number;
  avgScore: number;
}

export interface PlayerStats {
  name: string;
  games: number;
  wins: number;
  winRate: number;
  avgScore: number;
  bestScore: number;
  streak: number;
  gameBreakdown: PlayerGameBreakdown[];
}

export interface GamePlayerRank {
  name: string;
  wins: number;
  games: number;
  avgScore: number;
  bestScore: number;
}

export interface GameStats {
  name: string;
  count: number;
  bestPlayer: string;
  bestPlayerWins: number;
  bestScoreEntry: { player: string; score: number } | null;
  avgScore: number;
  playerRanking: GamePlayerRank[];
}

export interface DonutSlice {
  gameName: string;
  count: number;
  percentage: number;
}

export interface StatsResult {
  totalGames: number;
  mostPlayedGame: string | null;
  mostActivePlayer: string | null;
  players: PlayerStats[];
  gameStats: GameStats[];
  donutData: DonutSlice[];
}

export interface DateFilter {
  mois: number | null;   // 0-based
  annee: number | null;
}

function matchesDateFilter(date: string, filter: DateFilter): boolean {
  if (filter.mois === null && filter.annee === null) return true;
  const d = new Date(date);
  if (filter.annee !== null && d.getFullYear() !== filter.annee) return false;
  if (filter.mois !== null && d.getMonth() !== filter.mois) return false;
  return true;
}

export function computeStats(
  history: GameHistoryItem[],
  filterGame?: string,
  dateFilter?: DateFilter,
): StatsResult | null {
  let filtered = filterGame
    ? history.filter((h) => h.gameName === filterGame)
    : history;

  if (dateFilter) {
    filtered = filtered.filter((h) => matchesDateFilter(h.date, dateFilter));
  }

  if (filtered.length === 0) return null;

  const gameCountMap: Record<string, number> = {};
  const playerGamesMap: Record<string, number> = {};
  const playerWinsMap: Record<string, number> = {};
  const playerScoresMap: Record<string, number[]> = {};
  // player -> game -> { games, wins, scores }
  const playerGameMap: Record<string, Record<string, { games: number; wins: number; scores: number[] }>> = {};

  for (const game of filtered) {
    gameCountMap[game.gameName] = (gameCountMap[game.gameName] || 0) + 1;
    const winner = game.ranking[0]?.name;

    for (const entry of game.ranking) {
      playerGamesMap[entry.name] = (playerGamesMap[entry.name] || 0) + 1;
      if (!playerScoresMap[entry.name]) playerScoresMap[entry.name] = [];
      playerScoresMap[entry.name].push(entry.score);

      if (!playerGameMap[entry.name]) playerGameMap[entry.name] = {};
      if (!playerGameMap[entry.name][game.gameName])
        playerGameMap[entry.name][game.gameName] = { games: 0, wins: 0, scores: [] };
      playerGameMap[entry.name][game.gameName].games += 1;
      playerGameMap[entry.name][game.gameName].scores.push(entry.score);

      if (entry.name === winner) {
        playerGameMap[entry.name][game.gameName].wins += 1;
      }
    }

    if (winner) {
      playerWinsMap[winner] = (playerWinsMap[winner] || 0) + 1;
    }
  }

  // Streak (historique déjà trié du plus récent au plus ancien)
  const streakMap: Record<string, number> = {};
  const streakBroken: Record<string, boolean> = {};

  for (const game of filtered) {
    const winner = game.ranking[0]?.name;
    for (const entry of game.ranking) {
      if (streakBroken[entry.name]) continue;
      if (entry.name === winner) {
        streakMap[entry.name] = (streakMap[entry.name] || 0) + 1;
      } else {
        streakBroken[entry.name] = true;
      }
    }
  }

  const players: PlayerStats[] = Object.keys(playerGamesMap)
    .map((name) => {
      const games = playerGamesMap[name];
      const wins = playerWinsMap[name] || 0;
      const scores = playerScoresMap[name] || [];
      const gameBreakdown: PlayerGameBreakdown[] = Object.entries(playerGameMap[name] || {})
        .map(([gameName, data]) => ({
          gameName,
          games: data.games,
          wins: data.wins,
          avgScore:
            data.scores.length > 0
              ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
              : 0,
        }))
        .sort((a, b) => b.wins - a.wins);

      return {
        name,
        games,
        wins,
        winRate: Math.round((wins / games) * 100),
        avgScore:
          scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0,
        bestScore: scores.length > 0 ? Math.max(...scores) : 0,
        streak: streakMap[name] || 0,
        gameBreakdown,
      };
    })
    .sort((a, b) => b.wins - a.wins || b.winRate - a.winRate);

  // Per game stats
  const gameStats: GameStats[] = Object.keys(gameCountMap)
    .map((gameName) => {
      const gameHistory = filtered.filter((h) => h.gameName === gameName);
      const gameWinsMap: Record<string, number> = {};
      const gameGamesMap: Record<string, number> = {};
      const gameScoresMap: Record<string, number[]> = {};
      let bestScoreEntry: { player: string; score: number } | null = null;

      for (const g of gameHistory) {
        const winner = g.ranking[0]?.name;
        if (winner) gameWinsMap[winner] = (gameWinsMap[winner] || 0) + 1;

        for (const entry of g.ranking) {
          gameGamesMap[entry.name] = (gameGamesMap[entry.name] || 0) + 1;
          if (!gameScoresMap[entry.name]) gameScoresMap[entry.name] = [];
          gameScoresMap[entry.name].push(entry.score);

          if (!bestScoreEntry || entry.score > bestScoreEntry.score) {
            bestScoreEntry = { player: entry.name, score: entry.score };
          }
        }
      }

      const playerRanking: GamePlayerRank[] = Object.keys(gameGamesMap)
        .map((name) => {
          const scores = gameScoresMap[name] || [];
          return {
            name,
            wins: gameWinsMap[name] || 0,
            games: gameGamesMap[name],
            avgScore:
              scores.length > 0
                ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                : 0,
            bestScore: scores.length > 0 ? Math.max(...scores) : 0,
          };
        })
        .sort((a, b) => b.wins - a.wins || b.avgScore - a.avgScore);

      const sortedWins = Object.entries(gameWinsMap).sort((a, b) => b[1] - a[1]);
      const bestPlayer = sortedWins[0]?.[0] || '—';
      const bestPlayerWins = sortedWins[0]?.[1] || 0;

      const allScores = Object.values(gameScoresMap).flat();
      const avgScore =
        allScores.length > 0
          ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
          : 0;

      return {
        name: gameName,
        count: gameCountMap[gameName],
        bestPlayer,
        bestPlayerWins,
        bestScoreEntry,
        avgScore,
        playerRanking,
      };
    })
    .sort((a, b) => b.count - a.count);

  // Donut data
  const totalGames = filtered.length;
  const donutData: DonutSlice[] = Object.entries(gameCountMap)
    .map(([gameName, count]) => ({
      gameName,
      count,
      percentage: Math.round((count / totalGames) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const mostPlayedGame =
    Object.entries(gameCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const mostActivePlayer =
    Object.entries(playerGamesMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    totalGames,
    mostPlayedGame,
    mostActivePlayer,
    players,
    gameStats,
    donutData,
  };
}
