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
