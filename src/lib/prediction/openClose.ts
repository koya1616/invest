/**
 * 連続した上昇をチェックする関数。
 *
 * @param {number[]} closes - 終値の配列。
 * @param {number} period - チェックする期間の長さ。
 * @returns {boolean} 指定された期間内に連続して上昇しているかどうかを示すブール値。
 *
 * @remarks
 * この関数は、指定された期間内で連続して終値が上昇しているかどうかを確認します。
 * 例えば、`period` が 3 の場合、3 日間連続で終値が前日よりも高い場合に `true` を返します。
 */
const checkConsecutiveRise = (closes: number[], period: number): boolean => {
  if (closes.length < period) return false;

  let upCount = 0;
  for (let i = 1; i < period; i++) {
    if (closes[i] > closes[i - 1]) upCount++;
  }

  return upCount >= period - 1;
};

/**
 * 指定された期間の移動平均線（MA）を基に、最新の終値が移動平均線を上回っているかどうかをチェックします。
 *
 * @param opens - 開始価格の配列。配列の長さは `period` 以上である必要があります。
 * @param closes - 終値の配列。配列の長さは `period` 以上である必要があります。
 * @param period - 移動平均線を計算する期間。
 * @returns 最新の終値が移動平均線を上回っている場合は `true`、そうでない場合は `false` を返します。入力配列の長さが `period` 未満の場合も `false` を返します。
 */
const checkMACross = (opens: number[], closes: number[], period: number): boolean => {
  if (opens.length < period || closes.length < period) return false;

  const openMA = opens.slice(-period).reduce((sum, val) => sum + val, 0) / period;
  return closes[closes.length - 1] > openMA;
};

/**
 * 指定された期間内のクローズ価格の範囲をチェックし、最新のクローズ価格がその期間内の最高値を上回っているかどうかを判定します。
 *
 * @param closes - クローズ価格の配列。
 * @param period - チェックする期間の長さ。
 * @returns 最新のクローズ価格が指定された期間内の最高値を上回っている場合はtrue、それ以外の場合はfalseを返します。
 */
const checkRangeBreak = (closes: number[], period: number): boolean => {
  if (closes.length < period) return false;

  const prevHigh = Math.max(...closes.slice(-period, -1));
  return closes[closes.length - 1] > prevHigh;
};

export const checkBuySignalOfOpenClose = (data: { opens: number[]; closes: number[] }, period: number): boolean[] => {
  return [
    checkConsecutiveRise(data.closes, period),
    checkMACross(data.opens, data.closes, period),
    checkRangeBreak(data.closes, period),
  ];
};
