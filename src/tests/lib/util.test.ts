import { describe, it, expect } from "vitest";
import { formatNumber } from "../../lib/util";

describe("formatNumber", () => {
  it("「億」の桁の場合、数値を「億」としてフォーマットする", () => {
    expect(formatNumber(100000000)).toBe("1.0億");
    expect(formatNumber(110000000)).toBe("1.1億");
  });

  it("「万」の桁の場合、「万」としてフォーマットする", () => {
    expect(formatNumber(50000)).toBe("5.0万");
    expect(formatNumber(999999)).toBe("99.9万");
    expect(formatNumber(9999999)).toBe("999.9万");
    expect(formatNumber(99999999)).toBe("9999.9万");
  });

  it("「万」の桁以下の場合、数値をそのまま返す", () => {
    expect(formatNumber(9999)).toBe("9999");
  });
});
