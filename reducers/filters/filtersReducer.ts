import { FiltersActionType } from "@actions/filters/types";
import { FilterAction } from "@actions/filters/filtersAction";

import { Status } from "@custom-types/core/Status";

export type IdHashMapFilterName =
  | FilterNames.CARTOGRAPHY_OWNER
  | FilterNames.CARTOGRAPHY_WRITER;

export type StatusHashMapFilterName = FilterNames.CARTOGRAPHY_STATUSES;

export type SearchableFilterName =
  | FilterNames.CARTOGRAPHY_SITES
  | FilterNames.CARTOGRAPHY_PRODUCTS
  | FilterNames.CARTOGRAPHY_ENTRY_TAGS
  | FilterNames.CARTOGRAPHY_EMISSION_FACTORS
  | FilterNames.LISTING_VIEW_ACTIVITY_MODELS
  | FilterNames.LISTING_VIEW_CATEGORIES;

export type ExcludedFilterName = FilterNames.CARTOGRAPHY_EXCLUDED;

export type UserDataFilterName = FilterNames.CARTOGRAPHY_USER_DATA;

export enum FilterNames {
  CARTOGRAPHY_EXCLUDED = "cartographyExcluded",
  CARTOGRAPHY_SITES = "cartographySites",
  CARTOGRAPHY_PRODUCTS = "cartographyProducts",
  CARTOGRAPHY_STATUSES = "cartographyStatuses",
  CARTOGRAPHY_EMISSION_FACTORS = "cartographyEmissionFactors",
  LISTING_VIEW_ACTIVITY_MODELS = "listingViewActivityModels",
  LISTING_VIEW_CATEGORIES = "listingViewCategories",
  CARTOGRAPHY_USER_DATA = "cartographyUserData",
  CARTOGRAPHY_OWNER = "cartographyOwner",
  CARTOGRAPHY_WRITER = "cartographyWriter",
  CARTOGRAPHY_ENTRY_TAGS = "cartographyEntryTags",
}

export type PresenceHashMap<T extends string | number> = {
  [key in T]?: true;
};

export type SearchableFilter = {
  searchedTerm: string;
  elementIds: PresenceHashMap<number>;
};

export type ExcludedFilter = {
  excludedEntries: number;
};

export type UserDataFilter = {
  userId: number | null;
};

type State = {
  [FilterNames.CARTOGRAPHY_EXCLUDED]: ExcludedFilter;
  [FilterNames.CARTOGRAPHY_SITES]: SearchableFilter;
  [FilterNames.CARTOGRAPHY_PRODUCTS]: SearchableFilter;
  [FilterNames.CARTOGRAPHY_STATUSES]: PresenceHashMap<Status>;
  [FilterNames.CARTOGRAPHY_EMISSION_FACTORS]: SearchableFilter;
  [FilterNames.CARTOGRAPHY_USER_DATA]: UserDataFilter;
  [FilterNames.CARTOGRAPHY_OWNER]: PresenceHashMap<number>;
  [FilterNames.CARTOGRAPHY_WRITER]: PresenceHashMap<number>;
  [FilterNames.CARTOGRAPHY_ENTRY_TAGS]: SearchableFilter;

  [FilterNames.LISTING_VIEW_ACTIVITY_MODELS]: SearchableFilter;
  [FilterNames.LISTING_VIEW_CATEGORIES]: SearchableFilter;
};

const initialState: State = {
  [FilterNames.CARTOGRAPHY_EXCLUDED]: {
    excludedEntries: 1,
  },
  [FilterNames.CARTOGRAPHY_SITES]: {
    searchedTerm: "",
    elementIds: {},
  },
  [FilterNames.CARTOGRAPHY_PRODUCTS]: {
    searchedTerm: "",
    elementIds: {},
  },
  [FilterNames.CARTOGRAPHY_STATUSES]: {},
  [FilterNames.CARTOGRAPHY_EMISSION_FACTORS]: {
    searchedTerm: "",
    elementIds: {},
  },
  [FilterNames.LISTING_VIEW_ACTIVITY_MODELS]: {
    searchedTerm: "",
    elementIds: {},
  },
  [FilterNames.LISTING_VIEW_CATEGORIES]: {
    searchedTerm: "",
    elementIds: {},
  },
  [FilterNames.CARTOGRAPHY_USER_DATA]: {
    userId: null,
  },
  [FilterNames.CARTOGRAPHY_OWNER]: {},
  [FilterNames.CARTOGRAPHY_WRITER]: {},
  [FilterNames.CARTOGRAPHY_ENTRY_TAGS]: {
    searchedTerm: "",
    elementIds: {},
  },
};

function getNewPresenceState<T extends string | number>(
  filter: PresenceHashMap<T>,
  key: T
) {
  const stateCopy = { ...filter };
  if (filter[key]) {
    delete stateCopy[key];
  } else {
    stateCopy[key] = true;
  }
  return stateCopy;
}

function getNewPresenceStatesForChildren<T extends Array<number> | Array<string>>(
  filter: PresenceHashMap<number | string>,
  keys: T
){
  // return keys.reduce((acc, key) => {
  //   return acc;
  // }, {} as PresenceHashMap<number | string>)
}

function reducer(state: State = initialState, action: FilterAction): State {
  switch (action.type) {
    case FiltersActionType.TOGGLE_EXCLUDED_PRESENCE: {
      const { filterName, excludedEntries } = action.payload;
      return {
        ...state,
        [filterName]: {
          ...state[filterName],
          excludedEntries,
        },
      };
    }
    case FiltersActionType.TOGGLE_ID_PRESENCE: {
      const { filterName, elementId } = action.payload;
      return {
        ...state,
        [filterName]: getNewPresenceState(state[filterName], elementId),
      };
    }
    case FiltersActionType.TOGGLE_MULTIPLE_ID_PRESENCE: {
      const { filterName, elements } = action.payload;
      return {
        ...state,
        [filterName]: getNewPresenceStatesForChildren(state[filterName], elements),
      };
    }
    case FiltersActionType.TOGGLE_STATUS_PRESENCE: {
      const { filterName, status } = action.payload;
      return {
        ...state,
        [filterName]: getNewPresenceState(state[filterName], status),
      };
    }
    case FiltersActionType.SET_SEARCH_TERM: {
      const { filterName, value } = action.payload;
      return {
        ...state,
        [filterName]: {
          ...state[filterName],
          searchedTerm: value,
        },
      };
    }
    case FiltersActionType.TOGGLE_SEARCHABLE_FILTER_PRESENCE: {
      const { filterName, elementId: emissionFactorId } = action.payload;
      return {
        ...state,
        [filterName]: {
          ...state[filterName],
          elementIds: getNewPresenceState(
            state[filterName].elementIds,
            emissionFactorId
          ),
        },
      };
    }
    case FiltersActionType.SET_USER_DATA_FILTER: {
      const { filterName, userId } = action.payload;
      return {
        ...state,
        [filterName]: {
          ...state[filterName],
          userId,
        },
      };
    }
    case FiltersActionType.RESET_ALL_FILTERS: {
      return initialState;
    }
    default:
      return state;
  }
}

export default reducer;
