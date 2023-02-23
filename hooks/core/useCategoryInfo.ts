import { useSelector } from "react-redux";
import { RootState } from '@reducers/index';
import { CategoryList, ActivityCategory } from '@reducers/core/categoryReducer';
import { Scope } from '@custom-types/wecount-api/activity';
import _ from 'lodash';

export interface CategoryInfo {
  [key: number]: ActivityCategory
};

const useCategoryInfo = (): CategoryInfo => {
  const categoryList = useSelector<RootState, CategoryList>(state => state.core.category.categoryList);

  return memoizedCategoryInfo(categoryList);
};

const getCategoryInfo = (categoryList: CategoryList): CategoryInfo => {
  
  const flatCategoryList = {
    ...categoryList[Scope.UPSTREAM],
    ...categoryList[Scope.CORE],
    ...categoryList[Scope.DOWNSTREAM],
  };

  return flatCategoryList;
}

const memoizedCategoryInfo = _.memoize(getCategoryInfo);

export default useCategoryInfo;
