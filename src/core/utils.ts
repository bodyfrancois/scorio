export const sumArray = (arr: (number | null)[]) =>
  arr.reduce((a: number, b) => a + (b ?? 0), 0);

export const sortRankingAscending = (
  players: string[],
  totals: number[]
) => {
  return players
    .map((name, i) => ({
      name,
      score: totals[i],
    }))
    .sort((a, b) => a.score - b.score);
};

export const sortRankingDescending = (
  players: string[],
  totals: number[]
) => {
  return players
    .map((name, i) => ({
      name,
      score: totals[i],
    }))
    .sort((a, b) => b.score - a.score);
};