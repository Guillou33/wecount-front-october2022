import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

export type ActivityEntriesByEntity = Record<number, ActivityEntryExtended[]>;

export function getEntryInfoByEntity(agregateOn: "siteId" | "productId" | "ownerId" | "writerId") {
  return (entries: ActivityEntryExtended[]) => {
    return entries.reduce((acc, entry) => {
      const entityId = entry[agregateOn] ?? -1;

      if (acc[entityId] == null) {
        acc[entityId] = [];
      }
      acc[entry[agregateOn] ?? -1].push(entry);

      return acc;
    }, {} as ActivityEntriesByEntity);
  };
}
