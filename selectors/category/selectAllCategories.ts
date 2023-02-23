import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

const selectAllCategories = createSelector(
  (state: RootState) => state.core.category.categoryList,
  categoryList => ({
    ...categoryList.UPSTREAM,
    ...categoryList.CORE,
    ...categoryList.DOWNSTREAM,
  })
);

export default selectAllCategories;
