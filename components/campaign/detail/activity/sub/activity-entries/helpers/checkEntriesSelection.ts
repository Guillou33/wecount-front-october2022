import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

export const checkAllSelectedEntries = (
    listSelection: Array<number>,
    editEntries: ActivityEntryExtended[]
  ) => {
    const entryIds = editEntries.filter(entry => entry.id !== undefined).map(entry => entry.id);
    const chkSelected = Array.isArray(listSelection) &&
      Array.isArray(entryIds) &&
      entryIds.every((val, index) => val !== undefined && listSelection.includes(val)) &&
      listSelection.length > 0 && entryIds.length > 0;
    return chkSelected;
};

export const checkOneSelectedEntry = (
    listSelection: Array<number>,
    editEntries: ActivityEntryExtended[]
) => {
    const entryIds = editEntries.filter(entry => entry.id !== undefined).map(entry => entry.id);
    let chkSelected = false;
    listSelection.forEach(val => {
        const id = val === undefined ? 0 : val;
        if(entryIds.includes(id)){
            chkSelected = true;
        }
    });
    return chkSelected;
};

export const getSelectedEntries = (
    listSelection: Array<number>,
    editEntries: ActivityEntryExtended[]
) => {
    return editEntries.filter(entry => entry.id !== undefined && listSelection.includes(entry.id));
}