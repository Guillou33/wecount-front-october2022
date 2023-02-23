import { AdminCompanyListTypes } from "@actions/admin/company-list/types";
import { Action } from "@actions/admin/company-list/companyListActions";
import immer from "immer";
import { CompanyFullResponse } from "@lib/wecount-api/responses/apiResponses";

export type Company = CompanyFullResponse;

export interface CompanyList {
  companyList: {
    [key: number]: Company;
  };
  isLoading: boolean;
  isEndReached: boolean;
  confirmToggleModalOpen: boolean;
  companyToToggleId: undefined | number;
}

export interface CompanyListState {
  locked: CompanyList;
  unlocked: CompanyList;
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: CompanyListState = {
  locked: {
    companyList: {},
    isLoading: false,
    isEndReached: false,
    confirmToggleModalOpen: false,
    companyToToggleId: undefined,
  },
  unlocked: {
    companyList: {},
    isLoading: false,
    isEndReached: false,
    confirmToggleModalOpen: false,
    companyToToggleId: undefined,
  },
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
  state: CompanyListState = INITIAL_STATE,
  action: Action
): CompanyListState => {
  switch (action.type) {
    case AdminCompanyListTypes.LOAD_MORE_LOCKED_REQUESTED:
      return immer(state, (draftState) => {
        draftState.locked.isLoading = true;
        if (action.payload.refresh) {
          draftState.locked.companyList = {};
          draftState.locked.isEndReached = false;
        }
      });
    case AdminCompanyListTypes.LOAD_MORE_UNLOCKED_REQUESTED:
      return immer(state, (draftState) => {
        draftState.unlocked.isLoading = true;
        if (action.payload.refresh) {
          draftState.unlocked.companyList = {};
          draftState.unlocked.isEndReached = false;
        }
      });
    case AdminCompanyListTypes.LOAD_MORE_LOCKED:
      return immer(state, (draftState) => {
        draftState.locked.companyList = {
          ...draftState.locked.companyList,
          ...mapCompanyById(action.payload.companies),
        };
        draftState.locked.isLoading = false;
      });
    case AdminCompanyListTypes.LOAD_MORE_UNLOCKED:
      return immer(state, (draftState) => {
        draftState.unlocked.companyList = {
          ...draftState.unlocked.companyList,
          ...mapCompanyById(action.payload.companies),
        };
        draftState.unlocked.isLoading = false;
      });
    case AdminCompanyListTypes.END_REACHED_LOCKED:
      return immer(state, (draftState) => {
        draftState.locked.isEndReached = true;
      });
    case AdminCompanyListTypes.END_REACHED_UNLOCKED:
      return immer(state, (draftState) => {
        draftState.unlocked.isEndReached = true;
      });
    case AdminCompanyListTypes.LOAD_MORE_LOCKED_ERROR:
      return immer(state, (draftState) => {
        draftState.locked.isLoading = false;
      });
    case AdminCompanyListTypes.LOAD_MORE_UNLOCKED_ERROR:
      return immer(state, (draftState) => {
        draftState.unlocked.isLoading = false;
      });
    case AdminCompanyListTypes.UNLOCK_REQUESTED:
      return immer(state, (draftState) => {
        draftState.unlocked.companyList[action.payload.companyId] = {
          ...draftState.locked.companyList[action.payload.companyId],
        };
        delete draftState.locked.companyList[action.payload.companyId];
        draftState.unlocked.companyList = mapCompanyById(
          Object.values(draftState.unlocked.companyList)
        );
        draftState.locked.confirmToggleModalOpen = false;
        draftState.locked.companyToToggleId = undefined;
      });
    case AdminCompanyListTypes.LOCK_REQUESTED:
      return immer(state, (draftState) => {
        draftState.locked.companyList[action.payload.companyId] = {
          ...draftState.unlocked.companyList[action.payload.companyId],
        };
        delete draftState.unlocked.companyList[action.payload.companyId];
        draftState.locked.companyList = mapCompanyById(
          Object.values(draftState.locked.companyList)
        );
        draftState.unlocked.confirmToggleModalOpen = false;
        draftState.unlocked.companyToToggleId = undefined;
      });
    case AdminCompanyListTypes.LOCK_CONFIRMATION_ASKED:
      return immer(state, (draftState) => {
        draftState.unlocked.confirmToggleModalOpen = true;
        draftState.unlocked.companyToToggleId = action.payload.companyId;
      });
    case AdminCompanyListTypes.UNLOCK_CONFIRMATION_ASKED:
      return immer(state, (draftState) => {
        draftState.locked.confirmToggleModalOpen = true;
        draftState.locked.companyToToggleId = action.payload.companyId;
      });
    case AdminCompanyListTypes.LOCK_CONFIRMATION_CANCELLED:
      return immer(state, (draftState) => {
        draftState.unlocked.confirmToggleModalOpen = false;
        draftState.unlocked.companyToToggleId = undefined;
      });
    case AdminCompanyListTypes.UNLOCK_CONFIRMATION_CANCELLED:
      return immer(state, (draftState) => {
        draftState.locked.confirmToggleModalOpen = false;
        draftState.locked.companyToToggleId = undefined;
      });

    case AdminCompanyListTypes.SET_READ_ONLY_MODE_REQUESTED: {
      const { companyId, readonlyMode } = action.payload;;
      return immer(state, (draftState) => {
        if(state.unlocked.companyList[companyId] == null){
          return state;
        }
        draftState.unlocked.companyList[companyId].readonlyMode = readonlyMode;
      });
    }

    case AdminCompanyListTypes.FIND_COMPANIES_BY_NAME: {
      const { locked } = action.payload;
      return immer(state, draftState => {
        const lockedKey = locked ? "locked" : "unlocked";
        draftState[lockedKey].isLoading = true;
      })
    }

    case AdminCompanyListTypes.SET_COMPANIES: {
      const { companies, locked } = action.payload;
      const lockedKey = locked ? "locked" : "unlocked";
      return immer(state, draftState => {
        draftState[lockedKey].companyList = mapCompanyById(companies);
        draftState[lockedKey].isLoading = false;
        draftState[lockedKey].isEndReached = true;
      })
    }

    default:
      return state;
  }
};

const mapCompanyById = (
  companies: CompanyFullResponse[]
): {
  [key: number]: Company;
} => {
  return companies.reduce(
    (
      mappedCompanies: {
        [key: number]: Company;
      },
      currentCompany
    ) => {
      mappedCompanies[currentCompany.id] = currentCompany;
      return mappedCompanies;
    },
    {}
  );
};

export default reducer;
