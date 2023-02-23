import { memoizedActivityInfoByActivityModel } from '@hooks/core/helpers/getActivityInfoByModelId';
import { ActivityInfo } from '@hooks/core/helpers/activityInfo';
import { getActivityInfoForActivityModelList } from '@hooks/core/helpers/getActivityInfoForActivityModelList';
import { CategoryList, ActivityCategory, ActivityModel } from "@reducers/core/categoryReducer";
import { Scope } from "@custom-types/wecount-api/activity";
import { Activity } from "@reducers/campaignReducer";
import Memoize from "@lib/utils/Memoize";
import { SiteList } from "@reducers/core/siteReducer";
import { ProductList } from "@reducers/core/productReducer";

export interface ActivityInfoByScope {
  [Scope.UPSTREAM]: ActivityInfo;
  [Scope.CORE]: ActivityInfo;
  [Scope.DOWNSTREAM]: ActivityInfo;
}

const getActivityInfoForScope = (scope: Scope, categoryList: CategoryList, activityInfoByModelId: {
  [key: number]: ActivityInfo;
}): ActivityInfo => {
  const categoriesUpstream = Object.values(categoryList[scope]);
  const modelList = categoriesUpstream.reduce((modelListTemp: ActivityModel[], category) => {
    return [...modelListTemp, ...category.activityModels];
  }, []);
  return getActivityInfoForActivityModelList(
    modelList,
    activityInfoByModelId
  );
}

export const getActivityInfoByScope = (
  categoryList: CategoryList,
  activities: { [key: number]: Activity } | undefined,
  sites: SiteList,
  products: ProductList,
): ActivityInfoByScope => {
  const activityInfoByModelId = memoizedActivityInfoByActivityModel(
    activities,
    sites,
    products
  );

  return {
    [Scope.UPSTREAM]: getActivityInfoForScope(Scope.UPSTREAM, categoryList, activityInfoByModelId),
    [Scope.CORE]: getActivityInfoForScope(Scope.CORE, categoryList, activityInfoByModelId),
    [Scope.DOWNSTREAM]: getActivityInfoForScope(Scope.DOWNSTREAM, categoryList, activityInfoByModelId),
  }
};

export const getNewMemoizedActivityInfoByScope = () => new Memoize(
  getActivityInfoByScope
);