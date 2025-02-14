/**
 * ゴールデンクロスを判定する関数。
 * ゴールデンクロスとは、MACDラインがシグナルラインを下から上に突き抜ける現象を指します。
 *
 * @param {number[]} macd - MACDラインの値の配列。
 * @param {number[]} signal - シグナルラインの値の配列。
 * @returns {boolean} ゴールデンクロスが発生した場合はtrue、そうでない場合はfalseを返します。
 */
const isGoldenCross = (macd: number[], signal: number[]): boolean => {
  return macd.slice(-1)[0] > signal.slice(-1)[0] && macd.slice(-2)[0] <= signal.slice(-2)[0];
};

/**
 * MACD（移動平均収束拡散）の配列を受け取り、MACDがゼロを上回るクロスをしたかどうかを判定します。
 *
 * @param {number[]} macd - MACDの値の配列。配列の最後の要素が最新の値を示します。
 * @returns {boolean} - MACDがゼロを上回るクロスをした場合はtrue、それ以外の場合はfalseを返します。
 */
const isCrossAboveZero = (macd: number[]): boolean => {
  return macd.slice(-1)[0] > 0 && macd.slice(-2)[0] <= 0;
};

/**
 * MACDとシグナルの間の乖離が一定の閾値を超えているかどうかを判定します。
 *
 * @param {number[]} macd - MACDの値の配列。配列の最後の要素が最新の値と仮定します。
 * @param {number[]} signal - シグナルの値の配列。配列の最後の要素が最新の値と仮定します。
 * @returns {boolean} - MACDとシグナルの差が0.002を超えている場合はtrue、それ以外はfalseを返します。
 *
 * @remarks
 * MACDとシグナルの差が0.002を超えている場合、MACDとシグナルの乖離が広がっていると判断します。
 */
const isDivergenceWide = (macd: number[], signal: number[]): boolean => {
  return macd.slice(-1)[0] - signal.slice(-1)[0] > 1;
};

/**
 * MACDヒストグラムが増加しているかどうかを判定します。
 *
 * @param {number[]} macd - MACD値の配列。配列の最後の3つの要素が使用されます。
 * @param {number[]} signal - シグナルラインの値の配列。配列の最後の3つの要素が使用されます。
 * @returns {boolean} ヒストグラムが増加している場合はtrue、そうでない場合はfalseを返します。
 *
 * @remarks
 * この関数は、MACDとシグナルラインの差であるヒストグラムの値を計算し、
 * 直近3つのヒストグラムの値が連続して増加しているかどうかを判定します。
 * ヒストグラムの値は、MACD値からシグナルラインの値を引いたものです。
 */
const isHistogramIncreasing = (macd: number[], signal: number[]): boolean => {
  const histogram1 = macd.slice(-1)[0] - signal.slice(-1)[0];
  const histogram2 = macd.slice(-2)[0] - signal.slice(-2)[0];
  const histogram3 = macd.slice(-3)[0] - signal.slice(-3)[0];
  return histogram1 > histogram2 && histogram2 > histogram3;
};

export const checkBuySignalOfMacd = (data: { macd: number[]; signal: number[] }): boolean[] => {
  return [
    isGoldenCross(data.macd, data.signal),
    isCrossAboveZero(data.macd),
    isDivergenceWide(data.macd, data.signal),
    isHistogramIncreasing(data.macd, data.signal),
  ];
};
