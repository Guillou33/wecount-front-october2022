import { createSelector } from "reselect";

import selectCategoriesInCartographyForCampaign from "./selectCategoriesInCartographyForCampaign";

const selectActivityModelsInCartography = createSelector(
  selectCategoriesInCartographyForCampaign,
  categories => {
    return Object.values(categories).flatMap(
      category => category.activityModels
    );
  }
);

export default selectActivityModelsInCartography;
