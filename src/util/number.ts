import Decimal from "decimal.js";

// 截断数字不四舍五入
export function trunc(number: number, sit: number) {
  const index = number.toString().indexOf(".");
  if (index === -1) {
    return number;
  }
  return Number(number.toString().slice(0, index + 1 + sit));
}

/**
 * @example
 * input: 100, 3
 * out: [33, 33, 34]
 * 最多只能处理小数点后两位的数
 */
export function divideNumber(number: number, per: number) {
  let mid = Number(trunc(Decimal.div(number, per).toNumber(), 2));
  if (mid === 0) {
    throw new Error("平分后最多只能处理小数点后两位的数");
  }
  if (mid > 1) {
    mid = Math.floor(mid);
  }
  const array: number[] = new Array(per - 1).fill(mid);
  array.push(Number(trunc(Decimal.sub(number, mid * (per - 1)).toNumber(), 2)));
  return array;
}
