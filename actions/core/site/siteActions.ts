import { Dispatch } from "redux";
import ApiClient from "@lib/wecount-api/ApiClient";
import { CustomThunkAction } from "@custom-types/redux";
import { SiteTypes } from "@actions/core/site/types";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import {
  SiteListResponse,
  SiteResponse,
} from "@lib/wecount-api/responses/apiResponses";
import { ShownSubSites, Site } from "@reducers/core/siteReducer";

export type Action =
  | SetSitesAction
  | SetIsSitesFetchingAction
  | ResetSitesAfterFetching
  | SetFetchError
  | ArchiveRequestedAction
  | MultipleArchiveRequested
  | UnarchiveRequestedAction
  | UpdateNameRequestedAction
  | UpdateDescriptionRequestedAction
  | UpdateParentSiteRequestedAction
  | CreateRequestedAction
  | CreatedAction
  | CreationErrorAction
  | CreationErrorRemovedAction
  | StartEdit 
  | EndEdit 
  | CloseModale
  | SetShownSubSites
  | SetShownSubSitesInSite
  | SetShownSubSitesInSeetings
  | SetShownSubSitesInSiteInSettings
  | SetSearchedSitesInSiteCreationModalInSettings
  | SetSearchedSitesInSubSiteModalInSettings
  | SetSearchedSites
  | SetSearchedSitesInSettings
  | ResetSitesState;

export interface CreateRequestedAction {
  type: SiteTypes.CREATE_REQUESTED;
  payload: {
    perimeterId: number;
    name: string;
    description: string | null;
    parentSiteId: number | null;
  };
}

interface CreatedAction {
  type: SiteTypes.CREATED;
  payload: {
    site: SiteResponse;
    parentSiteId: number | null;
  };
}

interface CreationErrorAction {
  type: SiteTypes.CREATION_ERROR;
}

interface CreationErrorRemovedAction {
  type: SiteTypes.CREATION_ERROR_REMOVED;
}

interface SetIsSitesFetchingAction {
  type: SiteTypes.IS_FETCHING;
}

interface ResetSitesAfterFetching {
  type: SiteTypes.RESET_SITES_AFTER_FETCHING;
  payload: {
    newSiteList: SiteListResponse;
  }
}

interface SetFetchError {
  type: SiteTypes.FETCH_ERROR;
}

export interface ArchiveRequestedAction {
  type: SiteTypes.ARCHIVE_REQUESTED;
  payload: {
    siteId: number;
    parentSiteId?: number | undefined;
  };
}

export interface MultipleArchiveRequested {
  type: SiteTypes.MULTIPLE_ARCHIVE_REQUESTED;
  payload: {
    listIds: number[];
  }
}

export interface UnarchiveRequestedAction {
  type: SiteTypes.UNARCHIVE_REQUESTED;
  payload: {
    siteId: number;
    parentSiteId?: number | undefined;
  };
}

export interface UpdateNameRequestedAction {
  type: SiteTypes.UPDATE_NAME_REQUESTED;
  payload: {
    siteId: number;
    parentSiteId?: number | undefined;
    newName: string;
  };
}

export interface UpdateDescriptionRequestedAction {
  type: SiteTypes.UPDATE_DESCRIPTION_REQUESTED;
  payload: {
    siteId: number;
    parentSiteId?: number | undefined;
    newDescription: string | null;
  };
}

export interface UpdateParentSiteRequestedAction {
  type: SiteTypes.UPDATE_PARENT_SITE_REQUESTED;
  payload: {
    siteId: number;
    oldParentSiteId: number | null;
    newParentSiteId: number | null;
  };
}

interface SetSitesAction {
  type: SiteTypes.SET_SITES;
  payload: {
    siteList: SiteListResponse;
  };
}

interface ResetSitesState {
  type: SiteTypes.RESET_SITES_STATE;
}

export interface SetShownSubSitesInSite {
  type: SiteTypes.SHOW_SUB_SITES;
  payload: {
    siteId: number;
    show: boolean;
  }
}

export interface SetShownSubSites {
  type: SiteTypes.SHOW_ALL_SUB_SITES;
  payload: {
    showSubSites: ShownSubSites;
  }
}

export interface SetShownSubSitesInSiteInSettings {
  type: SiteTypes.SHOW_SUB_SITES_IN_SETTINGS;
  payload: {
    siteId: number;
    show: boolean;
  }
}

export interface SetShownSubSitesInSeetings {
  type: SiteTypes.SHOW_ALL_SUB_SITES_IN_SETTINGS;
  payload: {
    showSubSites: ShownSubSites;
  }
}

