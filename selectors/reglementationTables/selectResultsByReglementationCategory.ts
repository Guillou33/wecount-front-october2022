import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { TableType } from "@lib/wecount-api/responses/apiResponses";
import {
  sumResult,
  initResult,
  Result,
} from "@selectors/reglementationTables/helpers/sumReglementationTableResults";

import { getSelectResultsByReglementationSubCategory } from "@selectors/reglementationTables/selectResultsByReglementationSubCategory";

const makeSelectResultsByReglementationCategory = <T extends TableType>(
  tableType: T
) =>
  createSelector(
    [
      (state: RootState) =>
        state.reglementationTables.structure[tableType]
          ?.reglementationCategories ?? [],
      getSelectResultsByReglementationSubCategory(tableType),
    ],
    (reglementationCategories, resultsBySubCategory) => {
      return reglementationCategories.reduce((acc, category) => {
        if (acc[category.id] == null) {
          acc[category.id] = initResult();
        }
        category.reglementationSubCategories.reduce((acc, subCategory) => {
          acc[category.id] = sumResult(
            acc[category.id],
            resultsBySubCategory[subCategory.id] ?? initResult()
          );
          return acc;
        }, acc);
        return acc;
      }, {} as Record<number, Result>);
    }
  );

const selectISOResultsByCategory =
  makeSelectResultsByReglementationCategory("ISO");

const selectGHGResultsByCategory =
  makeSelectResultsByReglementationCategory("GHG");

const selectBEGESResultsByCategory =
  makeSelectResultsByReglementationCategory("BEGES");

function getSelectResultsByReglementationCategory(type: TableType) {
  if (type === "ISO") {
    return selectISOResultsByCategory;
  }
  if (type === "BEGES") {
    return selectBEGESResultsByCategory;
  }
  if (type === "GHG") {
    return selectGHGResultsByCategory;
  }
  throw new Error(`invalid ${type} provided`);
}

export {
  selectISOResultsByCategory,
  selectGHGResultsByCategory,
  selectBEGESResultsByCategory,
  getSelectResultsByReglementationCategory,
};
