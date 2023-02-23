import { ArchiveRequestedAction as ArchiveProductRequested } from "@actions/core/product/productActions";
import { ProductTypes } from "@actions/core/product/types";
import { ArchiveRequestedAction as ArchiveSiteRequested } from "@actions/core/site/siteActions";
import { SiteTypes } from "@actions/core/site/types";
import { DataSaved as DataImportDataSaved } from "@actions/dataImport/entryData/entryDataActions";
import { DataImportTypes } from "@actions/dataImport/entryData/types";
import { Action } from "@actions/entries/campaignEntriesAction";
import { CampaignEntriesTypes } from "@actions/entries/campaignEntriesTypes";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { CampaignType } from "@custom-types/core/CampaignType";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import { Status } from "@custom-types/core/Status";
import { DEFAULT_UNCERTAINTY } from "@custom-types/core/Uncertainty";
import { SearchType } from "@custom-types/wecount-api/searchTypes";
import {
  ActivityEntryReferenceResponse,
  CustomEmissionFactorResponse,
  EmissionFactorResponse
} from "@lib/wecount-api/responses/apiResponses";
import immer from "immer";
import { uniqueId } from "lodash";

export type EmissionFactor = EmissionFactorResponse;

export interface WritableEntryData {
  manualTco2: number | null;
  manualUnitNumber: number | null;
  value: number | null;
  value2: number | null;
  uncertainty: number;
  description: string | null;
  title: string | null;
  dataSource: string | null;
  productId: number | null;
  siteId: number | null;
  emissionFactorId: number | null;
  customEmissionFactorId: number | null;
  status: Status;
  computeMethodType?: ComputeMethodType;
  computeMethodId: number | null;
  instruction: string | null;
  ownerId: number | null;
  writerId: number | null;
  isExcludedFromTrajectory: boolean;
  entryTagIds: number[];
}

export interface ActivityEntryReferenceHistory {
  campaignYear: number;
  campaignStatus: CampaignStatus;
  campaignType: CampaignType;
  emissionFactor: EmissionFactorResponse | null;
  customEmissionFactor: CustomEmissionFactorResponse | null;
  id: number;
  createdAt: string;
  updatedAt: string;
  value: number | null;
  value2: number | null;
  uncertainty: number;
  resultTco2: number;
  title: string | null;
  description: string | null;
  instruction: string | null;
  dataSource: string | null;
  manualTco2: number | null;
  manualUnitNumber: number | null;
  computeMethodType: ComputeMethodType;
  computeMethod: {
    id: number;
    name: string;
    description: string | null;
    position: number;
    isDefault: boolean;
    emissionFactorLabel: string;
    valueName: string;
    value2Name: string;
    emissionFactorSearchType: SearchType;
    archivedDate: string | null;
  } | null;
  input1Unit: string | undefined;
  input2Unit: string | undefined;
  ownerId: number | null;
  writerId: number | null;
  entryTagIds: number[];
}

export interface EntryData extends WritableEntryData {
  id: number | undefined;
  activityEntryReference: ActivityEntryReferenceResponse | null;
  emissionFactor: EmissionFactor | null;
  customEmissionFactor: CustomEmissionFactorResponse | null;
  resultTco2: number;
  input1Unit: string | undefined;
  input2Unit: string | undefined;
  createdAt?: string;
  updatedAt?: string;
  activityModelId: number;
  activityEntryReferenceHistoryList: ActivityEntryReferenceHistory[];
}

export type EntriesState = {
  [key: string]: {
    entryData: EntryData;
    hasPendingRequest: boolean;
    hasError: boolean;
  };
};

export interface State {
  [campaignId: number]: {
    entries: EntriesState;
  };
}

const initialState: State = {};

