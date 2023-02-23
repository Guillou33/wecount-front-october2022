import { formatNumberWithLanguage } from "@lib/translation/config/numbers";

export function reformatReduction(value: number): string {
    const reduction = (Math.abs(value) > 100 && value < 0) ? 100 : Math.abs(value);
    const reformatted = formatNumberWithLanguage(reduction);
    return reformatted;
  }