import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { Activity } from "@reducers/campaignReducer";
import {
  ActivityInfoByScope,
  getNewMemoizedActivityInfoByScope,
} from "@hooks/core/helpers/getActivityInfoByScope";
import { CategoryList } from "@reducers/core/categoryReducer";
import _ from "lodash";
import { SiteList } from "@reducers/core/siteReducer";
import { ProductList } from "@reducers/core/productReducer";

const useActivityInfoByScope = (campaignId: number): ActivityInfoByScope => {
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
  return getNewMemoizedActivityInfoByScope();
};

const memoizedInstanceByCampaignId = _.memoize(getInstanceByCampaignId);

export default useActivityInfoByScope;
