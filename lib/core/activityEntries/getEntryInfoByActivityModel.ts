import { memoize } from "lodash";

import {
  getActivityEntryInfo,
  getEntryInfoSum,
  getInitialEntryInfo,
  EntryInfo,
} from "./entryInfo";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

export type EntryInfoByActivityModel = Record<number, EntryInfo>;

export function getEntryInfoByActivityModel(
  entries: ActivityEntryExtended[]
): EntryInfoByActivityModel {
  return entries.reduce((acc, entry) => {
    const entryInfo = getActivityEntryInfo(entry);
    if (acc[entry.activityModelId] == null) {
      acc[entry.activityModelId] = getInitialEntryInfo();
    }
    acc[entry.activityModelId] = getEntryInfoSum(
      acc[entry.activityModelId],
      entryInfo
    );
    return acc;
  }, {} as EntryInfoByActivityModel);
}

const memoizedEntryInfoByActivityModel = memoize(getEntryInfoByActivityModel);

export default memoizedEntryInfoByActivityModel;
