/**
 *  RSI（相対力指数）の配列を受け取り、オーバーソールドからの転換を検出します。
 *
 * @param rsi - RSI値の配列
 * @returns オーバーソールドからの転換が検出された場合はtrue、それ以外の場合はfalseを返します。
 */
const detectOversoldReversal = (rsi: number[]): boolean => {
  const latest = rsi.slice(-1)[0];
  const previous = rsi.slice(-2)[0];
  return previous <= 30 && latest > previous;
};

/**
 * RSI（相対力指数）の配列を受け取り、トレンドラインのブレイクを検出します。
 *
 * @param rsi - RSIの値の配列。配列の最後の5つの値を使用してトレンドラインのブレイクを検出します。
 * @returns トレンドラインのブレイクが検出された場合はtrue、それ以外の場合はfalseを返します。
 *
 * @remarks
 * この関数は、RSIの最後の5つの値をチェックし、最後の値が30を超えているかつ
 * それ以前の値が30未満である場合にトレンドラインのブレイクを検出します。
 */
const detectTrendlineBreak = (rsi: number[]): boolean => {
  const recentValues = rsi.slice(-5);
  const slopes: number[] = [];

  for (let i = 1; i < recentValues.length; i++) {
    slopes.push(recentValues[i] - recentValues[i - 1]);
  }

  const isBreakingUp = slopes[slopes.length - 1] > 0 && slopes.slice(0, -1).every((slope) => slope <= 0);

  return isBreakingUp && recentValues[recentValues.length - 1] > 30;
};

/**
 * RSIと価格の配列を使用して、ブルリッシュダイバージェンス（強気の逆行）のシグナルを検出します。
 *
 * @param rsi - RSI（相対力指数）の数値配列。
 * @param priceArray - 価格の数値配列。
 * @returns ブルリッシュダイバージェンスが検出された場合はtrue、それ以外の場合はfalseを返します。
 *
 * @remarks
 * この関数は、RSIの最後の5つの値と価格の最後の5つの値をチェックし、
 * 価格がRSIよりも低い値を持つ場合にブルリッシュダイバージェンスを検出します。
 */
const detectBullishDivergence = (rsi: number[], prices: number[]): boolean => {
  const last5RSI = rsi.slice(-5);
  const last5Prices = prices.slice(-5);

  const rsiLow1 = Math.min(...last5RSI.slice(0, 3));
  const rsiLow2 = Math.min(...last5RSI.slice(-3));
  const priceLow1 = Math.min(...last5Prices.slice(0, 3));
  const priceLow2 = Math.min(...last5Prices.slice(-3));

  return priceLow2 < priceLow1 && rsiLow2 > rsiLow1;
};

/**
 * RSIの配列からダブルボトムシグナルを検出します。
 *
 * @param rsi -
 *  - RSIの数値が格納された配列
 *  - 配列の最後の10個の値を使用してダブルボトムシグナルを検出します。
 * @returns ダブルボトムシグナルが検出された場合はtrue、それ以外の場合はfalseを返します。
 *
 * @remarks
 * この関数は、RSIの最近10個の値をチェックし、30未満の値で
 * かつ前後の値よりも低い値をボトムとして検出します。
 * ボトムが2つ以上検出された場合、その差が5未満であれば
 * ダブルボトムシグナルと判断し、シグナルの強度を計算します。
 */
const detectDoubleBottom = (rsi: number[]): boolean => {
  const recentValues = rsi.slice(-10);
  const bottoms: number[] = [];

  for (let i = 1; i < recentValues.length - 1; i++) {
    if (recentValues[i] < recentValues[i - 1] && recentValues[i] < recentValues[i + 1] && recentValues[i] < 30) {
      bottoms.push(recentValues[i]);
    }
  }

  if (bottoms.length >= 2) {
    const latestBottoms = bottoms.slice(-2);
    const bottomDiff = Math.abs(latestBottoms[0] - latestBottoms[1]);
    if (bottomDiff < 5) return true;
  }

  return false;
};

/**
 * RSI（相対力指数）の配列を解析し、サポートバウンスのシグナルを検出します。
 *
 * @param rsi -
 * - RSIの数値が格納された配列。
 * - 配列の最後の10個の値を使用してサポートバウンスのシグナルを検出します。
 * @returns サポートバウンスのシグナルが検出された場合はtrue、それ以外の場合はfalseを返します。
 *
 * @remarks
 * この関数は、RSIの最後の10個の値をチェックし、最小値をサポートとして検出します。
 * サポート値よりも2ポイント以上高い値でRSIが上昇した場合、サポートバウンスのシグナルが発生します。
 */
const detectSupportBounce = (rsi: number[]): boolean => {
  const support = Math.min(...rsi.slice(0, -2));
  const latest = rsi.slice(-1)[0];
  const previous = rsi.slice(-2)[0];
  return previous <= support + 2 && latest > previous;
};

/**
 * 与えられたRSI配列に基づいて移動平均線(MA)のクロスを検出します。
 *
 * @param rsi -
 * - RSI値の配列
 * - 配列は最低でも13個の要素を持つ必要があります
 * @returns クロスが検出された場合はtrue、それ以外の場合はfalseを返します。
 *
 * @remarks
 * - 5日間と13日間の移動平均線を計算し、クロスを検出します
 * - 5日間のMAが13日間のMAを下回り、次の日に5日間のMAが13日間のMAを上回った場合、シグナルが発生します
 */
const detectMACross = (rsi: number[]): boolean => {
  const ma5 = calculateMA(rsi, 5);
  const ma13 = calculateMA(rsi, 13);

  const previousMa5 = ma5.slice(-2)[0];
  const latestMa5 = ma5.slice(-1)[0];
  const previousMa13 = ma13.slice(-2)[0];
  const latestMa13 = ma13.slice(-1)[0];

  return previousMa5 <= previousMa13 && latestMa5 > latestMa13;
};

/**
 * 与えられたRSIと価格の配列から、買いシグナルが発生しているかどうかを判断します。
 *
 * @param rsi RSIの数値配列。30個以上の要素を持つ必要があります。
 * @param prices 価格の数値配列。30個以上の要素を持つ必要があります。
 *
 * @returns 買いシグナルが2つ以上検出された場合はtrue、それ以外の場合はfalseを返します。
 */
export const checkBuySignalOfRsi = (data: { rsi: number[]; prices: number[] }): boolean[] => {
  return [
    detectOversoldReversal(data.rsi),
    detectTrendlineBreak(data.rsi),
    detectBullishDivergence(data.rsi, data.prices),
    detectDoubleBottom(data.rsi),
    detectSupportBounce(data.rsi),
    detectMACross(data.rsi),
  ];
};

const calculateMA = (values: number[], period: number): number[] => {
  const ma: number[] = [];
  for (let i = period - 1; i < values.length; i++) {
    const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    ma.push(sum / period);
  }
  return ma;
};
