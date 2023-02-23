import { Dispatch } from "redux";
import { ListEntriesTypes } from "./listEntriesTypes";
import { ListSelectedEntries, SelectedActivityEntries } from "@reducers/entries/listEntriesReducer";
import { CustomThunkAction } from "@custom-types/redux";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

export type Action = 
  | HandleListSelectedEntriesAction
  | HandleListSelectedEntriesInActivityAction
  | HandleListSelectedEntriesInSiteAction;

interface HandleListSelectedEntriesAction {
  type: ListEntriesTypes.SELECT_ENTRIES;
  payload: ListSelectedEntries["selectedEntries"] | number[];
}

interface HandleListSelectedEntriesInActivityAction {
  type: ListEntriesTypes.SELECT_ENTRIES_IN_ACTIVITY;
  payload: {
    list: ListSelectedEntries["selectedEntries"] | number[];
    activityModelId: number | string;
  }
}

interface HandleListSelectedEntriesInSiteAction {
  type: ListEntriesTypes.SELECT_ENTRIES_IN_SITE;
  payload: {
    list: ListSelectedEntries["selectedEntries"] | number[];
    siteId: string;
  }
}

export const handleEntrySelection = ({
  id,
  includeId,
  activityModelId,
  siteId,
  view
}: {
  id: number | undefined,
  includeId: boolean,
  activityModelId: number | undefined,
  siteId?: string | undefined,
  view: string
}): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    let newListOfSelection = Array<number>();
    if(view === "list"){
      const listSelection = getState().listSelectedEntries.selectedEntries as Array<number>;
      // add or delete entry id from selection array => response to the checked entries in page list
      if (id && id !== undefined) {
        newListOfSelection = includeId
          ? listSelection.filter(i => i !== id)
          : [id, ...listSelection];
      }
      dispatch<HandleListSelectedEntriesAction>({
        type: ListEntriesTypes.SELECT_ENTRIES,
        payload: newListOfSelection,
      });
    }

    let newListSelectforActivity = Array<number>();
    if(view === "activity" && activityModelId !== undefined){
      const activitySelected = getState().listSelectedEntries.activityEntries[activityModelId];

      if(id !== undefined){
        if(activitySelected === undefined){
          newListSelectforActivity.push(id);
        }else{
          const listSelection = activitySelected.selectedEntries;
          newListSelectforActivity = includeId
            ? listSelection.filter(i => i !== id)
            : [id, ...listSelection];
        }
      }
      dispatch<HandleListSelectedEntriesInActivityAction>({
        type: ListEntriesTypes.SELECT_ENTRIES_IN_ACTIVITY,
        payload: {
          list: newListSelectforActivity,
          activityModelId: activityModelId
        },
      });
    }

    let newListSelectforSite = Array<number>();
    if(view === "sites" && siteId !== undefined){
      const siteSelected = getState().listSelectedEntries.siteEntries[siteId];

      if(id !== undefined){
        if(siteSelected === undefined){
          newListSelectforSite.push(id);
        }else{
          const listSelection = siteSelected.selectedEntries;
          newListSelectforSite = includeId
            ? listSelection.filter(i => i !== id)
            : [id, ...listSelection];
        }
      }
      dispatch<HandleListSelectedEntriesInSiteAction>({
        type: ListEntriesTypes.SELECT_ENTRIES_IN_SITE,
        payload: {
          list: newListSelectforSite,
          siteId: siteId
        },
      });
    }
  };
};

export const handleAllEntriesSelection = ({
  isChecked,
  entries,
  activityModelId,
  siteId,
  view
}: {
  isChecked: boolean,
  entries: ActivityEntryExtended[],
  activityModelId: number | undefined,
  siteId?: string | undefined,
  view: string | number | undefined
}): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    let newListOfSelection = Array<number>();

    if(view === "list"){
      const listSelection = Object.values(entries).reduce((list, entry) => {
        if (entry["entryKey"] != null && entry.id !== undefined) {
          list.push(entry.id);
        }
        return list;
      }, [] as number[]);

      if (isChecked) {
        newListOfSelection = listSelection;
      } else {
        newListOfSelection = Array<number>();
      }

      dispatch<HandleListSelectedEntriesAction>({
        type: ListEntriesTypes.SELECT_ENTRIES,
        payload: newListOfSelection,
      });
    }

    let newListSelectforActivity = Array<number>();
    if(view === "activity" && activityModelId !== undefined){
      const listSelection = Object.values(entries).reduce((list, entry) => {
        if (entry["entryKey"] != null && entry.id !== undefined) {
          list.push(entry.id);
        }
        return list;
      }, [] as number[]);

      if (isChecked) {
        newListSelectforActivity = listSelection;
      } else {
        newListSelectforActivity = Array<number>();
      }
      dispatch<HandleListSelectedEntriesInActivityAction>({
        type: ListEntriesTypes.SELECT_ENTRIES_IN_ACTIVITY,
        payload: {
          list: newListSelectforActivity,
          activityModelId: activityModelId
        },
      });
    }

    let newListSelectforSites = Array<number>();
    if(view === "sites" && siteId !== undefined){
      const listSelection = Object.values(entries).reduce((list, entry) => {
        if (entry["entryKey"] != null && entry.id !== undefined) {
          list.push(entry.id);
        }
        return list;
      }, [] as number[]);

      if (isChecked) {
        newListSelectforSites = listSelection;
      } else {
        newListSelectforSites = Array<number>();
      }
      dispatch<HandleListSelectedEntriesInSiteAction>({
        type: ListEntriesTypes.SELECT_ENTRIES_IN_SITE,
        payload: {
          list: newListSelectforSites,
          siteId: siteId
        },
      });
    }
  };
};
