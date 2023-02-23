import immer from "immer";

import { Action } from "@actions/perimeter/perimeterActions";
import { PerimeterTypes } from "@actions/perimeter/types";
import { PerimeterManagementViewItem } from "@components/perimeter/sub/PerimeterManagementView";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { CampaignType } from "@custom-types/core/CampaignType";
import { Scope } from "@custom-types/wecount-api/activity";
import { PerimeterActivityResponse, PerimeterResponse } from "@lib/wecount-api/responses/apiResponses";

export type ShowActivityModelsInTable = {
    [categoryId: number]: boolean;
}

export type PerimetersById = {
  [perimeterId: number]: PerimeterResponse;
};

export type ActivityModelEmission = {
  tco2Included: number;
  tco2Excluded: number;
  nbrEntriesIncluded: number;
  nbrEntriesExcluded: number;
}

export type ActivityModelsEmission = {
  [activityModelId: number]: ActivityModelEmission
}

export type CategoryEmission = {
  tco2Included: number;
  tco2Excluded: number;
  nbrEntriesIncluded: number;
  nbrEntriesExcluded: number;
  activityModels: ActivityModelsEmission;
}

export type CategoriesEmission = {
  [categoryId: number]: CategoryEmission
}

export type ScopeEmissions = {
  [Scope.UPSTREAM]: {
    tco2Included: number;
    tco2Excluded: number;
    nbrEntriesIncluded: number;
    nbrEntriesExcluded: number;
    categories: CategoriesEmission;
  },
  [Scope.CORE]: {
    tco2Included: number;
    tco2Excluded: number;
    nbrEntriesIncluded: number;
    nbrEntriesExcluded: number;
    categories: CategoriesEmission;
  }
  [Scope.DOWNSTREAM]: {
    tco2Included: number;
    tco2Excluded: number;
    nbrEntriesIncluded: number;
    nbrEntriesExcluded: number;
    categories: CategoriesEmission;
  }
}

export type CampaignEmission = {
  id: number;
  status: CampaignStatus;
  type: CampaignType;
  name: string;
  resultTco2Upstream: number;
  resultTco2Core: number;
  resultTco2Downstream: number;
  resultTco2UpstreamForTrajectory: number;
  resultTco2CoreForTrajectory: number;
  resultTco2DownstreamForTrajectory: number;
  year: number;
  perimeterId: number;
};

export type CampaignEmissions = {
  [campaignId: number]: {
    id: number;
    status: CampaignStatus;
    type: CampaignType;
    name: string;
    resultTco2Upstream: number;
    resultTco2Core: number;
    resultTco2Downstream: number;
    resultTco2UpstreamForTrajectory: number;
    resultTco2CoreForTrajectory: number;
    resultTco2DownstreamForTrajectory: number;
    year: number;
    scopes?: ScopeEmissions;
  }
};

export type PerimetersByEmission = {
  [perimeterId: number]: {
    id: number;
    name: string;
    description: string | null;
    campaigns: CampaignEmissions;
  }
};

type PerimeterState = {
  currentPerimeter: number | null;
  perimeters: PerimetersById;
  emissions: PerimetersByEmission;
  isCreating: boolean;
  perimetersFetched: boolean;
  isFetchingAllPerimeters: boolean;
  emissionsFetched: boolean;
  perimeterView: PerimeterManagementViewItem;
  synthesis: {
    filter: {
      selection: number[];
      status: CampaignStatus[];
      years: number[];
    };
    display: {
      excluded: number;
    },
    table: {
      shownCategories: {
        emissions: {
          [Scope.UPSTREAM]: boolean;
          [Scope.CORE]: boolean;
          [Scope.DOWNSTREAM]: boolean;
        },
        percentages: {
          [Scope.UPSTREAM]: boolean;
          [Scope.CORE]: boolean;
          [Scope.DOWNSTREAM]: boolean;
        }
      },
      shownActivityModels: {
        emissions: ShowActivityModelsInTable;
        percentages: ShowActivityModelsInTable;
      }
    }
  }
};

const initialStateForPerimeterManagementView: PerimeterManagementViewItem = PerimeterManagementViewItem.MONITORING;

const initialState: PerimeterState = {
  currentPerimeter: null,
  perimeters: {},
  emissions: {},
  isCreating: false,
  perimetersFetched: false,
  isFetchingAllPerimeters: false,
  emissionsFetched: false,
  perimeterView: initialStateForPerimeterManagementView,
  synthesis: {
    filter: {
      selection: [],
      status: [],
      years: [],
    },
    display: {
      excluded: 3
    },
    table: {
      shownCategories: {
        emissions: {
          [Scope.UPSTREAM]: false,
          [Scope.CORE]: false,
          [Scope.DOWNSTREAM]: false
        },
        percentages: {
          [Scope.UPSTREAM]: false,
          [Scope.CORE]: false,
          [Scope.DOWNSTREAM]: false
        }
      },
      shownActivityModels: {
        emissions: {},
        percentages: {}
      }
    }
  }
};

