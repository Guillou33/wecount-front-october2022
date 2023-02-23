import { memoizedActivityInfoByActivityModel } from '@hooks/core/helpers/getActivityInfoByModelId';
import { getActivityInfoForActivityModelList } from '@hooks/core/helpers/getActivityInfoForActivityModelList';
import { ActivityInfo } from '@hooks/core/helpers/activityInfo';
import { CategoryList, ActivityCategory } from "@reducers/core/categoryReducer";
import { Scope } from "@custom-types/wecount-api/activity";
import { Activity } from "@reducers/campaignReducer";
import Memoize from "@lib/utils/Memoize";
import { SiteList } from "@reducers/core/siteReducer";
import { ProductList } from "@reducers/core/productReducer";

export interface ActivityInfoByCategory {
  [key: number]: ActivityInfo;
}

export const getActivityInfoByCategory = (
  categoryList: CategoryList,
  activities: { [key: number]: Activity } | undefined,
  sites: SiteList,
  products: ProductList,
): ActivityInfoByCategory => {
  const activityInfoByModelId = memoizedActivityInfoByActivityModel(
    activities,
    sites,
    products
  );
  const flatCategories = Object.values({
    ...categoryList[Scope.UPSTREAM],
    ...categoryList[Scope.CORE],
    ...categoryList[Scope.DOWNSTREAM],
  });

  const activityNbByCategory = flatCategories.reduce(
    (mapping: ActivityInfoByCategory, category: ActivityCategory) => {
      const categoryId = category.id;
      mapping[categoryId] = getActivityInfoForActivityModelList(
        category.activityModels,
        activityInfoByModelId
      );
      return mapping;
    },
    {}
  );

  return activityNbByCategory;
};

export const getNewMemoizedActivityInfoByCategory = () => new Memoize(
  getActivityInfoByCategory
);