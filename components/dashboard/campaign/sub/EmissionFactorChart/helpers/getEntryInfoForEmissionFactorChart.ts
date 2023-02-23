import { memoize } from "lodash";

import {
  EntryInfoForEmissionFactorChart,
  getEmissionFactorEntryInfoFromEntry,
  getManualEntryInfoFromEntry,
  isManualEntry,
  getSumOfEntryInfoForEmissionFactorChart,
} from "./entryInfoForEmissionFactorChart";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { Color, getPalette } from "@lib/utils/hashColor";
import mapObject from "@lib/utils/mapObject";
import { arrayProjection } from "@lib/utils/arrayProjection";


const palette= [...getPalette(Color.EMISSION_BLUE)].reverse()


function getEntryInfoForEmissionFactorChart(
  entries: ActivityEntryExtended[]
): Record<string, EntryInfoForEmissionFactorChart & {colors: Record<number, string>}> {
  const entryInfos= entries.reduce((acc, entry) => {
    const key = isManualEntry(entry)
      ? "manual-" + entry.activityModelId
      : entry.emissionFactorId;
    const getEntryInfoFromEntry = isManualEntry(entry)
      ? getManualEntryInfoFromEntry
      : getEmissionFactorEntryInfoFromEntry;

    if (key != null) {
      if (acc[key] == null) {
        acc[key] = getEntryInfoFromEntry(entry);
      } else {
        acc[key] = getSumOfEntryInfoForEmissionFactorChart(
          acc[key],
          getEntryInfoFromEntry(entry)
        );
      }
    }
    return acc;
  }, {} as Record<string, EntryInfoForEmissionFactorChart>);

return mapObject(entryInfos, entryInfo=>{
  return{
    ...entryInfo,
    entries: entryInfo.entries.sort(
      (entryA, entryB) => entryB.resultTco2 - entryA.resultTco2

    ),
    colors: arrayProjection(
      entryInfo.entries.map(e => e.id ?? -1),
      palette
    )
  }
})
}

export default memoize(getEntryInfoForEmissionFactorChart);
