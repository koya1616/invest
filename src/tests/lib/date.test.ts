import { formatDateTimeString } from "../../lib/date";
import { describe, it, expect } from "vitest";

describe("formatDateTimeString", () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  it("formatが'1'か'5'の場合、HH:MM形式の文字列が取得できること", () => {
    expect(formatDateTimeString(now, "1")).toBe(`${hours}:${minutes}`);
    expect(formatDateTimeString(now, "5")).toBe(`${hours}:${minutes}`);
  });

  it("formatが'1'か'5'以外の場合、HH:MM形式の文字列が取得できること", () => {
    expect(formatDateTimeString(now, "random")).toBe(`${month}/${day}`);
  });
});
