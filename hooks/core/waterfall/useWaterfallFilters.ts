import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";

import getWaterfallFilters, {
  WaterfallFilters,
} from "@hooks/core/waterfall/helpers/getWaterfallFilters";

import selectSitesUsedByCampaigns from "@selectors/sites/selectSitesUsedByCampaigns";
import selectProductsUsedByCampaigns from "@selectors/products/selectProductsUsedByCampaigns";

function useWaterfallFilters(campaignIds: [number, number]): WaterfallFilters {
  const sitesUsedByCampaigns = useSelector((state: RootState) =>
    selectSitesUsedByCampaigns(state, campaignIds)
  );
  const productsUsedByCampaigns = useSelector((state: RootState) =>
    selectProductsUsedByCampaigns(state, campaignIds)
  );

  return getWaterfallFilters({
    campaignIds,
    sitesUsedByCampaigns,
    productsUsedByCampaigns,
  });
}

export default useWaterfallFilters;
