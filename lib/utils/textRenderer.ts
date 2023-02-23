import { t } from "i18next";

export function getPluralSelection(entryNumber: number) {
    const plural = entryNumber > 1;
    return plural ? t("entry.selection.multipleSelected") : t("entry.selection.oneSelected");
  }

export function getPluralForDataSelection(entryNumber: number) {
  const plural = entryNumber > 1;
  return plural ? t("entry.selection.multiple") : t("entry.selection.one");
}
