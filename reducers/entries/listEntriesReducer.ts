import { ListEntriesTypes } from "@actions/entries/listEntriesTypes";
import _ from 'lodash';
import immer from 'immer';
import { Action } from "@actions/entries/listEntriesActions";

export interface SelectedActivityEntries {
    [activityModelId: number]: {
        selectedEntries: Array<number>
    }
}

export interface SelectedSiteEntries {
    [siteIds: string]: {
        selectedEntries: Array<number>
    }
}

export interface ListSelectedEntries {
    selectedEntries: Array<number>;
    activityEntries: SelectedActivityEntries;
    siteEntries: SelectedSiteEntries;
}

const initialStateForSelectedActivityEntries: {
    [activityModelId: number]: {
        selectedEntries: Array<number>
    }
} = {};

const initialStateForSelectedEntriesInSite: {
    [siteId: number]: {
        selectedEntries: Array<number>
    }
} = {};

const INITIAL_STATE: ListSelectedEntries = {
    selectedEntries: Array<number>(),
    activityEntries: initialStateForSelectedActivityEntries,
    siteEntries: initialStateForSelectedEntriesInSite
};

const reducer = (state: ListSelectedEntries = INITIAL_STATE, action: Action): ListSelectedEntries => {
    switch (action.type) {
        case ListEntriesTypes.SELECT_ENTRIES:
            return immer(state, draftState => {
                draftState.selectedEntries = action.payload;
            });
        case ListEntriesTypes.SELECT_ENTRIES_IN_ACTIVITY:
            return immer(state, draftState => {
                const {activityModelId, list } = action.payload;
                if(state.activityEntries[activityModelId as number] === undefined){
                    draftState.activityEntries[activityModelId as number] = {
                        selectedEntries: action.payload.list
                    }
                }else{
                    draftState.activityEntries[activityModelId as number].selectedEntries = list;
                }
            });
        case ListEntriesTypes.SELECT_ENTRIES_IN_SITE:
            return immer(state, draftState => {
                const {siteId, list } = action.payload;
                if(state.siteEntries[siteId as string] === undefined){
                    draftState.siteEntries[siteId as string] = {
                        selectedEntries: list
                    }
                }else{
                    draftState.siteEntries[siteId as string].selectedEntries = list;
                }
            });
        default:
            return state;
    }
}

export default reducer;
