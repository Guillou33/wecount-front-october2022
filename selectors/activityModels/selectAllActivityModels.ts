import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { ActivityModel } from "@reducers/core/categoryReducer";
import selectAllCategories from "@selectors/category/selectAllCategories";

export interface ActivityModelExtended extends ActivityModel {
  categoryId: number;
}

const selectAllActivityModels = createSelector(
  selectAllCategories,
  allCategories => {
    return Object.values(allCategories).reduce(
      (allActivityModels, category) => {
        return category.activityModels.reduce(
          (allActivityModels, activitymodel) => {
            allActivityModels.push({
              ...activitymodel,
              categoryId: category.id,
            });
            return allActivityModels;
          },
          allActivityModels
        );
      },
      [] as ActivityModelExtended[]
    );
  }
);

export default selectAllActivityModels;
