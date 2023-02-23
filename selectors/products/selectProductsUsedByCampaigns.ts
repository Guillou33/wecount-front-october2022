import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";

export type ProductIdsByCampaignIds = Record<number, Record<number, true>>;

const selectProductsUsedByCampaigns = createSelector(
  [
    (_: RootState, campaignIds: number[]) => campaignIds,
    (state: RootState) => state.core.product.productList,
    selectActivityEntriesOfCampaignIdList,
  ],
  (campaignIds, allProducts, entriesBycampaignId): ProductIdsByCampaignIds => {
    return campaignIds.reduce((acc, campaignId) => {
      if (acc[campaignId] == null) {
        acc[campaignId] = {};
      }
      entriesBycampaignId[campaignId]?.reduce((acc, entry) => {
        const entryProductId = entry.productId;
        if (
          entryProductId != null &&
          allProducts[entryProductId]?.archivedDate === null
        ) {
          acc[entryProductId] = true;
        }
        return acc;
      }, acc[campaignId]);
      return acc;
    }, {} as ProductIdsByCampaignIds);
  }
);

export default selectProductsUsedByCampaigns;
