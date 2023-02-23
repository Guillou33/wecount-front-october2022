import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

type EntryData = {
  value1: number | null;
  unit1: string;
  value2: number | null;
  unit2: string;
  resultTco2: number | null;
};

function getEntryData(entry: ActivityEntryExtended | null): EntryData {
  return {
    value1: entry?.value ?? null,
    unit1: entry?.emissionFactor?.input1Unit ?? entry?.input1Unit ?? "",
    value2: entry?.value2 ?? null,
    unit2: entry?.emissionFactor?.input2Unit ?? entry?.input2Unit ?? "",
    resultTco2: entry?.resultTco2 ?? null,
  };
}

export default getEntryData;
