import { createSelector } from "reselect";

import { getNameHashMap, NameHashMap } from "@lib/utils/getNameHashMap";

import selectCategoriesInCartographyForCampaign from "@selectors/cartography/selectCategoriesInCartographyForCampaign";

export type CategoriesByName = Record<
  string,
  { id: number; activityModelsByName: NameHashMap }
>;

const selectAllCategoriesByName = createSelector(
  [selectCategoriesInCartographyForCampaign],
  allCategories => {
    return Object.values(allCategories).reduce((categoriesByName, category) => {
      categoriesByName[category.name.toLowerCase()] = {
        id: category.id,
        activityModelsByName: getNameHashMap(category.activityModels),
      };
      return categoriesByName;
    }, {} as CategoriesByName);
  }
);

export default selectAllCategoriesByName;
