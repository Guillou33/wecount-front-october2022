import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { Activity } from "@reducers/campaignReducer";
import { getNewMemoizedActivityInfoByCategory, ActivityInfoByCategory } from '@hooks/core/helpers/getActivityInfoByCategory';
import { CategoryList } from "@reducers/core/categoryReducer";
import _ from "lodash";
import { SiteList } from "@reducers/core/siteReducer";
import { ProductList } from "@reducers/core/productReducer";

const useActivityInfoByCategory = (
  campaignId: number
): ActivityInfoByCategory => {
  const activities = useSelector<
    RootState,
    { [key: number]: Activity } | undefined
  >((state) => state.campaign.campaigns[campaignId]?.activities);
  const categoryList = useSelector<RootState, CategoryList>(
    (state) => state.core.category.categoryList
  );

  const sites = useSelector<RootState, SiteList>(
    state => state.core.site.siteList
  );
  const products = useSelector<RootState, ProductList>(
    state => state.core.product.productList
  );

  // Grâce à ce memoize, une seule instance par campaignId. 
  // On peut donc librement utiliser le Memoize derrière getNewMemoizedActivityInfoByCategory,qui n'a qu'un cache d'une entrée
  // (Sinon, à chaque changement de campagne (et donc d'arguments), il faudrait recompute)
  return memoizedInstanceByCampaignId(campaignId).execute(
    categoryList,
    activities,
    sites,
    products
  );
};

const getInstanceByCampaignId = (campaignId: number) => {
  return getNewMemoizedActivityInfoByCategory();
}

const memoizedInstanceByCampaignId = _.memoize(getInstanceByCampaignId);

export default useActivityInfoByCategory;
