import { EntryInfoByActivityModel } from "./getEntryInfoByActivityModel";
import { EntryInfo, getInitialEntryInfo, getEntryInfoSum } from "./entryInfo";
import { ActivityModel } from "@reducers/core/categoryReducer";

function getEntryInfoForActivityModelList(
  activityModelList: ActivityModel[],
  entryInfoByActivityModel: EntryInfoByActivityModel
): EntryInfo {
  return activityModelList.reduce((acc, activityModel) => {
    const entryInfo =
      entryInfoByActivityModel[activityModel.id] ?? getInitialEntryInfo();
    return getEntryInfoSum(acc, entryInfo);
  }, getInitialEntryInfo());
}

export default getEntryInfoForActivityModelList;
