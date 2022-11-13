import { describe, it, expect } from "vitest";
import { divideNumber } from "@/util/number";
describe("util number", () => {
  it("divideNumber", () => {
    expect(divideNumber(100, 3)).toEqual([33, 33, 34]);

    expect(() => divideNumber(0.01, 3)).toThrowError(
      `平分后最多只能处理小数点后两位的数`
    );

    expect(divideNumber(0.1, 3)).toEqual([0.03, 0.03, 0.04]);

    expect(divideNumber(0.01, 1)).toEqual([0.01]);
  });
});
