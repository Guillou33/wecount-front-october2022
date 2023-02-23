import { formatNumberWithLanguage } from "@lib/translation/config/numbers";

export function getEmissionFactorText(
  emissionFactor: number | null | undefined,
  unit: string | null | undefined
): string {
  if(emissionFactor == null){
    return "n/a";
  }
  return `${formatNumberWithLanguage(emissionFactor)}${unit ?? ""}`
}
