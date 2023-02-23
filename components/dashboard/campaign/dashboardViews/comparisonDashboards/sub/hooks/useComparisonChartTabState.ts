import { useReducer } from "react";
import immer from "immer";

type ComparisonChartTabState = {
  campaignToCompareId: number;
  userSelectionOfEntryComparison: {
    activityModelId: number;
    excludedEntryHistoryCodes: Record<string, true>;
  };
};

type Action =
  | SetCampaignToCompareId
  | SetActivityModelSelection
  | ToggleHistoryCode;

interface SetCampaignToCompareId {
  type: "set-compare-to-campaign-id";
  payload: {
    campaignToCompareId: number;
  };
}

interface SetActivityModelSelection {
  type: "set-activity-model-selection";
  payload: {
    activityModelId: number;
  };
}

interface ToggleHistoryCode {
  type: "toggle-entry-history";
  payload: {
    entryHistoryCode: string;
  };
}

function reducer(
  state: ComparisonChartTabState,
  action: Action
): ComparisonChartTabState {
  switch (action.type) {
    case "set-compare-to-campaign-id": {
      const { campaignToCompareId } = action.payload;
      return {
        ...state,
        campaignToCompareId,
        userSelectionOfEntryComparison: {
          ...state.userSelectionOfEntryComparison,
          excludedEntryHistoryCodes: {},
        },
      };
    }
    case "set-activity-model-selection": {
      const { activityModelId } = action.payload;
      return {
        ...state,
        userSelectionOfEntryComparison: {
          activityModelId,
          excludedEntryHistoryCodes: {},
        },
      };
    }
    case "toggle-entry-history": {
      const { entryHistoryCode } = action.payload;
      return immer(state, drafState => {
        const isExcluded =
          state.userSelectionOfEntryComparison.excludedEntryHistoryCodes[
            entryHistoryCode
          ];
        if (isExcluded) {
          delete drafState.userSelectionOfEntryComparison
            .excludedEntryHistoryCodes[entryHistoryCode];
        } else {
          drafState.userSelectionOfEntryComparison.excludedEntryHistoryCodes[
            entryHistoryCode
          ] = true;
        }
      });
    }
    default:
      return state;
  }
}

function useComparisonChartTabState(
  initialCampaignId: number,
  initialActivityModelId: number
) {
  const defaultState: ComparisonChartTabState = {
    campaignToCompareId: initialCampaignId,
    userSelectionOfEntryComparison: {
      activityModelId: initialActivityModelId,
      excludedEntryHistoryCodes: {},
    },
  };
  const [state, dispatch] = useReducer(reducer, defaultState);

  function setCampaignToCompareId(campaignToCompareId: number) {
    dispatch({
      type: "set-compare-to-campaign-id",
      payload: { campaignToCompareId },
    });
  }

  function setActivityModelId(activityModelId: number) {
    dispatch({
      type: "set-activity-model-selection",
      payload: { activityModelId },
    });
  }

  function toggleEntryHistory(entryHistoryCode: string) {
    dispatch({
      type: "toggle-entry-history",
      payload: {
        entryHistoryCode,
      },
    });
  }

  return [
    state,
    setCampaignToCompareId,
    setActivityModelId,
    toggleEntryHistory,
  ] as const;
}

export default useComparisonChartTabState;
