import {
  ReglementationTable,
  ReglementationResults,
  TableType,
} from "@lib/wecount-api/responses/apiResponses";
import { Action } from "@actions/reglementationTables/reglementationTablesActions";
import { ReglementationTablesTypes } from "@actions/reglementationTables/types";

export type Repartition = {
  ratio: number;
  reglementationSubCategoryId: number;
};

type ResultsOf<T extends TableType> = {
  isFetched: boolean;
  isFetching: boolean;
  hasError: boolean;
  results: ReglementationResults[T][];
};

export type ResultsByTableType = { [key in TableType]: ResultsOf<key> };

export type State = {
  isFetched: boolean;
  isFetching: boolean;
  hasError: boolean;
  structure: Record<string, ReglementationTable>;
  dataByCampaign: Record<number, ResultsByTableType>;
};

const initialState: State = {
  isFetched: false,
  isFetching: false,
  hasError: false,
  structure: {},
  dataByCampaign: {},
};

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ReglementationTablesTypes.REGLEMENTATION_TABLES_FETCH_REQUESTED: {
      return { ...state, isFetching: true, hasError: false };
    }
    case ReglementationTablesTypes.SET_REGLEMENTATION_TABLES: {
      return {
        ...state,
        isFetching: false,
        hasError: false,
        isFetched: true,
        ...action.payload,
      };
    }
    case ReglementationTablesTypes.REGLEMENTATION_TABLES_FETCH_FAILED: {
      return { ...state, isFetching: false, hasError: true };
    }
    case ReglementationTablesTypes.REGLEMENTATION_TABLES_CAMPAIGN_DATA_FETCH_REQUESTED: {
      const { campaignId, tableType } = action.payload;
      return {
        ...state,
        dataByCampaign: {
          ...state.dataByCampaign,
          [campaignId]: {
            ...(state.dataByCampaign[campaignId] ?? {}),
            [tableType]: {
              ...(state.dataByCampaign[campaignId]?.[tableType] ?? {}),
              isFetching: true,
              hasError: false,
            },
          },
        },
      };
    }
    case ReglementationTablesTypes.REGLEMENTATION_TABLES_CAMPAIGN_DATA_FETCHED: {
      const { campaignId, tableType, data } = action.payload;
      return {
        ...state,
        dataByCampaign: {
          ...state.dataByCampaign,
          [campaignId]: {
            ...(state.dataByCampaign[campaignId] ?? {}),
            [tableType]: {
              ...(state.dataByCampaign[campaignId]?.[tableType] ?? {}),
              isFetched: true,
              isFetching: false,
              hasError: false,
              results: data,
            },
          },
        },
      };
    }
    case ReglementationTablesTypes.REGLEMENTATION_TABLES_RESET_CAMPAIGN_DATA: {
      return {
        ...state,
        dataByCampaign: {},
      };
    }
    case ReglementationTablesTypes.REGLEMENTATION_TABLES_CAMPAIGN_DATA_FETCH_FAILED: {
      const { campaignId, tableType } = action.payload;
      return {
        ...state,
        dataByCampaign: {
          ...state.dataByCampaign,
          [campaignId]: {
            ...(state.dataByCampaign[campaignId] ?? {}),
            [tableType]: {
              ...(state.dataByCampaign[campaignId]?.[tableType] ?? {}),
              isFetched: false,
              isFetching: false,
              hasError: true,
              results: [],
            },
          },
        },
      };
    }
    default:
      return state;
  }
}

export default reducer;
