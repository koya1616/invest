import { calculateEMA, calculateRCI, calculateRSI, calculateSma } from "../../lib/calculate";
import { describe, it, expect } from "vitest";

describe("calculateSma", () => {
  it("小数点を含まない場合、正常にSMAを計算できること", () => {
    const prices = [1, 2, 3, 4, 5];
    const period = 3;
    const result = calculateSma(prices, period);
    expect(result).toBe(4);
  });

  it("小数点を含む場合、正常にSMAを計算できること", () => {
    const prices = [1.5, 2.5, 3.5, 4.5, 5.5];
    const period = 3;
    const result = calculateSma(prices, period);
    expect(result).toBe(4.5);
  });

  it("配列の長さが期間より短い場合はnullを返すこと", () => {
    const prices = [1, 2];
    const period = 3;
    const result = calculateSma(prices, period);
    expect(result).toBeNull();
  });
});

describe("calculateRSI", () => {
  it("正しくRSIを計算できること", () => {
    const prices = [10, 12, 11, 13, 12, 14, 13, 15];
    const period = 7;
    expect(calculateRSI(prices, period)).toBeCloseTo(72.73, 2);
  });

  it("入力配列が期間より短い場合はnullを返すこと", () => {
    const prices = [10, 11, 12];
    const period = 3;
    expect(calculateRSI(prices, period)).toBeNull();
  });

  it("価格が一定の場合はRSIが50を返すこと", () => {
    const prices = [10, 10, 10, 10, 10];
    const period = 4;
    expect(calculateRSI(prices, period)).toBe(50);
  });

  it("常に上昇する場合はRSIが100を返すこと", () => {
    const prices = [10, 11, 12, 13, 14, 15];
    const period = 5;
    expect(calculateRSI(prices, period)).toBe(100);
  });

  it("常に下降する場合はRSIが0を返すこと", () => {
    const prices = [15, 14, 13, 12, 11, 10];
    const period = 5;
    expect(calculateRSI(prices, period)).toBe(0);
  });

  it("小数点を含む価格でも正しく計算できること", () => {
    const prices = [10.5, 11.2, 10.8, 11.5, 11.1];
    const period = 4;
    const rsi = calculateRSI(prices, period);
    expect(rsi).toBeDefined();
    expect(rsi).toBeCloseTo(63.64, 2);
  });
});

describe("calculateEMA", () => {
  it("正しくEMAを計算できること", () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const period = 5;
    expect(calculateEMA(data, period)).toBeCloseTo(8, 2);
  });

  it("データ配列の長さが期間と同じ場合：単純移動平均（SMA）を返す", () => {
    const data = [1, 2, 3, 4, 5];
    const period = 5;
    expect(calculateEMA(data, period)).toBe(3);
  });

  it("データ配列の長さが期間未満の場合：nullを返す", () => {
    const data = [1, 2, 3];
    const period = 5;
    expect(calculateEMA(data, period)).toBeNull();
  });
});

describe("calculateRCI", () => {
  it("正しくRCIを計算できること", () => {
    const data = [105, 102, 108, 103, 106];
    expect(calculateRCI(data, 5)).toBeCloseTo(30);
  });

  it("データの長さが期間より短い場合はnullを返すこと", () => {
    const data = [100, 110];
    expect(calculateRCI(data, 3)).toBeNull();
  });

  it("完全に上昇する場合は100を返すこと", () => {
    const data = [100, 110, 120, 130, 140];
    expect(calculateRCI(data, 5)).toBeCloseTo(100, 1);
  });

  it("完全に下降する場合は100を返すこと", () => {
    const data = [140, 130, 120, 110, 100];
    expect(calculateRCI(data, 5)).toBeCloseTo(-100, 1);
  });

  it("価格が一定の場合は50を返すこと", () => {
    const data = [100, 100, 100, 100, 100];
    expect(calculateRCI(data, 5)).toBeCloseTo(50, 1);
  });
});
