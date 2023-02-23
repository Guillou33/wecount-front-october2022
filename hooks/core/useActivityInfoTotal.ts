import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { Activity } from "@reducers/campaignReducer";
import { ActivityInfo } from "@hooks/core/helpers/activityInfo";
import { getNewMemoizedActivityInfoTotal } from "@hooks/core/helpers/getActivityInfoTotal";
import { CategoryList } from "@reducers/core/categoryReducer";
import _ from "lodash";
import { SiteList } from "@reducers/core/siteReducer";
import { ProductList } from "@reducers/core/productReducer";

const useActivityInfoTotal = (campaignId: number): ActivityInfo => {
  const activities = useSelector<
    RootState,
    { [key: number]: Activity } | undefined
  >(state => state.campaign.campaigns[campaignId]?.activities);
  const categoryList = useSelector<RootState, CategoryList>(
    state => state.core.category.categoryList
  );
  const sites = useSelector<RootState, SiteList>(
    state => state.core.site.siteList
  );
  const products = useSelector<RootState, ProductList>(
    state => state.core.product.productList
  );

  return memoizedInstanceByCampaignId(campaignId).execute(
    categoryList,
    activities,
    sites,
    products
  );
};

const getInstanceByCampaignId = (campaignId: number) => {
  return getNewMemoizedActivityInfoTotal();
};

const memoizedInstanceByCampaignId = _.memoize(getInstanceByCampaignId);

export default useActivityInfoTotal;