function reducer(
  state: State = initialState,
  action: Action | ArchiveSiteRequested | ArchiveProductRequested | DataImportDataSaved
): State {
  switch (action.type) {
    case CampaignEntriesTypes.ADD_ENTRY: {
      const { campaignId, entry } = action.payload;
      const entriesStored = {
        [campaignId]: {
          ...state[campaignId],
          entries: {
            [entry.id?.toString() ?? uniqueId("temp_id_")]: {
              hasError: false,
              hasPendingRequest: false,
              entryData: entry,
            },
            ...state[campaignId].entries,
          }
        },
      };
      return entriesStored;
    }
    case CampaignEntriesTypes.SET_ALL_ENTRIES: {
      const { campaignId, entries } = action.payload;
      const entriesStored = {
        [campaignId]: {
          ...state[campaignId],
          entries: entries.reduce((acc, entry) => {
            acc[entry.id?.toString() ?? uniqueId("temp_id_")] = {
              hasError: false,
              hasPendingRequest: false,
              entryData: entry,
            };
            return acc;
          }, {} as EntriesState),
        },
      };

      return entriesStored;
    }
    case CampaignEntriesTypes.SET_ALL_ENTRIES_OF_CAMPAIGNS: {
      return immer(state, draftState => {
        action.payload.forEach(campaignEntries => {
          const { campaignId, entries } = campaignEntries;
          if (draftState[campaignId] == null) {
            draftState[campaignId] = { entries: {} };
          }
          draftState[campaignId].entries = entries.reduce((acc, entry) => {
            acc[entry.id?.toString() ?? uniqueId("temp_id_")] = {
              hasError: false,
              hasPendingRequest: false,
              entryData: entry,
            };
            return acc;
          }, {} as EntriesState);
        });
      });
    }
    case CampaignEntriesTypes.FETCH_ENTRIES_AFTER_SELECTION: {
      const { campaignId, entries, cardExpansionName } = action.payload;
      const entriesStored = {
        ...state,
        [campaignId]: {
          ...state[campaignId],
          entries: entries.reduce((acc, entry) => {
            acc[entry.id?.toString() ?? uniqueId("temp_id_")] = {
              hasError: false,
              hasPendingRequest: false,
              entryData: entry,
            };
            return acc;
          }, {} as EntriesState),
        },
      };

      return entriesStored;
    }
    case CampaignEntriesTypes.DELETE_ENTRIES_IN_SELECTION: {
      const { campaignId, list } = action.payload;
      return immer(state, draftState => {
        list.forEach(entryKey => {
          delete draftState[campaignId].entries[entryKey];
        });
      });
    }
    case CampaignEntriesTypes.UPDATE_ENTRY_REQUESTED: {
      const { campaignId, entryKey, entryData } = action.payload;
      return immer(state, draftState => {
        draftState[campaignId].entries[entryKey].hasPendingRequest = true;
        draftState[campaignId].entries[entryKey].hasError = false;
        draftState[campaignId].entries[entryKey].entryData = {
          ...draftState[campaignId].entries[entryKey].entryData,
          ...entryData,
        };
      });
    }
    case CampaignEntriesTypes.UPDATE_ENTRY: {
      const { campaignId, entryKey, entryData } = action.payload;
      return immer(state, draftState => {
        draftState[campaignId].entries[entryKey].hasPendingRequest = false;
        draftState[campaignId].entries[entryKey].hasError = false;
        draftState[campaignId].entries[entryKey].entryData = {
          ...draftState[campaignId].entries[entryKey].entryData,
          ...entryData,
        };
      });
    }
    case CampaignEntriesTypes.SET_ENTRY_COMPUTE_METHOD: {
      const { campaignId, entryKey, computeMethodType, computeMethodId } =
        action.payload;
      return immer(state, draftState => {
        draftState[campaignId].entries[entryKey].entryData.computeMethodId =
          computeMethodId;
        draftState[campaignId].entries[entryKey].entryData.computeMethodType =
          computeMethodType;
      });
    }
    case CampaignEntriesTypes.ADD_BLANK_ENTRY: {
      const { campaignId } = action.payload;
      return immer(state, draftState => {
        draftState[campaignId].entries[uniqueId("temp_id_")] = {
          hasError: false,
          hasPendingRequest: false,
          entryData: getBlankEntry(action.payload),
        };
      });
    }
    case CampaignEntriesTypes.DELETE_ENTRY_REQUESTED: {
      const { campaignId, entryKey } = action.payload;
      return immer(state, draftState => {
        delete draftState[campaignId].entries[entryKey];
      });
    }
    case CampaignEntriesTypes.API_REQUEST_FAILED: {
      const { campaignId, entryKey } = action.payload;
      return immer(state, draftState => {
        draftState[campaignId].entries[entryKey].hasPendingRequest = false;
        draftState[campaignId].entries[entryKey].hasError = true;
      });
    }
    case CampaignEntriesTypes.ENTRY_SUBMISSION_REQUESTED: {
      const { campaignId, entryKey } = action.payload;
      return immer(state, draftState => {
        draftState[campaignId].entries[entryKey].entryData.status =
          Status.TO_VALIDATE;
      });
    }
    case CampaignEntriesTypes.HISTORY_FETCHED: {
      const {
        campaignId,
        activityEntryId,
        activityEntryKey,
        activityEntryReferenceHistoryList,
      } = action.payload;
      return immer(state, draftState => {
        draftState[campaignId].entries[
          activityEntryKey
        ].entryData.activityEntryReferenceHistoryList = activityEntryReferenceHistoryList;
      });
    }
    case CampaignEntriesTypes.RESET_OWNER_ON_ALL_ENTRIES: {
      const { ownerId } = action.payload;
      return immer(state, draftState => {
        Object.values(draftState).forEach(campaignEntries => {
          Object.values(campaignEntries.entries).forEach(entry => {
            if (entry.entryData.ownerId === ownerId) {
              entry.entryData.ownerId = null;
            }
          });
        });
      });
    }
    case SiteTypes.ARCHIVE_REQUESTED: {
      const { siteId } = action.payload;
      return immer(state, draftState => {
        Object.values(draftState).forEach(campaignEntries => {
          Object.values(campaignEntries.entries).forEach(entry => {
            if (entry.entryData.siteId === siteId) {
              entry.entryData.siteId = null;
            }
          });
        });
      });
    }
    case ProductTypes.ARCHIVE_REQUESTED: {
      const { productId } = action.payload;
      return immer(state, draftState => {
        Object.values(draftState).forEach(campaignEntries => {
          Object.values(campaignEntries.entries).forEach(entry => {
            if (entry.entryData.productId === productId) {
              entry.entryData.productId = null;
            }
          });
        });
      });
    }
    case CampaignEntriesTypes.RESET: {
      return initialState;
    }
    case DataImportTypes.DATA_SAVED: {
      return immer(state, draftState => {
        delete draftState[action.payload.campaignId]
      })
    }
    case CampaignEntriesTypes.KEEP_ONLY_ENTRIES_FOR_CAMPAIGN: {
      return immer(state, draftState => {
        Object.keys(draftState).forEach((campaignIdString) => {
          const campaignId = parseInt(campaignIdString);
          if (campaignId !== action.payload.campaignId) {
            delete draftState[campaignId];
          }
        });
      });
    }
    default:
      return state;
  }
}

function getBlankEntry({
  activityModelId,
  status,
  siteId,
  productId,
  entryTagIds,
}: {
  activityModelId: number;
  status: Status;
  siteId: number | null;
  productId: number | null;
  entryTagIds: number[];
}): EntryData {
  return {
    id: undefined,
    emissionFactor: null,
    customEmissionFactor: null,
    activityEntryReference: null,
    value: null,
    value2: null,
    uncertainty: DEFAULT_UNCERTAINTY,
    resultTco2: 0,
    title: null,
    description: null,
    dataSource: null,
    manualTco2: null,
    manualUnitNumber: null,
    emissionFactorId: null,
    customEmissionFactorId: null,
    isExcludedFromTrajectory: false,
    productId: productId,
    siteId: siteId,
    status: status,
    computeMethodType: undefined,
    computeMethodId: null,
    input1Unit: undefined,
    input2Unit: undefined,
    instruction: null,
    activityModelId,
    ownerId: null,
    writerId: null,
    activityEntryReferenceHistoryList: [],
    entryTagIds,
  };
}

export default reducer;
