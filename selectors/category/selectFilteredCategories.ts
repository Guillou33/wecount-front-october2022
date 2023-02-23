import { createSelector } from "reselect";
import { isEmpty } from "lodash";

import selectFilteredActivityEntriesForCartography from "@selectors/activityEntries/selectFilteredActivityEntriesForCartography";
import selectAllActivityModelsRecord from "@selectors/activityModels/selectAllActivityModelsRecord";
import selectAllCategories from "./selectAllCategories";

const selectFilteredCategories = createSelector(
  selectAllCategories,
  selectAllActivityModelsRecord,
  selectFilteredActivityEntriesForCartography,
  (allCategories, allActivityModelsRecord, filteredEntries) => {
    if (isEmpty(allCategories) || isEmpty(allActivityModelsRecord)) {
      return null;
    }
    const filteredActivityModelIds = filteredEntries.map(
      entry => entry.activityModelId
    );
    const filteredCategoriesId: Record<number, true> = {};

    for (let activitymodelId of filteredActivityModelIds) {
      const activityModel = allActivityModelsRecord[activitymodelId];
      const category = allCategories[activityModel?.categoryId ?? -1];
      if (category != null) {
        filteredCategoriesId[category.id] = true;
      }
    }

    return filteredCategoriesId;
  }
);

export default selectFilteredCategories;
