import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";

import useArrayMemo from "@hooks/utils/useArrayMemo";
import getHistoryFromEntries from "@lib/core/campaignHistory/getHistoryFromEntries";
import {
  getSiteIdsOfEntryList,
  getProductIdsOfEntryList,
} from "./helpers/getEntityIdsOfEntryList";
import {
  WaterfallData,
  getInitialWaterfallData,
} from "./helpers/waterfallData";
import getEntryOldOrNewHelpers from "./helpers/getEntryOldOrNewHelpers";
import handleEntryEvolution from "./helpers/handleEntryEvolution";
import handleNewEntry from "./helpers/handleNewEntry";
import handleOldEntry from "./helpers/handleOldEntry";

import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";
import selectFilteredEntriesOfMultipleCampaignsForAnalysis from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForAnalysis";

function useWaterfallData(
  campaignOneId: number,
  campaignTwoId: number
): WaterfallData {
  const campaignIdList = useArrayMemo([campaignOneId, campaignTwoId]);

  const entriesOfCampaigns = useSelector((state: RootState) =>
    selectActivityEntriesOfCampaignIdList(state, campaignIdList)
  );

  const siteIdsOfCampaignOne = getSiteIdsOfEntryList(
    entriesOfCampaigns[campaignOneId]
  );
  const productIdsOfCampaignOne = getProductIdsOfEntryList(
    entriesOfCampaigns[campaignOneId]
  );
  const siteIdsOfCampaignTwo = getSiteIdsOfEntryList(
    entriesOfCampaigns[campaignTwoId]
  );
  const productIdsOfCampaignTwo = getProductIdsOfEntryList(
    entriesOfCampaigns[campaignTwoId]
  );

  const {
    isEntrySiteOld,
    isEntryProductOld,
    isEntrySiteNew,
    isEntryProductNew,
  } = getEntryOldOrNewHelpers({
    siteIdsOfCampaignOne,
    productIdsOfCampaignOne,
    siteIdsOfCampaignTwo,
    productIdsOfCampaignTwo,
  });

  const filteredEntriesOfCampaigns = useSelector((state: RootState) =>
    selectFilteredEntriesOfMultipleCampaignsForAnalysis(
      state,
      entriesOfCampaigns
    )
  );
  const comparisonHistory = getHistoryFromEntries(filteredEntriesOfCampaigns);

  return Object.values(comparisonHistory).reduce((acc, history) => {
    const entryOfCampaignOne = history.entriesBycampaignId[campaignOneId];
    const entryOfCampaignTwo = history.entriesBycampaignId[campaignTwoId];

    if (entryOfCampaignOne != null && entryOfCampaignTwo != null) {
      handleEntryEvolution({ entryOfCampaignOne, entryOfCampaignTwo, acc });
    } else if (entryOfCampaignOne == null && entryOfCampaignTwo != null) {
      handleNewEntry({
        entryOfCampaignTwo,
        isEntrySiteNew,
        isEntryProductNew,
        acc,
      });
    } else if (entryOfCampaignOne != null && entryOfCampaignTwo == null) {
      handleOldEntry({
        entryOfCampaignOne,
        isEntrySiteOld,
        isEntryProductOld,
        acc,
      });
    }
    return acc;
  }, getInitialWaterfallData());
}

export default useWaterfallData;
