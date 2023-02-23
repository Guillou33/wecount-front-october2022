import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { TableType } from "@lib/wecount-api/responses/apiResponses";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import {
  initResult,
  getResult,
  sumResult,
  Result,
} from "@selectors/reglementationTables/helpers/sumReglementationTableResults";

import selectReglementationResultsOfCampaign from "@selectors/reglementationTables/selectReglementationResultsOfCampaign";

const makeSelectResultsByReglementationSubCategory = <T extends TableType>(
  tableType: T
) =>
  createSelector(
    [
      (state: RootState, entries, campaignId: number | undefined) =>
        selectReglementationResultsOfCampaign(state, campaignId, tableType),
      (_: RootState, entries: ActivityEntryExtended[]) => entries,
    ],
    (results, entries) => {
      const filteredEntryIds = entries.reduce((acc, entry) => {
        if (entry.id != null) {
          acc[entry.id] = true;
        }
        return acc;
      }, {} as Record<number, true>);

      return results.reduce((acc, result) => {
        const entryId = result.activityEntryId;
        const subCategoryId = result.subCategoryId;
        if (filteredEntryIds[entryId]) {
          if (acc[subCategoryId] == null) {
            acc[subCategoryId] = initResult();
          }
          acc[subCategoryId] = sumResult(acc[subCategoryId], getResult(result));
        }
        return acc;
      }, {} as Record<number, Result>);
    }
  );

const selectISOResultsBySubCategory =
  makeSelectResultsByReglementationSubCategory("ISO");

const selectGHGResultsBySubCategory =
  makeSelectResultsByReglementationSubCategory("GHG");

const selectBEGESResultsBySubCategory =
  makeSelectResultsByReglementationSubCategory("BEGES");

function getSelectResultsByReglementationSubCategory(type: TableType) {
  if (type === "ISO") {
    return selectISOResultsBySubCategory;
  }
  if (type === "BEGES") {
    return selectBEGESResultsBySubCategory;
  }
  if (type === "GHG") {
    return selectGHGResultsBySubCategory;
  }
  throw new Error(`invalid ${type} provided`);
}

export {
  selectISOResultsBySubCategory,
  selectGHGResultsBySubCategory,
  selectBEGESResultsBySubCategory,
  getSelectResultsByReglementationSubCategory,
};