export const setSites = (
  perimeterId: number,
  customApiClient?: ApiClient
): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    const state = getState();
    if (state.core.site.isFetching) return;

    dispatch<SetIsSitesFetchingAction>({
      type: SiteTypes.IS_FETCHING,
    });
    const apiClient = customApiClient ?? ApiClient.buildFromBrowser();
    try {
      const response = await apiClient.get<SiteListResponse>(
        generateRoute(ApiRoutes.PERIMETERS_SITES, { id: perimeterId })
      );
      dispatch<SetSitesAction>({
        type: SiteTypes.SET_SITES,
        payload: {
          siteList: response.data,
        },
      });
    } catch (error: any) {
      dispatch<SetFetchError>({
        type: SiteTypes.FETCH_ERROR,
      });
      throw error;
    }
  };
};

export function resetSites(siteList: SiteListResponse): ResetSitesAfterFetching
{
  return {
    type: SiteTypes.RESET_SITES_AFTER_FETCHING,
    payload: {
      newSiteList: siteList
    }
  }
}

export const requestArchive = (siteId: number, parentSiteId?: number | undefined): ArchiveRequestedAction => ({
  type: SiteTypes.ARCHIVE_REQUESTED,
  payload: {
    siteId,
    parentSiteId
  },
});

export const requestMultipleArchive = (listIds: number[]): MultipleArchiveRequested => ({
  type: SiteTypes.MULTIPLE_ARCHIVE_REQUESTED,
  payload: {
    listIds
  },
});

export const requestUnarchive = (siteId: number, parentSiteId?: number | undefined): UnarchiveRequestedAction => ({
  type: SiteTypes.UNARCHIVE_REQUESTED,
  payload: {
    siteId,
    parentSiteId
  },
});

export const requestUpdateName = ({
  siteId,
  parentSiteId,
  newName,
}: {
  siteId: number;
  parentSiteId?: number | undefined;
  newName: string;
}): UpdateNameRequestedAction => ({
  type: SiteTypes.UPDATE_NAME_REQUESTED,
  payload: {
    siteId,
    parentSiteId,
    newName,
  },
});

export const requestUpdateDescription = ({
  siteId,
  parentSiteId,
  newDescription,
}: {
  siteId: number;
  parentSiteId?: number | undefined;
  newDescription: string | null;
}): UpdateDescriptionRequestedAction => ({
  type: SiteTypes.UPDATE_DESCRIPTION_REQUESTED,
  payload: {
    siteId,
    parentSiteId,
    newDescription,
  },
});

export const requestUpdateParent = ({
  siteId,
  oldParentSiteId,
  newParentSiteId
}: {
  siteId: number;
  oldParentSiteId: number | null;
  newParentSiteId: number | null;
}): UpdateParentSiteRequestedAction => ({
  type: SiteTypes.UPDATE_PARENT_SITE_REQUESTED,
  payload: {
    siteId,
    oldParentSiteId,
    newParentSiteId
  }
})

export const requestCreation = ({
  perimeterId,
  name,
  description,
  parentSiteId
}: {
  perimeterId: number;
  name: string;
  description: string | null;
  parentSiteId: number | null;
}): CreateRequestedAction => ({
  type: SiteTypes.CREATE_REQUESTED,
  payload: {
    perimeterId,
    name,
    description,
    parentSiteId
  },
});

export const setCreated = ({
  site, 
  parentSiteId
}: {
  site: SiteResponse; 
  parentSiteId: number | null;
}): CreatedAction => ({
  type: SiteTypes.CREATED,
  payload: {
    site,
    parentSiteId
  },
});

export const setCreationError = (): CreationErrorAction => ({
  type: SiteTypes.CREATION_ERROR,
});

export const removeCreationError = (): CreationErrorRemovedAction => ({
  type: SiteTypes.CREATION_ERROR_REMOVED,
});

export function resetSitesState(): ResetSitesState {
  return {
    type: SiteTypes.RESET_SITES_STATE,
  };
}

interface StartEdit {
  type: SiteTypes.SITES_EDIT_START;
  payload: {
    siteId: number;
    parentSiteId: number | null;
  };
}
interface EndEdit {
  type: SiteTypes.SITES_EDIT_END;
}
interface CloseModale {
  type: SiteTypes.SITES_EDIT_CLOSE_MODALE
}

export const startSiteEdit = ({
  siteId,
  parentSiteId
}: {
  siteId: number;
  parentSiteId: number | null;
}): StartEdit => {
  return {
    type: SiteTypes.SITES_EDIT_START,
    payload: {
      siteId,
      parentSiteId
    },
  };
};

