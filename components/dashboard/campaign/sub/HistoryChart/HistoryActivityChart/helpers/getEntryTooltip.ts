import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

function getEntryTooltip(entry: ActivityEntryExtended | undefined): string[] {
  if (entry == null) {
    return [];
  }
  if (
    entry.computeMethodType === ComputeMethodType.RAW_DATA ||
    entry.computeMethodType === ComputeMethodType.DEPRECATED_EMISSION_FACTOR
  ) {
    return ["Saisie manuelle"];
  }
  const emissionFactor = entry.emissionFactor;
  const formattedEmissionFactor =
    emissionFactor != null
      ? [emissionFactor.name, `${emissionFactor.value} ${emissionFactor.unit}`]
      : [];

  const input1 = `${entry.value ?? 0} ${
    entry?.emissionFactor?.input1Unit ?? ""
  }`;
  const input2 =
    entry.value2 != null
      ? `${entry.value2} ${entry?.emissionFactor?.input2Unit ?? ""}`
      : null;

  const inputs = input2 != null ? `${input1} et ${input2}` : input1;

  return [...formattedEmissionFactor, inputs];
}

export default getEntryTooltip;