function reducer(
  state: PerimeterState = initialState,
  action: Action
): PerimeterState {
  switch (action.type) {
    case PerimeterTypes.SET_PERIMETER_MANAGEMENT_VIEW:
      return { ...state, perimeterView: action.payload.perimeterView };
    case PerimeterTypes.SET_ALL_PERIMETERS_REQUEST_STARTED: {
      return { ...state, isFetchingAllPerimeters: true };
    }
    case PerimeterTypes.SET_ALL_PERIMETERS: {
      const perimetersById = action.payload.reduce((acc, perimeter) => {
        acc[perimeter.id] = perimeter;
        return acc;
      }, {} as PerimetersById);
      return { ...state, perimeters: perimetersById, perimetersFetched: true, isFetchingAllPerimeters: false };
    }
    case PerimeterTypes.SET_PERIMETERS_EMISSIONS: {
      const {activities, synthesis} = action.payload;
      const perimetersByEmission = synthesis.reduce((acc, perimeter) => {
        acc[perimeter.id] = perimeter;
        acc[perimeter.id]["campaigns"] = perimeter.campaigns.reduce((accCampaign, campaign) => {
          const scopesList = formatScopes(activities.filter(activity => activity.campaignId === campaign.id));
          accCampaign[campaign.id] = campaign;
          accCampaign[campaign.id]["scopes"] = scopesList;
          return accCampaign;
        }, {} as CampaignEmissions);
        return acc;
      }, {} as PerimetersByEmission);
      return { 
        ...state, 
        emissions: perimetersByEmission, 
        emissionsFetched: true,
      };
    }

    case PerimeterTypes.SET_CURRENT_PERIMETER: {
      return { ...state, currentPerimeter: action.payload };
    }
    case PerimeterTypes.APPEND_PERIMETER: {
      return {
        ...state,
        perimeters: {
          ...state.perimeters,
          [action.payload.id]: action.payload,
        },
      };
    }
    case PerimeterTypes.SET_PERIMETER_CREATING: {
      return { ...state, isCreating: action.payload };
    }
    case PerimeterTypes.REMOVE_PERIMETER: {
      return immer(state, draftState => {
        delete draftState.perimeters[action.payload];
        delete draftState.emissions[action.payload];
        if(draftState.currentPerimeter === action.payload){
          draftState.currentPerimeter = null;
        }
      });
    }
    case PerimeterTypes.UPDATE_PERIMETER: {
      return {
        ...state,
        perimeters: {
          ...state.perimeters,
          [action.payload.id]: action.payload,
        },
        emissions: {
          ...state.emissions,
          [action.payload.id]: {
            ...state.emissions[action.payload.id],
            name: action.payload.name,
            description: action.payload.description
          }
        }
      };
    }
    case PerimeterTypes.SET_EXCLUDED_DATA: 
      return immer(state, draftState => {
        draftState.synthesis.display.excluded = action.payload.excluded;
      });
    case PerimeterTypes.SET_SELECTION_FOR_SYNTHESIS: 
      return immer(state, draftState => {
        draftState.synthesis.filter.selection = action.payload.selection;
      });
    case PerimeterTypes.SET_STATUS_FOR_SYNTHESIS: 
      return immer(state, draftState => {
        draftState.synthesis.filter.status = action.payload.status;
        draftState.synthesis.filter.selection = [];
      });
    case PerimeterTypes.SET_YEARS_FOR_SYNTHESIS:
      return immer(state, draftState => {
        draftState.synthesis.filter.years = action.payload.years;
        draftState.synthesis.filter.selection = [];
      });
    case PerimeterTypes.CLEAR_FILTERS:
      return immer(state, draftState => {
        draftState.synthesis.filter.selection = [];
        draftState.synthesis.filter.status = [];
        draftState.synthesis.filter.years = [];
      });
    case PerimeterTypes.SHOW_CATEGORIES_FOR_SYNTHESIS:
      const {
        categories,
        rowCategories
      } = action.payload;
      return immer(state, draftState => {
        if(rowCategories === "emissions"){
          draftState.synthesis.table.shownCategories.emissions = categories;
        }
        if(rowCategories === "percentages"){
          draftState.synthesis.table.shownCategories.percentages = categories;
        }
      });
    case PerimeterTypes.SHOW_ACTIVITY_MODELS_FOR_SYNTHESIS: 
      const {
        activityModels,
        rowActivityModels
      } = action.payload;
      return immer(state, draftState => {
        if(rowActivityModels === "emissions"){
          draftState.synthesis.table.shownActivityModels.emissions = activityModels;
        }
        if(rowActivityModels === "percentages"){
          draftState.synthesis.table.shownActivityModels.percentages = activityModels;
        }
      });
    default:
      return state;
  }
}
const formatActivityModels = (activities: PerimeterActivityResponse[]): ActivityModelsEmission => {
  const activityModels = [...new Set<number>(activities.map(activity => activity.activityModelId))].reduce((acc, id) => {
    let activityModelTco2 = {
      tco2Included: 0,
      tco2Excluded: 0,
      nbrEntriesIncluded: 0,
      nbrEntriesExcluded: 0,
    }
    activities.filter(activity => activity.activityModelId === id).forEach(activity => {
      activityModelTco2.nbrEntriesExcluded = (parseInt(activity.nbrEntriesExcluded) + activityModelTco2.nbrEntriesExcluded);
      activityModelTco2.nbrEntriesIncluded = (parseInt(activity.nbrEntriesIncluded) + activityModelTco2.nbrEntriesIncluded);
      activityModelTco2.tco2Excluded += activity.tco2Excluded;
      activityModelTco2.tco2Included += activity.tco2Included;
    });
    acc[id] = activityModelTco2;
    return acc;
  }, {} as ActivityModelsEmission);
  return activityModels;
}

