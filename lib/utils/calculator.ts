/**
 * @description convert kilos to tons with a precision of 2 decimals
 */
export function convertToTons(kilos: number): number {
  const tons = kilos / 1000;
  return roundValue(tons);
}

export function roundValue(value: number):number {
  const absValue = Math.abs(value);
  if (absValue < 10) {
    return roundTwoDecimals(value);
  }
  if (absValue < 100) {
    return roundOneDecimal(value);
  }
  return Math.round(value);
}

/**
 *
 * @description take the total and returns a function which computes percentage against the total,
 * with a precision of 2 decimals
 */
export function percentageCalculator(total: number) {
  return (value: number) =>
    total !== 0 ? Math.round((value / total) * 100 * 100) / 100 : 0;
}

/**
 *
 * @description compute x percent of value
 */
export function getXPercentOf(x: number | null, value: number | null): number {
  return ((x ?? 0) / 100) * (value ?? 0);
}

function roundXDecimals(x: number) {
  const multipier = Math.pow(10, x);
  return (value: number) => Math.round(value * multipier) / multipier;
}

/**
 *
 * @description round value with a precision of 2 decimals
 */
export const roundTwoDecimals = roundXDecimals(2);

export const roundOneDecimal = roundXDecimals(1);

export function getVariationPercentage(
  startingValue: number,
  endValue: number
): number {
  if (startingValue === 0) {
    return 0;
  }
  return roundTwoDecimals(100 - percentageCalculator(startingValue)(endValue));
}

export function uncertaintyCalculator(
  emissionFactorUncertainty: number,
  activityUncertainty: number
): number {
  return Math.sqrt(
    Math.pow(emissionFactorUncertainty / 100, 2) +
      Math.pow(activityUncertainty, 2)
  );
}

export function dynamicRounding(value: number): number {
  if (value > 0.01) {
    return roundTwoDecimals(value);
  }
  const valueToString = value.toString();
  const decimals = valueToString.substr(2);
  let countZeros = 0;
  while (decimals[countZeros] === "0") {
    countZeros++;
  }
  const multiplier = Math.pow(10, countZeros + 2);
  return Math.round(value * multiplier) / multiplier;
}

export function parseAvoidingNaN(value: string): number | null {
  const parsed = parseFloat(value);
  return !isNaN(parsed) ? parsed : null;
}
