import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { roundValue } from "@lib/utils/calculator";

export const getEmissionNumbers = (tco2: number): number => {
  const roundedTco2 = roundValue(tco2);
  return roundedTco2;
};

export function wecountFormat(value: number): string {
  if (value > -0.01 && value < 0) {
    return `>${formatNumberWithLanguage(-0.01)}`;
  }
  if (value > 0 && value < 0.01) {
    return `<${formatNumberWithLanguage(0.01)}`;
  }
  return formatNumberWithLanguage(roundValue(value));
}

export function reformatConvertToTons(tco2: number): string {
  const divided = tco2 / 1000;
  return wecountFormat(divided);
}

export function formatPercentageDisplay(tco2: number, total: number): string {
  if (total === 0) {
    return "0";
  }
  const percentage = (tco2 / total) * 100;
  return wecountFormat(percentage);
}
