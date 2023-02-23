import { createSelector } from "reselect";

import { ActivityModelExtended } from "@selectors/activityModels/selectAllActivityModels";

import selectCategoriesInCartography from "./selectCategoriesInCartography";

const selectActivityModelsInCartography = createSelector(
  selectCategoriesInCartography,
  categories => {
    return Object.values(categories).reduce((acc, category) => {
      category.activityModels.forEach(activityModel => {
        acc.push({ ...activityModel, categoryId: category.id });
      });
      return acc;
    }, [] as ActivityModelExtended[]);
  }
);

export default selectActivityModelsInCartography;
