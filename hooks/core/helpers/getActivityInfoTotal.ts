import { memoizedActivityInfoByActivityModel } from "@hooks/core/helpers/getActivityInfoByModelId";
import {
  ActivityInfo,
} from "@hooks/core/helpers/activityInfo";
import { getActivityInfoForActivityModelList } from "@hooks/core/helpers/getActivityInfoForActivityModelList";
import {
  CategoryList,
  ActivityModel,
} from "@reducers/core/categoryReducer";
import { Scope } from "@custom-types/wecount-api/activity";
import { Activity } from "@reducers/campaignReducer";
import Memoize from "@lib/utils/Memoize";
import { SiteList } from "@reducers/core/siteReducer";
import { ProductList } from "@reducers/core/productReducer";

const getActivityInfoTotal = (
  categoryList: CategoryList,
  activities: { [key: number]: Activity } | undefined,
  siteList: SiteList,
  productList: ProductList
): ActivityInfo => {
  const activityInfoByModelId = memoizedActivityInfoByActivityModel(
    activities,
    siteList,
    productList
  );
  const categories = [
    ...Object.values(categoryList[Scope.UPSTREAM]),
    ...Object.values(categoryList[Scope.CORE]),
    ...Object.values(categoryList[Scope.DOWNSTREAM]),
  ];
  const modelList = categories.reduce(
    (modelListTemp: ActivityModel[], category) => {
      return [...modelListTemp, ...category.activityModels];
    },
    []
  );
  
  return getActivityInfoForActivityModelList(modelList, activityInfoByModelId);
};

export const getNewMemoizedActivityInfoTotal = () =>
  new Memoize(getActivityInfoTotal);
