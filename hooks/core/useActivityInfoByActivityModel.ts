import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { Activity } from "@reducers/campaignReducer";
import { memoizedActivityInfoByActivityModel } from '@hooks/core/helpers/getActivityInfoByModelId';
import { ActivityInfo } from '@hooks/core/helpers/activityInfo';
import { SiteList } from "@reducers/core/siteReducer";
import { ProductList } from "@reducers/core/productReducer";
import _ from "lodash";

export interface ActivityInfoByActivityModel {
  [key: number]: ActivityInfo;
}

const useActivityInfoByActivityModel = (
  campaignId: number
): ActivityInfoByActivityModel => {
  const activities = useSelector<
    RootState,
    { [key: number]: Activity } | undefined
  >((state) => state.campaign.campaigns[campaignId]?.activities);

  const sites = useSelector<RootState, SiteList>(
    state => state.core.site.siteList
  );
  const products = useSelector<RootState, ProductList>(
    state => state.core.product.productList
  );

  return memoizedActivityInfoByActivityModel(activities, sites, products);
};

export default useActivityInfoByActivityModel;
