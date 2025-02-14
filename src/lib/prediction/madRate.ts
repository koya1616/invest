/**
 * ゴールデンクロスを判定する関数。
 *
 * @param shortMad - 5日移動平均線のデータ配列
 * @param longMad - 25日移動平均線のデータ配列
 * @returns ゴールデンクロスが発生した場合はtrue、そうでない場合はfalseを返します
 */
const isGoldenCross = (shortMad: number[], longMad: number[]): boolean => {
  return shortMad.slice(-2)[0] <= longMad.slice(-2)[0] && shortMad.slice(-1)[0] > longMad.slice(-1)[0];
};

/**
 * 与えられたMAD（移動平均乖離率）の配列を基に、売られ過ぎのリバウンドが発生しているかどうかを判定します。
 *
 * @param {number[]} mad - 移動平均乖離率の配列。配列の各要素は数値で、負の値は売られ過ぎを示します。
 * @returns {boolean} - 売られ過ぎのリバウンドが発生している場合はtrue、それ以外の場合はfalseを返します。
 *
 * @remarks
 * この関数は、直近5つの移動平均乖離率のうち、少なくとも1つが-3未満であるかどうかを確認します。
 * もし-3未満の値が存在し、かつ最新の移動平均乖離率が正の値であれば、売られ過ぎのリバウンドが発生していると判断します。
 */
const isOversoldRebound = (mad: number[]): boolean => {
  let hasOversold = false;
  for (let i = 1; i < 5; i++) {
    if (mad[i] < -3) {
      hasOversold = true;
      break;
    }
  }

  return hasOversold && mad.slice(-1)[0] > 0;
};

// MADのダイバージェンス判定
// 株価が安値更新しているのにMADが安値を更新していない場合に買いシグナル
/**
 * 短期移動平均乖離率（MAD）と価格のデータを基に、ポジティブダイバージェンスが発生しているかどうかを判定します。
 *
 * @param {number[]} mad - 短期移動平均乖離率の配列。最新の値が配列の最後に位置します。
 * @param {number[]} prices - 価格の配列。最新の価格が配列の最後に位置します。
 *
 * @returns {boolean} ポジティブダイバージェンスが発生している場合はtrue、そうでない場合はfalseを返します。
 *
 * @remarks
 * ポジティブダイバージェンスとは、価格が下落しているにもかかわらず、移動平均乖離率が上昇している状態を指します。
 * この関数では、以下の条件を満たす場合にポジティブダイバージェンスが発生していると判定します：
 * 1. 現在の価格が過去5期間の最小価格よりも低い。
 * 2. 現在の短期移動平均乖離率が過去5期間の最小値よりも高い。
 */
const isPositiveDivergence = (mad: number[], prices: number[]): boolean => {
  const currentPrice = prices.slice(-1)[0];
  const priceMin = Math.min(...prices.slice(-5));

  if (currentPrice > priceMin) return false;

  const currentMAD = mad.slice(-1)[0];
  const madMin = Math.min(...mad.slice(-5));

  return currentMAD > madMin;
};

export const checkBuySignalOfMadRate = (data: {
  shortMad: number[];
  longMad: number[];
  prices: number[];
}): boolean[] => {
  return [
    isGoldenCross(data.shortMad, data.longMad),
    isOversoldRebound(data.shortMad),
    isPositiveDivergence(data.shortMad, data.prices),
  ];
};