export const endSiteEdit = (): EndEdit => {
  return {
    type: SiteTypes.SITES_EDIT_END,
  };
};

// quick fix for "close modale and field blur" bug
export const visuallyCloseSiteModale = (): CloseModale => ({
  type: SiteTypes.SITES_EDIT_CLOSE_MODALE,
});

// quick fix for "close modale and field blur" bug
export function closeSiteModaleAndTimeoutEndEdit(): CustomThunkAction {
  return async dispatch => {
    dispatch(visuallyCloseSiteModale());
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(endSiteEdit());
  };
}

export function setShownSubSites({
 siteId,
 show
}: {
  siteId: number,
  show: boolean
}): SetShownSubSitesInSite {
  return {
    type: SiteTypes.SHOW_SUB_SITES,
    payload: {
      siteId,
      show
    }
  }
}
export function setShownAllSubSites(
  showSubSites: ShownSubSites
): SetShownSubSites {
   return {
     type: SiteTypes.SHOW_ALL_SUB_SITES,
     payload: {
      showSubSites
     }
   }
 }

 export function setShownSubSitesInSettings({
  siteId,
  show
 }: {
   siteId: number,
   show: boolean
 }): SetShownSubSitesInSiteInSettings {
   return {
     type: SiteTypes.SHOW_SUB_SITES_IN_SETTINGS,
     payload: {
       siteId,
       show
     }
   }
 }
 export function setShownAllSubSitesInSettings(
   showSubSites: ShownSubSites
 ): SetShownSubSitesInSeetings {
    return {
      type: SiteTypes.SHOW_ALL_SUB_SITES_IN_SETTINGS,
      payload: {
       showSubSites
      }
    }
  }

export interface SetSearchedSites {
  type: SiteTypes.SET_SEARCHED_SITES;
  payload: {
    searchedTerms: string;
    showAll: boolean;
  }
}

export function setSearchedSites (
  payload: SetSearchedSites["payload"]
): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {
    const sites = getState().core.site.siteList;
    const showSubSites = Object.values(sites).reduce((acc, site) => {
        acc[site.id] = payload.showAll;
        return acc;
    }, {} as ShownSubSites);
    
    dispatch<SetShownSubSites>({
      type: SiteTypes.SHOW_ALL_SUB_SITES,
      payload: {
        showSubSites
      }
    });

    dispatch<SetSearchedSites>({
      type: SiteTypes.SET_SEARCHED_SITES,
      payload
    });
  }
}

export interface SetSearchedSitesInSettings {
  type: SiteTypes.SET_SEARCHED_SITES_IN_SETTINGS;
  payload: {
    searchedTerms: string;
    showAll: boolean;
  }
}

export function setSearchedSitesISettings (
  payload: SetSearchedSitesInSettings["payload"]
): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {
    const sites = getState().core.site.siteList;
    const showSubSites = Object.values(sites).reduce((acc, site) => {
        acc[site.id] = payload.showAll;
        return acc;
    }, {} as ShownSubSites);
    
    dispatch<SetShownSubSitesInSeetings>({
      type: SiteTypes.SHOW_ALL_SUB_SITES_IN_SETTINGS,
      payload: {
        showSubSites
      }
    });

    dispatch<SetSearchedSitesInSettings>({
      type: SiteTypes.SET_SEARCHED_SITES_IN_SETTINGS,
      payload
    });
  }
}

export interface SetSearchedSitesInSiteCreationModalInSettings {
  type: SiteTypes.SET_SEARCHED_SITES_IN_SITE_CREATION_MODAL_IN_SETTINGS;
  payload: {
    searchedTerms: string;
  }
}


export function setSearchedSitesInSiteCreationModalInSettings (
  payload: SetSearchedSitesInSiteCreationModalInSettings["payload"]
): SetSearchedSitesInSiteCreationModalInSettings {
  return {
    type: SiteTypes.SET_SEARCHED_SITES_IN_SITE_CREATION_MODAL_IN_SETTINGS,
    payload
  }
}

export interface SetSearchedSitesInSubSiteModalInSettings {
  type: SiteTypes.SET_SEARCHED_SITES_IN_SUB_SITE_MODAL_IN_SETTINGS;
  payload: {
    searchedTerms: string;
  }
}

export function setSearchedSitesInSubSiteModalInSettings (
  payload: SetSearchedSitesInSubSiteModalInSettings["payload"]
): SetSearchedSitesInSubSiteModalInSettings {
  return {
    type: SiteTypes.SET_SEARCHED_SITES_IN_SUB_SITE_MODAL_IN_SETTINGS,
    payload
  }
}
 
