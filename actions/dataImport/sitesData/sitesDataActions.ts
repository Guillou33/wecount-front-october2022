import { SiteDataForCreation } from "@custom-types/core/Sites";
import { SiteData } from "@reducers/dataImport/sitesDataReducer";
import { DataImportTypes } from "./types";
import { DataImportErrors } from "@reducers/dataImport/sitesDataReducer";

export type Action =
  | SetSitesDataList
  | SetParsing
  | SaveSiteData
  | SaveSiteDataInApi
  | SetSearchedSitesInParentSiteSelection
  | DataSaved
  | DataSavedError
  | ResetSaveState
  | ResetSitesData;

export interface SetSitesDataList {
  type: DataImportTypes.SET_SITES_DATA_LIST;
  payload: {
    sitesDataList: SiteData[];
  };
}

interface SetParsing {
  type: DataImportTypes.SET_PARSING;
  payload: {
    isParsing: boolean;
  };
}

interface SaveSiteData {
  type: DataImportTypes.SAVE_SITE_DATA;
  payload: {
    siteData: SiteData;
    allSitesName: string[];
  }
}

export interface ResetSitesData {
  type: DataImportTypes.RESET_SITES_DATA;
  payload: {}
}

export interface SaveSiteDataInApi {
  type: DataImportTypes.SAVE_SITE_DATA_IN_API;
  payload: {
    perimeterId: number;
    siteData: SiteDataForCreation[];
  }
}

export interface DataSaved {
  type: DataImportTypes.DATA_SAVED;
  payload: {
    perimeterId: number;
    isSaved: boolean;
  };
}

export interface DataSavedError {
  type: DataImportTypes.DATA_SAVED_ERROR;
  payload: {
    error: DataImportErrors;
  };
}

export interface ResetSaveState {
  type: DataImportTypes.RESET_SAVE_STATE;
  payload: {};
}

export interface SetShownSubSitesInSite {
  type: DataImportTypes.SHOW_SUB_SITES;
  payload: {
    siteId: number;
    show: boolean;
  }
}

export function setSitesDataList(
  payload: SetSitesDataList["payload"]
): SetSitesDataList {
  return {
    type: DataImportTypes.SET_SITES_DATA_LIST,
    payload,
  };
}

export function setParsing(payload: SetParsing["payload"]): SetParsing {
  return {
    type: DataImportTypes.SET_PARSING,
    payload,
  };
}

export function saveSiteData(payload: SaveSiteData["payload"]): SaveSiteData{
  return {
    type: DataImportTypes.SAVE_SITE_DATA,
    payload,
  };
}

export function saveSiteDataInApi(payload: SaveSiteDataInApi["payload"]): SaveSiteDataInApi {
  return {
    type: DataImportTypes.SAVE_SITE_DATA_IN_API,
    payload,
  };
}

export function dataSaved({perimeterId, isSaved}: DataSaved["payload"]): DataSaved {
  return {
    type: DataImportTypes.DATA_SAVED,
    payload: {
      perimeterId: perimeterId,
      isSaved: isSaved
    },
  };
}

export function dataSavingFailed(
  payload: DataSavedError["payload"]
): DataSavedError {
  return {
    type: DataImportTypes.DATA_SAVED_ERROR,
    payload,
  };
}

export function resetSaveState(

): ResetSaveState {
  return {
    type: DataImportTypes.RESET_SAVE_STATE,
    payload: {}
  };
}

export const resetSitesData = () => {
  return {
    type: DataImportTypes.RESET_SITES_DATA,
    payload: {},
  };
}

export interface SetSearchedSitesInParentSiteSelection {
  type: DataImportTypes.SET_SEARCHED_SITES_IN_PARENT_SITE_SELECTION;
  payload: {
    searchedTerms: string;
    siteDataId: string; 
  }
}
  
export function setSearchedSitesInParentSiteSelection (
  payload: SetSearchedSitesInParentSiteSelection["payload"]
): SetSearchedSitesInParentSiteSelection {
  return {
    type: DataImportTypes.SET_SEARCHED_SITES_IN_PARENT_SITE_SELECTION,
    payload
  }
}