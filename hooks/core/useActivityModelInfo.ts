import { useSelector } from "react-redux";
import { RootState } from '@reducers/index';
import { CategoryList, ActivityCategory, ActivityModel } from '@reducers/core/categoryReducer';
import { Scope } from '@custom-types/wecount-api/activity';
import _ from 'lodash';

type RawCategory = Omit<ActivityCategory, "activityModels">
export interface ActivityModelWithCategory extends ActivityModel {
  category: RawCategory;
}
export interface ActivityModelInfo {
  [key: number]: ActivityModelWithCategory
};

const useActivityModelInfo = () => {
  const categoryList = useSelector<RootState, CategoryList>(state => state.core.category.categoryList);

  return memoizedActivityModelInfo(categoryList);
};

const getActivityModelInfo = (categoryList: CategoryList): ActivityModelInfo => {
  
  let activityModelInfo: ActivityModelInfo = {};

  const rawCategoryList = [
    ...Object.values(categoryList[Scope.UPSTREAM]),
    ...Object.values(categoryList[Scope.CORE]),
    ...Object.values(categoryList[Scope.DOWNSTREAM]),
  ];

  activityModelInfo = rawCategoryList.reduce((mapping: ActivityModelInfo, category) => {

    const rawCategory: RawCategory = _.omit(category, "activityModels");
    mapping = category.activityModels.reduce((mappingInCategory: ActivityModelInfo, activityModel) => {
      const activityModelWithCategory: ActivityModelWithCategory = {...activityModel, category: rawCategory};
      mappingInCategory[activityModel.id] = activityModelWithCategory;
      return mappingInCategory;
    }, mapping);

    return mapping;
  }, activityModelInfo);

  return activityModelInfo;
}

const memoizedActivityModelInfo = _.memoize(getActivityModelInfo);

export default useActivityModelInfo;
