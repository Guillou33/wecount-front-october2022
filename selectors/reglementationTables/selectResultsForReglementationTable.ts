import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { TableType } from "@lib/wecount-api/responses/apiResponses";
import {
  sumResult,
  initResult,
} from "@selectors/reglementationTables/helpers/sumReglementationTableResults";

import { getSelectResultsByReglementationCategory } from "@selectors/reglementationTables/selectResultsByReglementationCategory";

const makeSelectResultsForReglementationTable = <T extends TableType>(
  tableType: T
) =>
  createSelector(
    [
      (state: RootState) =>
        state.reglementationTables.structure[tableType]
          ?.reglementationCategories ?? [],
      getSelectResultsByReglementationCategory(tableType),
    ],
    (reglementationCategories, resultsByCategory) => {
      return reglementationCategories.reduce((acc, category) => {
        return sumResult(acc, resultsByCategory[category.id] ?? initResult());
      }, initResult());
    }
  );

const selectISOTotalResults = makeSelectResultsForReglementationTable("ISO");

const selectGHGTotalResults = makeSelectResultsForReglementationTable("GHG");

const selectBEGESTotalResults =
  makeSelectResultsForReglementationTable("BEGES");

function getSelectResultsForReglementationTable(type: TableType) {
  if (type === "ISO") {
    return selectISOTotalResults;
  }
  if (type === "BEGES") {
    return selectBEGESTotalResults;
  }
  if (type === "GHG") {
    return selectGHGTotalResults;
  }
  throw new Error(`invalid ${type} provided`);
}

export {
  selectISOTotalResults,
  selectGHGTotalResults,
  selectBEGESTotalResults,
  getSelectResultsForReglementationTable,
};
