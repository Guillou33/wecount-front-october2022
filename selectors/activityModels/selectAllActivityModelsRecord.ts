import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import selectAllActivityModels from "./selectAllActivityModels";

import { ActivityModelExtended } from "./selectAllActivityModels";

const selectAllActivityModelsRecord = createSelector(
  selectAllActivityModels,
  allActivityModels =>
    allActivityModels.reduce((allActivityModelsRecord, activityModel) => {
      allActivityModelsRecord[activityModel.id] = activityModel;
      return allActivityModelsRecord;
    }, {} as Record<number, ActivityModelExtended>)
);

export default selectAllActivityModelsRecord;
