import { memoize } from "lodash";

import {
  getActivityEntryInfo,
  getEntryInfoSum,
  getInitialEntryInfo,
  EntryInfo,
} from "./entryInfo";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

export type EntryInfoBySite = Record<number, EntryInfo>;

export function getEntryInfoBySite(
  entries: ActivityEntryExtended[]
): EntryInfoBySite {
  return entries.reduce((acc, entry) => {
    const entryInfo = getActivityEntryInfo(entry);
    if (acc[entry.siteId ?? -1] == null) {
      acc[entry.siteId ?? -1] = getInitialEntryInfo();
    }
    acc[entry.siteId ?? -1] = getEntryInfoSum(
      acc[entry.siteId ?? -1],
      entryInfo
    );
    return acc;
  }, {} as EntryInfoBySite);
}

const memoizedEntryInfoBySite = memoize(getEntryInfoBySite);

export default memoizedEntryInfoBySite;
