import { EntryInfo } from "@lib/core/activityEntries/entryInfo";

export type Result = { id: number; value: number }
export type ResultDiff = Record<number, Result>;

function getCampaignResultsDiff(
  entryInfoA: Record<number, EntryInfo>,
  entryInfoB: Record<number, EntryInfo>
): ResultDiff {
  return Object.entries(entryInfoA).reduce((resultDiff, [id, entryInfo]) => {
    const tco2OfEntryInfoA = entryInfo.tCo2 ?? 0;
    const tco2OfEntryInfoB = entryInfoB[Number(id)].tCo2 ?? 0;

    if (entryInfo.nb > 0 || entryInfoB[Number(id)]?.tCo2 > 0) {
      resultDiff[Number(id)] = {
        id: Number(id),
        value: tco2OfEntryInfoB - tco2OfEntryInfoA,
      };
    }
    return resultDiff;
  }, {} as ResultDiff);
}

export default getCampaignResultsDiff;
