import { memoizedActivityInfoByActivityModel } from "@hooks/core/helpers/getActivityInfoByModelId";
import useSetOnceActivitiesForAllCampaigns from "@hooks/core/reduxSetOnce/useSetOnceActivitiesForCampaigns";
import { Campaign } from "@reducers/campaignReducer";
import { ProductList } from "@reducers/core/productReducer";
import { SiteList } from "@reducers/core/siteReducer";
import { RootState } from "@reducers/index";
import { useMemo } from "react";
import { useSelector } from "react-redux";

type Campaigns = {
  [key: number]: Campaign;
};

export interface AllActivityInfo {
  entriesNumber: number;
}

export interface AllActivityInfoByActivityModel {
  [key: number]: AllActivityInfo;
}

function getInitialAllActivityInfo(): AllActivityInfo {
  return {
    entriesNumber: 0,
  };
}

const useAllActivitiesNumberByActivityModel = (): AllActivityInfoByActivityModel => {
  useSetOnceActivitiesForAllCampaigns();
  const allCampaigns = useSelector<RootState, Campaigns>(
    state => state.campaign.campaigns
  );

  const sites = useSelector<RootState, SiteList>(
    state => state.core.site.siteList
  );
  const products = useSelector<RootState, ProductList>(
    state => state.core.product.productList
  );

  return useMemo(() => {
    const allActivities = Object.values(
      allCampaigns
    ).map((campaign: Campaign) =>
      memoizedActivityInfoByActivityModel(campaign.activities, sites, products)
    );
    return allActivities.reduce(
      (acc: AllActivityInfoByActivityModel, campaignActivities) => {
        for (let modelId in campaignActivities) {
          const activity = campaignActivities[modelId];
          if (acc[modelId] == null) {
            acc[modelId] = getInitialAllActivityInfo();
          }
          acc[modelId].entriesNumber += activity.nb;
        }
        return acc;
      },
      {}
    );
  }, [allCampaigns, sites, products]);
}

export default useAllActivitiesNumberByActivityModel;
