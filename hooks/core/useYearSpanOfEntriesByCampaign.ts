import { useSelector } from "react-redux";
import { useMemo } from "react";

import { RootState } from "@reducers/index";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";

import selectCampaignsYearSpan from "@selectors/campaign/selectCampaignsYearSpan";

function useYearSpanOfEntriesByCampaign(entriesByCampaign: EntriesByCampaign) {
  const campaignIds = useMemo(
    () => Object.keys(entriesByCampaign).map(campaignId => Number(campaignId)),
    [entriesByCampaign]
  );
  return useSelector((state: RootState) =>
    selectCampaignsYearSpan(state, campaignIds)
  );
}

export default useYearSpanOfEntriesByCampaign;
