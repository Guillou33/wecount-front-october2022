import { createSelector } from "reselect";

import mapObject from "@lib/utils/mapObject";

import { ActivityModel } from "@reducers/core/categoryReducer";

import selectCartography from "@selectors/cartography/selectCartography";

const selectActivitymodelsInScope = createSelector(
  selectCartography,
  cartography =>
    mapObject(cartography, categories => {
      return Object.values(categories).reduce((acc, category) => {
        acc.push(...category.activityModels);
        return acc;
      }, [] as ActivityModel[]);
    })
);

export default selectActivitymodelsInScope;
