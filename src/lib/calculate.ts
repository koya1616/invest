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
 * 指定された期間のRCI（Rank Correlation Index）を計算します。
 *
 * @param {number[]} close - 終値の配列。計算に使用する価格データ。
 * @param {number} period - RCIを計算する期間。期間内のデータ数が必要です。
 * @returns {number | null} - 計算されたRCI値。期間内のデータ数が不足している場合はnullを返します。
 *
 * @remarks
 * RCIは、価格の順位相関を基にしたテクニカル指標です。RCIの値は-100から100の範囲で変動し、値が高いほど価格が上昇傾向にあり、値が低いほど価格が下降傾向にあることを示します。
 */
export const calculateRCI = (close: number[], period: number): number | null => {
  if (close.length < period) return null;

  const prices = close.slice(-period);
  const priceRanks: number[] = [];
  const sortedPrices = [...prices].sort((a, b) => a - b);

  for (const price of prices) {
    const index = sortedPrices.indexOf(price);
    let rank = index + 1;

    const sameValues = sortedPrices.filter((p) => p === price);
    if (sameValues.length > 1) {
      rank = index + (sameValues.length + 1) / 2;
    }

    priceRanks.push(rank);
  }

  const d2Sum = Array.from({ length: period }, (_, i) => i + 1).reduce((sum, timeRank, i) => {
    const diff = timeRank - priceRanks[i];
    return sum + diff * diff;
  }, 0);

  const rci = (1 - (6 * d2Sum) / (period * (period * period - 1))) * 100;

  return Math.round(rci * 100) / 100;
};
