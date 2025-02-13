/**
 *  RSI（相対力指数）の配列を受け取り、オーバーソールドからの転換を検出します。
 *
 * @param rsi - RSI値の配列
 * @returns オーバーソールドからの転換が検出された場合はtrue、それ以外の場合はfalseを返します。
 */
const detectOversoldReversal = (rsi: number[]): boolean => {
  const latest = rsi[rsi.length - 1];
  const previous = rsi[rsi.length - 2];
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
 * - `support` は配列の最初の要素から最後の3つの要素を除いた範囲の最小値です。
 * - `latest` は配列の最後の要素です。
 * - `previous` は配列の最後から2番目の要素です。
 * - `previous` が `support + 2` 以下であり、かつ `latest` が `previous` より大きい場合、シグナルが検出されます。
 * - シグナルの強度は `(latest - previous) / 5` の最小値と1の最小値です。
 */
const detectSupportBounce = (rsi: number[]): boolean => {
  const support = Math.min(...rsi.slice(0, -3));
  const latest = rsi[rsi.length - 1];
  const previous = rsi[rsi.length - 2];
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
 * - シグナルの強さは、5日間のMAと13日間のMAの差を5で割った値と1の最小値です
 */
const detectMACross = (rsi: number[]): boolean => {
  const ma5 = calculateMA(rsi, 5);
  const ma13 = calculateMA(rsi, 13);

  const previousMa5 = ma5[ma5.length - 2];
  const latestMa5 = ma5[ma5.length - 1];
  const previousMa13 = ma13[ma13.length - 2];
  const latestMa13 = ma13[ma13.length - 1];

  return previousMa5 <= previousMa13 && latestMa5 > latestMa13;
};

/**
 * RSI配列からWボトムシグナルを検出します。
 *
 * @param rsi -
 * - RSI値の配列
 * - 配列は最低でも15個の要素を持つ必要があります
 * @returns Wボトムシグナルが検出された場合はtrue、それ以外の場合はfalseを返します。
 *
 * @remarks
 * この関数は、RSI配列の最後の15個の値をチェックし、Wボトムパターンを検出します。
 * Wボトムパターンは、2つの底値があり、2つ目の底値が1つ目の底値よりも高く、
 * かつその差が7未満である場合に検出されます。底値は30未満である必要があります。
 */
const detectWBottom = (rsi: number[]): boolean => {
  const recentValues = rsi.slice(-15);
  const bottoms: number[] = [];

  for (let i = 1; i < recentValues.length - 1; i++) {
    if (recentValues[i] < recentValues[i - 1] && recentValues[i] < recentValues[i + 1] && recentValues[i] < 30) {
      bottoms.push(recentValues[i]);
    }
  }

  return bottoms.length >= 2 && bottoms[1] > bottoms[0] && Math.abs(bottoms[1] - bottoms[0]) < 7;
};

/**
 * 与えられたRSIと価格の配列から、買いシグナルが発生しているかどうかを判断します。
 *
 * @param rsi RSIの数値配列。30個以上の要素を持つ必要があります。
 * @param prices 価格の数値配列。30個以上の要素を持つ必要があります。
 *
 * @returns 買いシグナルが2つ以上検出された場合はtrue、それ以外の場合はfalseを返します。
 */
export const checkBuySignalOfRsi = (data: { rsi: number[]; prices: number[] }): boolean => {
  const signals = [
    detectOversoldReversal(data.rsi),
    detectTrendlineBreak(data.rsi),
    detectBullishDivergence(data.rsi, data.prices),
    detectDoubleBottom(data.rsi),
    detectSupportBounce(data.rsi),
    detectMACross(data.rsi),
    detectWBottom(data.rsi),
  ];

  return signals.reduce((count, value) => (value ? count + 1 : count), 0) >= 2;
};

const calculateMA = (values: number[], period: number): number[] => {
  const ma: number[] = [];
  for (let i = period - 1; i < values.length; i++) {
    const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    ma.push(sum / period);
  }
  return ma;
};
