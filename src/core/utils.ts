export const sumArray = (arr: number[]) =>
  arr.reduce((a, b) => a + b, 0);

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