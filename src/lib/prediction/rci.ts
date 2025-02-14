import { calculateLowerBand } from "../calculate";

/**
 * 与えられたRCI（Rank Correlation Index）の配列から、RCIクロスオーバー買いシグナルが発生したかどうかを判定します。
 *
 * @param rci - RCIの数値配列。配列の最後の2つの値を使用して判定します。
 * @returns boolean - 買いシグナルが発生した場合はtrue、そうでない場合はfalseを返します。
 *
 * @remarks
 * 買いシグナルは、前回のRCI値が-80未満であり、今回のRCI値が-80を超えた場合に発生します。
 * これは、RCIが極端な売られ過ぎの状態から回復し始めたことを示唆します。
 */
const isRCICrossoverBuySignal = (rci: number[]): boolean => {
  const current = rci.slice(-1)[0];
  const previous = rci.slice(-2)[0];
  return previous < -80 && current > -80;
};

/**
 * 与えられたRCI（Rank Correlation Index）の配列からダブルボトム買いシグナルを検出します。
 *
 * ダブルボトム買いシグナルは、以下の条件を満たす場合に発生します:
 * 1. 直近の4つのRCI値のうち3つが-80以下であること。
 * 2. 直近のRCI値が-80以下から-80以上にクロスすること。
 *
 * @param {number[]} rci - RCI値の配列。配列の最後の要素が最新のRCI値を表します。
 * @returns {boolean} ダブルボトム買いシグナルが発生した場合はtrue、そうでない場合はfalseを返します。
 */
const isRCIDoubleBottomBuySignal = (rci: number[]): boolean => {
  const current = rci.slice(-1)[0];
  const previous = rci.slice(-2)[0];
  const twoBack = rci.slice(-3)[0];
  const threeBack = rci.slice(-4)[0];

  const hasDoubleBottom = (threeBack < -80 && twoBack < -80) || (twoBack < -80 && previous < -80);
  const crossesAbove = previous < -80 && current > -80;

  return hasDoubleBottom && crossesAbove;
};

/**
 * RCIとボリンジャーバンドを使用して買いシグナルを判定します。
 *
 * @param rci - RCI（Rank Correlation Index）の値の配列。最新の値は配列の最後に位置します。
 * @param price - 現在の価格。
 * @param lowerBand - ボリンジャーバンドの下限値。
 * @returns boolean - 買いシグナルが発生している場合はtrue、それ以外の場合はfalseを返します。
 *
 * @remarks
 * この関数は、RCIが-80未満であり、かつ価格がボリンジャーバンドの下限値を下回っている場合に買いシグナルを返します。
 */
const isRCIBollingerBuySignal = (rci: number[], price: number, lowerBand: number): boolean => {
  const current = rci.slice(-1)[0];
  return current < -80 && price < lowerBand;
};

/**
 * RCI（Rank Correlation Index）と価格の動向を基に買いシグナルを判定する関数。
 *
 * この関数は、価格が下落トレンドにあり、かつRCIが上昇トレンドにある場合に
 * 買いシグナルを返します。具体的には、以下の条件を満たす場合にtrueを返します：
 *
 * 1. 価格が連続して3期間下落していること。
 * 2. RCIが連続して3期間上昇していること。
 * 3. 現在のRCIが-60未満であること。
 *
 * @param rci - RCIの値を格納した配列。少なくとも3つの要素が必要です。
 * @param prices - 価格の値を格納した配列。少なくとも3つの要素が必要です。
 * @returns 買いシグナルが発生する場合はtrue、それ以外の場合はfalseを返します。
 */
const isRCIDivergenceBuySignal = (rci: number[], prices: number[]): boolean => {
  if (rci.length < 3 || prices.length < 3) return false;

  const currentRCI = rci.slice(-1)[0];
  const previousRCI = rci.slice(-2)[0];
  const twoBackRCI = rci.slice(-3)[0];

  const currentPrice = prices.slice(-1)[0];
  const previousPrice = prices.slice(-2)[0];
  const twoBackPrice = prices.slice(-3)[0];

  const priceDowntrend = currentPrice < previousPrice && previousPrice < twoBackPrice;
  const rciUptrend = currentRCI > previousRCI && previousRCI > twoBackRCI;

  return priceDowntrend && rciUptrend && currentRCI < -60;
};

export const checkBuySignalOfRci = (data: { rci: number[]; prices: number[] }): boolean[] => {
  const { rci, prices } = data;
  return [
    isRCICrossoverBuySignal(data.rci),
    isRCIDoubleBottomBuySignal(data.rci),
    isRCIBollingerBuySignal(rci, prices[prices.length - 1], calculateLowerBand(prices, 10, 2)),
    isRCIDivergenceBuySignal(rci, prices),
  ];
};
