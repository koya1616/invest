export const calculateAverage = (numbers: number[], period: number) => {
  if (numbers.length !== period) return null;
  return numbers.reduce((acc, current) => acc + current, 0) / period;
};

/**
 * 指定された期間の相対力指数 (RSI: Relative Strength Index) を計算します。
 * RSIは、過去の価格変動における上昇の大きさと下降の大きさを比較し、
 * 相場の勢いを0から100の間の数値で表します。
 *
 * 計算式:
 * RSI = 100 - (100 / (1 + RS))
 * RS = 平均上昇幅 / 平均下落幅
 * 平均上昇幅 = 期間中の上昇幅の合計 / 期間
 * 平均下落幅 = 期間中の下落幅の合計 / 期間
 *
 * @param prices - 時系列順の価格データ配列
 * @param period - RSI計算の対象期間
 * @returns
 * - RSI値 (0-100の範囲)
 * - 入力配列の長さが指定期間と一致しない場合は null
 */
export const calculateRSI = (prices: number[], period: number): number | null => {
  if (prices.length !== period + 1) return null;

  const changes = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = changes.map((change) => (change > 0 ? change : 0));
  const losses = changes.map((change) => (change < 0 ? -change : 0));

  const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
  const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;

  return avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
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
