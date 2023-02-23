import { RootState } from "@reducers/index";
import { CategoryList } from "@reducers/core/categoryReducer";

function selectCategoryList(state: RootState): CategoryList {
  return state.core.category.categoryList;
}

export default selectCategoryList;
