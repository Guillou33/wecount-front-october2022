import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { WaterfallData } from "./waterfallData";

type Params = {
  entryOfCampaignTwo: ActivityEntryExtended;
  isEntrySiteNew: (entry: ActivityEntryExtended) => boolean;
  isEntryProductNew: (entry: ActivityEntryExtended) => boolean;
  acc: WaterfallData;
};

function handleNewEntry({
  entryOfCampaignTwo,
  isEntrySiteNew,
  isEntryProductNew,
  acc,
}: Params) {
  if (
    isEntrySiteNew(entryOfCampaignTwo) &&
    isEntryProductNew(entryOfCampaignTwo)
  ) {
    acc.newSitesAndProducts += entryOfCampaignTwo.resultTco2;
  } else if (isEntrySiteNew(entryOfCampaignTwo)) {
    acc.newSitesOnly += entryOfCampaignTwo.resultTco2;
  } else if (isEntryProductNew(entryOfCampaignTwo)) {
    acc.newProductsOnly += entryOfCampaignTwo.resultTco2;
  } else {
    acc.otherNewEntries += entryOfCampaignTwo.resultTco2;
  }
}

export default handleNewEntry;
