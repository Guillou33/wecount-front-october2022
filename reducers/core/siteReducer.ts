import { SiteTypes } from "@actions/core/site/types";
import { Action } from "@actions/core/site/siteActions";
import { SiteListResponse } from "@lib/wecount-api/responses/apiResponses";
import immer from 'immer';
import _, { isArray } from "lodash";

export interface SiteEditState {
  isEditing: boolean;
  isModalOpened: boolean; // quick fix for "close modale and field blur" bug
  siteId: number | undefined;
  parentSiteId: number | null | undefined;
}

export interface SiteEditState {
  isEditing: boolean;
  isModalOpened: boolean; // quick fix for "close modale and field blur" bug
  siteId: number | undefined;
  parentSiteId: number | null | undefined;
}

export type ShownSubSites = { [siteId: number]: boolean };

export type SiteList = { [siteId: number]: Site };

export type SubSiteList = { [subSiteId: number]: SubSite };

export interface Site {
  id: number
  name: string;
  description: string | null;
  archivedDate: string | null;
  createdAt: string;
  subSites?: SubSiteList;
}
export interface SubSite {
  id: number
  name: string;
  description: string | null;
  archivedDate: string | null;
  createdAt: string;
}

interface SiteState {
  siteList: SiteList;
  shownSubSites: ShownSubSites,
  shownSubSitesInSettings: ShownSubSites,
  siteEdit: SiteEditState,
  searchedTerms: string;
  searchedTermsInSettings: string;
  searchedTermsInSiteCreationModalInSettings: string;
  searchedTermsInSubSiteModalInSettings: string;
  isFetched: boolean;
  isFetching: boolean;
  isCreating: boolean;
  areShown: boolean;
  areShownInSettings: boolean;
  creationError: boolean;
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: SiteState = {
  siteList: {},
  shownSubSites: {},
  shownSubSitesInSettings: {},
  siteEdit: {
    siteId: undefined,
    isEditing: false,
    isModalOpened: false,
    parentSiteId: undefined,
  },
  searchedTerms: "",
  searchedTermsInSettings: "",
  searchedTermsInSiteCreationModalInSettings: "",
  searchedTermsInSubSiteModalInSettings: "",
  isFetched: false,
  isFetching: false,
  isCreating: false,
  areShown: false,
  areShownInSettings: false,
  creationError: false,
};

/**
 * Updates reducer state depending on action type
 * @param {Object} state - the reducer state
 * @param {Object} action - the fired action object
 * @param {string} action.type - the action type
 * @param {?Object} action.payload - additional action data
 * @return {Object} new reducer state
 */

const reducer = (
  state: SiteState = INITIAL_STATE,
  action: Action
): SiteState => {
  switch (action.type) {
    case SiteTypes.IS_FETCHING:
      return {
        ...state, 
        isFetching: true,
      };
    case SiteTypes.RESET_SITES_AFTER_FETCHING:
      return {
        ...state, 
        isFetched: false,
        siteList: formatFromServer(action.payload.newSiteList)
      };
    case SiteTypes.FETCH_ERROR:
      return {
        ...state, 
        isFetching: false,
      };
    case SiteTypes.SET_SITES:
      return {
        ...state, 
        siteList: formatFromServer(action.payload.siteList),
        isFetched: true,
      };
    case SiteTypes.ARCHIVE_REQUESTED:
      return immer(state, draftState => {
        const site = state.siteList[action.payload.siteId];
        const parentSiteId = action.payload.parentSiteId;
        draftState.siteList[action.payload.siteId]!.archivedDate = (new Date()).toISOString();
        const subSites = state.siteList[action.payload.siteId].subSites;
        if(subSites !== undefined && Object.values(subSites).length > 0){
          const newSubSitesState = _.map(subSites, (subSite, key) => {
            draftState.siteList[subSite.id]!.archivedDate = (new Date()).toISOString();
            return {
              ...subSite,
              archivedDate: (new Date()).toISOString()
            }
          })
          draftState.siteList[action.payload.siteId] = {
            ...site,
            archivedDate: (new Date()).toISOString(),
            subSites: newSubSitesState.reduce((acc, cur) => {
              acc[cur.id] = cur;
              return acc;
            }, {} as SubSiteList)
          }
        }
        if(parentSiteId !== undefined){
          const subSites = state.siteList[parentSiteId].subSites;
          if(subSites !== undefined){
            const siteId = site.id;
            const newState = {
              ...subSites,
              [siteId as number]: {
                ...site,
                archivedDate: (new Date()).toISOString()
              }
            }
            draftState.siteList[parentSiteId].subSites = newState;
          }
        }
      });
    case SiteTypes.MULTIPLE_ARCHIVE_REQUESTED:
      return immer(state, draftState => {
        const newArchivedSites = action.payload.listIds.map(id => {
          draftState.siteList[id].archivedDate = (new Date()).toISOString();
          if(state.siteList[id].subSites !== undefined) {
            const newArchivedSubSitesInSite = _.map(state.siteList[id].subSites, subSite => {
              draftState.siteList[subSite.id].archivedDate = (new Date()).toISOString();
              return draftState.siteList[subSite.id];
            });
          }
          return draftState.siteList[id];
        });
        const newArchivedSiteWithSubSites = _.map(state.siteList, site => {
          if(site.subSites !== undefined){
            const subSites = draftState.siteList[site.id].subSites;
            const newArchivedSubSites =_.map(site.subSites, subSite => {
              if(
                action.payload.listIds.includes(subSite.id) &&
                subSites !== undefined
              ){
                subSites[subSite.id].archivedDate = (new Date()).toISOString();
              }
            });
          }
        });
      });
    case SiteTypes.UNARCHIVE_REQUESTED:
      return immer(state, draftState => {
        const site = state.siteList[action.payload.siteId];
        draftState.siteList[action.payload.siteId]!.archivedDate = null;
        const subSites = state.siteList[action.payload.siteId].subSites;
        if(subSites !== undefined){
          const newSubSitesState = _.map(subSites, (subSite, key) => {
            draftState.siteList[subSite.id]!.archivedDate = null;
            return {
              ...subSite,
              archivedDate: null
            }
          })
          draftState.siteList[action.payload.siteId] = {
            ...site,
            archivedDate: null,
            subSites: newSubSitesState.reduce((acc, cur) => {
              acc[cur.id] = cur;
              return acc;
            }, {} as SubSiteList)
          }
        }
      });
    case SiteTypes.UPDATE_NAME_REQUESTED:
      return immer(state, draftState => {
        draftState.siteList[action.payload.siteId]!.name = action.payload.newName;
        if(action.payload.parentSiteId !== undefined){
          const subSites = state.siteList[action.payload.parentSiteId].subSites;
          if(subSites !== undefined){
            const site = subSites[action.payload.siteId];
            if(site !== undefined){
              draftState.siteList[action.payload.parentSiteId].subSites = {
                ...state.siteList[action.payload.parentSiteId].subSites,
                [action.payload.siteId]: {
                  ...site,
                  name: action.payload.newName
                }
              }
            }
          }
        }
      });
    case SiteTypes.UPDATE_DESCRIPTION_REQUESTED:
      return immer(state, draftState => {
        draftState.siteList[action.payload.siteId]!.description = action.payload.newDescription;
        if(action.payload.parentSiteId !== undefined){
          const subSites = state.siteList[action.payload.parentSiteId].subSites;
          if(subSites !== undefined){
            const site = subSites[action.payload.siteId];
            if(site !== undefined){
              draftState.siteList[action.payload.parentSiteId].subSites = {
                ...state.siteList[action.payload.parentSiteId].subSites,
                [action.payload.siteId]: {
                  ...site,
                  description: action.payload.newDescription
                }
              }
            }
          }
        }
      });
    case SiteTypes.UPDATE_PARENT_SITE_REQUESTED:
      return immer(state, draftState => {
        if(
          action.payload.newParentSiteId && 
          action.payload.oldParentSiteId &&
          draftState.siteList[action.payload.newParentSiteId].subSites !== undefined
        ){
          const updatedSite = state.siteList[action.payload.siteId];
          draftState.siteList[action.payload.newParentSiteId].subSites = {
            ...state.siteList[action.payload.newParentSiteId].subSites,
            [action.payload.siteId]: updatedSite
          }
          const oldParentSite = draftState.siteList[action.payload.oldParentSiteId].subSites;
          if(oldParentSite !== undefined){
            delete oldParentSite[action.payload.siteId];
          }
          draftState.shownSubSitesInSettings[action.payload.newParentSiteId] = true;
        }
      })
    case SiteTypes.CREATED:
      return immer(state, draftState => {
        draftState.siteList[action.payload.site.id] = action.payload.site;
        if(action.payload.parentSiteId && action.payload.site.subSites !== undefined){
          const subSiteCreated = action.payload.site.subSites[action.payload.site.subSites.length - 1];
          const siteReformat: Site = {
            id: subSiteCreated.id,
            name: subSiteCreated.name,
            description: subSiteCreated.description,
            archivedDate: subSiteCreated.archivedDate,
            createdAt: subSiteCreated.createdAt,
          }
          draftState.siteList[subSiteCreated.id] = siteReformat;
          draftState.shownSubSitesInSettings[action.payload.parentSiteId] = true;
        }
        draftState.isCreating = false;
      });
    case SiteTypes.CREATE_REQUESTED:
      return immer(state, draftState => {
        draftState.isCreating = true;
        draftState.creationError = false;
      });
    case SiteTypes.CREATION_ERROR:
      return immer(state, draftState => {
        draftState.isCreating = false;
        draftState.creationError = true;
      });
    case SiteTypes.CREATION_ERROR_REMOVED:
      return immer(state, draftState => {
        draftState.creationError = false;
      });
    case SiteTypes.SITES_EDIT_START:
      return {
        ...state,
        siteEdit: startEdit(state.siteEdit, action.payload.siteId, action.payload.parentSiteId)
      };
    case SiteTypes.SITES_EDIT_END:
      return { 
        ...state,
        siteEdit: INITIAL_STATE.siteEdit 
      };
    case SiteTypes.SITES_EDIT_CLOSE_MODALE:
      return { 
        ...state, 
        siteEdit: {
          ...state.siteEdit, 
          isModalOpened: false
        } 
      };
    case SiteTypes.SHOW_SUB_SITES:
      const {siteId, show} = action.payload;
      return immer(state, draftState => {
        draftState.shownSubSites[siteId] = show;
      });
    case SiteTypes.SHOW_ALL_SUB_SITES:
      const {showSubSites} = action.payload;
      return immer(state, draftState => {
        draftState.shownSubSites = showSubSites;
        draftState.areShown = true;
      });
    case SiteTypes.SHOW_SUB_SITES_IN_SETTINGS:
      return immer(state, draftState => {
        draftState.shownSubSitesInSettings[action.payload.siteId] = action.payload.show;
      });
    case SiteTypes.SHOW_ALL_SUB_SITES_IN_SETTINGS:
      return immer(state, draftState => {
        draftState.shownSubSitesInSettings = action.payload.showSubSites;
        draftState.areShownInSettings = true;
      });
    case SiteTypes.SET_SEARCHED_SITES:
      return {
        ...state,
        searchedTerms: action.payload.searchedTerms
      }
    case SiteTypes.SET_SEARCHED_SITES_IN_SETTINGS:
      return {
        ...state,
        searchedTermsInSettings: action.payload.searchedTerms
      }
    case SiteTypes.SET_SEARCHED_SITES_IN_SITE_CREATION_MODAL_IN_SETTINGS:
      return {
        ...state,
        searchedTermsInSiteCreationModalInSettings: action.payload.searchedTerms
      }
    case SiteTypes.SET_SEARCHED_SITES_IN_SUB_SITE_MODAL_IN_SETTINGS:
      return {
        ...state,
        searchedTermsInSubSiteModalInSettings: action.payload.searchedTerms
      }
    case SiteTypes.RESET_SITES_STATE:
      return INITIAL_STATE;
    default:
      return state;
  }
};

const formatFromServer = (siteListFromServer: SiteListResponse): SiteList => {
  const subSitesId = [];
  return siteListFromServer.reduce((siteList: SiteList, site) => {
    const subSites = site.subSites === undefined ? {} : site.subSites?.reduce((subSiteList: SubSiteList, subSite) => {
      subSiteList[subSite.id] = subSite;
      subSitesId.push(subSite.id);
      return subSiteList;
    }, {} as SubSiteList);
    siteList[site.id] = {
      ...site,
      subSites: subSites
    };
    return siteList;
  }, {} as SiteList);
};

const startEdit = (editState: SiteEditState, siteId: number, parentSiteId: number | null) => {
  return {
    ...editState,
    isEditing: true,
    isModalOpened: true,
    siteId: siteId,
    parentSiteId: parentSiteId
  };
};

export default reducer;
