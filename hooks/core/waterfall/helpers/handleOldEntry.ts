import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { WaterfallData } from "./waterfallData";

type Params = {
  entryOfCampaignOne: ActivityEntryExtended;
  isEntrySiteOld: (entry: ActivityEntryExtended) => boolean;
  isEntryProductOld: (entry: ActivityEntryExtended) => boolean;
  acc: WaterfallData;
};

function handleOldEntry({
  entryOfCampaignOne,
  isEntrySiteOld,
  isEntryProductOld,
  acc,
}: Params) {
  if (
    isEntrySiteOld(entryOfCampaignOne) &&
    isEntryProductOld(entryOfCampaignOne)
  ) {
    acc.oldSitesAndProducts += entryOfCampaignOne.resultTco2;
  } else if (isEntrySiteOld(entryOfCampaignOne)) {
    acc.oldSitesOnly += entryOfCampaignOne.resultTco2;
  } else if (isEntryProductOld(entryOfCampaignOne)) {
    acc.oldProductsOnly += entryOfCampaignOne.resultTco2;
  } else {
    acc.otherOldEntries += entryOfCampaignOne.resultTco2;
  }
}

export default handleOldEntry;
