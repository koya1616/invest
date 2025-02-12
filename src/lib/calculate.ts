/**
 * 単純移動平均（SMA: Simple Moving Average）を計算します。
 * SMAは、過去の価格データの平均値を取ることで、価格のトレンドを把握するために使用されます。
 *
 * 計算式:
 * SMA = (データ1 + データ2 + ... + データN) / N
 * ここで N は期間を表します。
 *
 * @param prices - 時系列順の価格データ配列
 * @param period - SMA計算の対象期間
 * @returns
 * - SMA値
 * - 入力配列の長さが指定期間より短い場合は null
 */
export const calculateSma = (prices: number[], period: number): number | null => {
  if (prices.length < period) return null;
  return prices.slice(-period).reduce((acc, current) => acc + current, 0) / period;
};

/**
 * 指定された期間の相対力指数 (RSI: Relative Strength Index) を計算します。
 * RSIは、過去の価格変動における上昇の大きさと下降の大きさを比較し、
 * 相場の勢いを0から100の間の数値で表します。
 *
 * 計算式:
 * - RSI = 100 - 100 / (1 + RS)
 * - RS = 平均上昇幅 / 平均下降幅
 * - 平均上昇幅 = (期間内の上昇幅の合計) / 期間
 * - 平均下降幅 = (期間内の下降幅の合計) / 期間
 *
 * @param prices - 時系列順の価格データ配列
 * @param period - RSI計算の対象期間
 * @returns
 * - RSI値 (0-100の範囲)
 * - 入力配列の長さが指定期間より短い場合は null
 */
export const calculateRSI = (prices: number[], period: number): number | null => {
  if (prices.length < period + 1) return null;

  const changes = prices
    .slice(-period - 1)
    .map((price, i, arr) => (i === 0 ? 0 : price - arr[i - 1]))
    .slice(1);

  const gains = changes.map((change) => (change > 0 ? change : 0));
  const losses = changes.map((change) => (change < 0 ? -change : 0));

  const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
  const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;

  if (avgGain === 0 && avgLoss === 0) return 50;
  if (avgLoss === 0) return 100;

  return 100 - 100 / (1 + avgGain / avgLoss);
};

/**
 * 指数移動平均（EMA: Exponential Moving Average）を計算します。
 *
 * この関数は、与えられたデータ配列と期間に基づいて指数移動平均を計算します。
 * 計算には以下の手順が含まれます：
 * 1. 初期EMAとして、指定された期間の単純移動平均（SMA）を使用します。
 *    - SMA = (データ1 + データ2 + ... + データN) / N
 *      （ここで N は期間）
 * 2. 残りのデータに対して逐次的にEMAを計算します。
 *    - EMA_今日 = (終値_今日 - EMA_前日) × 平滑化係数 + EMA_前日
 *    - 平滑化係数 = 2 / (期間 + 1)
 *
 * @param data - 数値データの配列。終値などの時系列データを想定しています。
 * @param period - EMAを計算するための期間（例：5日間、12日間など）。
 *                データ配列の長さはこの期間以上である必要があります。
 *
 * @returns 最後の計算されたEMA値を返します。
 *          データ配列の長さが期間と同じ場合は初期EMA（SMA）が返されます。
 *          データ配列の長さが期間未満の場合は null が返されます。
 */
export const calculateEMA = (data: number[], period: number): number | null => {
  if (data.length < period) return null;
  const smoothingFactor = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  for (let i = period; i < data.length; i++) {
    ema = (data[i] - ema) * smoothingFactor + ema;
  }
  return ema;
};

/**
 * RCI（Rank Correlation Index）を計算する関数。
 *
 * この関数は、指定された期間 (`period`) に基づいて株価データの終値と日付の順位相関を計算します。
 * RCI は、時系列データの順位に基づいて相関を測定する指標で、テクニカル分析で使用されます。
 *
 * 計算式:
 * RCI = 1 - (6 * Σ(d^2)) / (n * (n^2 - 1))
 * ここで、d は終値の順位と日付の順位の差を表し、n は期間を表します。
 *
 * @param data - 株価データの配列。各要素は以下のプロパティを持つオブジェクトです：
 *   - `timestamp`: タイムスタンプ（日付）。古い日付から新しい日付の順に並んでいることを前提とします。
 *   - `close`: 終値。
 * @param period - 計算に使用する期間（例：5日間、10日間など）。正の整数を指定してください。
 *
 * @returns 計算された RCI の値（%単位）。範囲は通常 -100 から 100 の間です。
 *          データが不十分な場合（`data.length < period`）、`null` を返します。
 */
export const calculateRCI = (data: { timestamp: number; close: number }[], period: number): number | null => {
  if (data.length < period) return null;

  const closeRanks = rank(data.slice(-period).map((d) => d.close));
  const timestampRanks = rank(data.slice(-period).map((d) => d.timestamp));

  let sumD2 = 0;
  for (let i = 0; i < period; i++) {
    const d = closeRanks[i] - timestampRanks[i];
    sumD2 += d * d;
  }

  return (1 - (6 * sumD2) / (period * (period ** 2 - 1))) * 100;
};

const rank = (arr: number[]): number[] => {
  const sortedIndices = arr
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .map((item) => item.index);

  const ranks = Array(arr.length).fill(0);
  sortedIndices.forEach((index, rank) => {
    ranks[index] = rank + 1;
  });

  return ranks;
};
