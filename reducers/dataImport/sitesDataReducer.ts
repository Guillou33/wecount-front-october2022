import { Action } from "@actions/dataImport/sitesData/sitesDataActions";
import { DataImportTypes } from "@actions/dataImport/sitesData/types";
import { DataSitesImportError, SitesDataError } from "@custom-types/core/Sites";
import immer from "immer";

export type DataImportErrors = "other" | "bad-input" | "forbidden";
export type SitesDataList = Record<string, SiteData>;

export type SiteData = {
    id: string;
    name: string;
    description: string;
    parent: string | null;
    level: number;
}
export type State = {
    sitesDataIsParsing: boolean;
    sitesDataList: SitesDataList;
    searchedTermsInParentSiteSelection: Record<string, string>;
    requestStatus: {
      isSaved: boolean;
      isSaving: boolean;
      error: DataImportErrors | null;
    };
  };

const INITIAL_STATE: State = {
    sitesDataIsParsing: false,
    sitesDataList: {},
    searchedTermsInParentSiteSelection: {},
    requestStatus: {
      isSaved: false,
      isSaving: false,
      error: null,
    },
  };

function reducer(state: State = INITIAL_STATE, action: Action): State {
    switch (action.type) {
      case DataImportTypes.SET_PARSING: {
        return { 
          ...state, 
          sitesDataIsParsing: action.payload.isParsing 
        };
      }
      case DataImportTypes.SET_SITES_DATA_LIST: {
        return {
            ...state,
            sitesDataIsParsing: false,
            requestStatus: {
              isSaved: false,
              isSaving: false,
              error: null,
            },
            sitesDataList: action.payload.sitesDataList.reduce((acc, siteData) => {
              acc[siteData.id] = siteData;
              return acc;
            }, {} as SitesDataList),
            searchedTermsInParentSiteSelection: action.payload.sitesDataList.reduce((acc, siteData) => {
              if(siteData.parent){
                acc[siteData.id] = "";
              }
              return acc;
            }, {} as Record<string, string>)
          };
        }
      case DataImportTypes.SAVE_SITE_DATA: {
        return immer(state, draftState => {
          draftState.sitesDataList[action.payload.siteData.id] = action.payload.siteData;
        })
      }
      case DataImportTypes.SAVE_SITE_DATA_IN_API: {
          return { 
            ...state,
            requestStatus: {
              isSaved: false,
              isSaving: true,
              error: null,
            },
          };
        }
      case DataImportTypes.DATA_SAVED: {
        return { 
          ...state,
          sitesDataIsParsing: false,
          sitesDataList: {},
          searchedTermsInParentSiteSelection: {},
          requestStatus: {
            isSaved: action.payload.isSaved,
            isSaving: false,
            error: null,
          },
        };
      }
      case DataImportTypes.DATA_SAVED_ERROR: {
        return { 
          ...state,
          requestStatus: {
            isSaved: false,
            isSaving: false,
            error: action.payload.error,
          },
        };
      }
      case DataImportTypes.RESET_SAVE_STATE: {
        return {
          ...state,
          requestStatus: {
            isSaved: false,
            isSaving: false,
            error: null,
          },
        }
      }
      case DataImportTypes.SET_SEARCHED_SITES_IN_PARENT_SITE_SELECTION:
        return {
          ...state,
          searchedTermsInParentSiteSelection: {
            ...state.searchedTermsInParentSiteSelection,
            [action.payload.siteDataId]: action.payload.searchedTerms
          }
        }
      default:
        return state;
    }
}

export default reducer;