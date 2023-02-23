import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import { EntryData } from "@reducers/entries/campaignEntriesReducer";
import { t } from "i18next";
import { upperFirst } from "lodash";

export function getEmissionFactorOrigin(entry: EntryData) {
  const fe = t("footprint.emission.unaffected").split(" ")
  .map((el) =>
    el === t("footprint.emission.emissionFactor.abbreviated")
      ? el.toUpperCase()
      : el
  )
  .join(" ");

  if (entry.computeMethodType === ComputeMethodType.STANDARD) {
    return entry.emissionFactor?.name ?? fe;
  }
  if (entry.computeMethodType === ComputeMethodType.CUSTOM_EMISSION_FACTOR) {
    return entry.customEmissionFactor?.name ?? fe;
  }
  return upperFirst(t("footprint.emission.manual"));
}
