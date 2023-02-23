import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

function isEntryEntityInRecordOneAndNotInRecordTwo(
  recordOne: Record<number, true>,
  recordTwo: Record<number, true>,
  entityName: "siteId" | "productId"
) {
  return (entry: ActivityEntryExtended) => {
    const entityId = entry?.[entityName] ?? null;
    if (entityId == null) {
      return false;
    }
    return recordOne[entityId] && !recordTwo[entityId];
  };
}

type Params = {
  siteIdsOfCampaignOne: Record<number, true>;
  productIdsOfCampaignOne: Record<number, true>;
  siteIdsOfCampaignTwo: Record<number, true>;
  productIdsOfCampaignTwo: Record<number, true>;
};

function getEntryOldOrNewHelpers({
  siteIdsOfCampaignOne = {},
  siteIdsOfCampaignTwo = {},
  productIdsOfCampaignOne = {},
  productIdsOfCampaignTwo = {},
}: Params) {
  return {
    isEntrySiteOld: isEntryEntityInRecordOneAndNotInRecordTwo(
      siteIdsOfCampaignOne,
      siteIdsOfCampaignTwo,
      "siteId"
    ),
    isEntryProductOld: isEntryEntityInRecordOneAndNotInRecordTwo(
      productIdsOfCampaignOne,
      productIdsOfCampaignTwo,
      "productId"
    ),
    isEntrySiteNew: isEntryEntityInRecordOneAndNotInRecordTwo(
      siteIdsOfCampaignTwo,
      siteIdsOfCampaignOne,
      "siteId"
    ),
    isEntryProductNew: isEntryEntityInRecordOneAndNotInRecordTwo(
      productIdsOfCampaignTwo,
      productIdsOfCampaignOne,
      "productId"
    ),
  };
}

export default getEntryOldOrNewHelpers;
