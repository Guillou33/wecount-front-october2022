import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

export type CampaignsYearSpan = {
  start: number;
  end: number;
  campaignIdsByYear: Record<number, number>;
};

function getInitialYearSpan(): CampaignsYearSpan {
  return {
    start: Infinity,
    end: -Infinity,
    campaignIdsByYear: {},
  };
}

const selectCampaignsYearSpan = createSelector(
  [
    (state: RootState) => state.campaign.campaigns,
    (_: RootState, campaignIds: number[]) => campaignIds,
  ],
  (allCampaigns, campaignIds) => {
    const yearSpan = campaignIds.reduce((yearSpan, campaignId) => {
      const campaignYear = allCampaigns[campaignId]?.information?.year;
      if (campaignYear == null) {
        return yearSpan;
      }

      if (yearSpan.start > campaignYear) {
        yearSpan.start = campaignYear;
      }
      if (yearSpan.end < campaignYear) {
        yearSpan.end = campaignYear;
      }
      yearSpan.campaignIdsByYear[campaignYear] = campaignId;

      return yearSpan;
    }, getInitialYearSpan());

    if (!isFinite(yearSpan.start) || !isFinite(yearSpan.end)) {
      return null;
    }
    return yearSpan;
  }
);

export default selectCampaignsYearSpan;
