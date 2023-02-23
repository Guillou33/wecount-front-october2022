import { createSelector } from "reselect";

import { ActivityCategory } from "@reducers/core/categoryReducer";

import selectCategorylist from "@selectors/category/selectCategoryList";
import selectActivityModelVisibilities from "./selectActivitymodelVisibilities";

import mapObject from "@lib/utils/mapObject";

const selectCartography = createSelector(
  [selectCategorylist, selectActivityModelVisibilities],
  (categoryList, activityModelVisibilities) => {
    if (activityModelVisibilities == null) {
      return categoryList;
    }
    return mapObject(categoryList, categories => {
      return Object.values(categories).reduce((acc, category) => {
        const visibleActivityModels = category.activityModels.filter(
          activityModel => activityModelVisibilities[activityModel.uniqueName]
        );
        if (visibleActivityModels.length > 0) {
          acc[category.id] = {
            ...category,
            activityModels: visibleActivityModels,
          };
        }
        return acc;
      }, {} as Record<number, ActivityCategory>);
    });
  }
);

export default selectCartography;