const formatCategories = (activities: PerimeterActivityResponse[]): CategoriesEmission => {
  const categories = [...new Set<number>(activities.map(activity => activity.categoryId))].reduce((acc, id) => {
    let categoryTco2 = {
      tco2Included: 0,
      tco2Excluded: 0,
      nbrEntriesIncluded: 0,
      nbrEntriesExcluded: 0,
      activityModels: formatActivityModels(activities.filter(activity => activity.categoryId === id))
    }
    activities.filter(activity => activity.categoryId === id).forEach(activity => {
      categoryTco2.nbrEntriesExcluded = (parseInt(activity.nbrEntriesExcluded) + categoryTco2.nbrEntriesExcluded);
      categoryTco2.nbrEntriesIncluded = (parseInt(activity.nbrEntriesIncluded) + categoryTco2.nbrEntriesIncluded);
      categoryTco2.tco2Excluded += activity.tco2Excluded;
      categoryTco2.tco2Included += activity.tco2Included;
    });
    acc[id] = categoryTco2;
    return acc;
  }, {} as CategoriesEmission);
  return categories;
}

const formatScopes = (activities: PerimeterActivityResponse[]): ScopeEmissions => {
  let upstreamTco2 = {
    tco2Included: 0,
    tco2Excluded: 0,
    nbrEntriesIncluded: 0,
    nbrEntriesExcluded: 0,
    categories: formatCategories(activities.filter(activity => activity.scope === Scope.UPSTREAM))
  };
  
  activities.filter(activity => activity.scope === Scope.UPSTREAM).forEach(activity => {
    upstreamTco2.nbrEntriesExcluded = (parseInt(activity.nbrEntriesExcluded) + upstreamTco2.nbrEntriesExcluded);
    upstreamTco2.nbrEntriesIncluded = (parseInt(activity.nbrEntriesIncluded) + upstreamTco2.nbrEntriesIncluded);
    upstreamTco2.tco2Excluded += activity.tco2Excluded;
    upstreamTco2.tco2Included += activity.tco2Included;
  });

  let coreTco2 = {
    tco2Included: 0,
    tco2Excluded: 0,
    nbrEntriesIncluded: 0,
    nbrEntriesExcluded: 0,
    categories: formatCategories(activities.filter(activity => activity.scope === Scope.CORE))
  };
  activities.filter(activity => activity.scope === Scope.CORE).forEach(activity => {
    coreTco2.nbrEntriesExcluded = (parseInt(activity.nbrEntriesExcluded) + coreTco2.nbrEntriesExcluded);
    coreTco2.nbrEntriesIncluded = (parseInt(activity.nbrEntriesIncluded) + coreTco2.nbrEntriesIncluded);
    coreTco2.tco2Excluded += activity.tco2Excluded;
    coreTco2.tco2Included += activity.tco2Included;
  });

  let downstreamTco2 = {
    tco2Included: 0,
    tco2Excluded: 0,
    nbrEntriesIncluded: 0,
    nbrEntriesExcluded: 0,
    categories: formatCategories(activities.filter(activity => activity.scope === Scope.DOWNSTREAM))
  };
  activities.filter(activity => activity.scope === Scope.DOWNSTREAM).forEach(activity => {
    downstreamTco2.nbrEntriesExcluded = (parseInt(activity.nbrEntriesExcluded) + downstreamTco2.nbrEntriesExcluded);
    downstreamTco2.nbrEntriesIncluded = (parseInt(activity.nbrEntriesIncluded) + downstreamTco2.nbrEntriesIncluded);
    downstreamTco2.tco2Excluded += activity.tco2Excluded;
    downstreamTco2.tco2Included += activity.tco2Included;
  });

  const scopes = {
    [Scope.UPSTREAM]: upstreamTco2,
    [Scope.CORE]: coreTco2,
    [Scope.DOWNSTREAM]: downstreamTco2
  }

  return scopes;
}

export default reducer;
