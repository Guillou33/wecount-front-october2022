import ApiClient from "@lib/wecount-api/ApiClient";
import { AdminCompanyListTypes } from "@actions/admin/company-list/types";
import { ProductListResponse, ProductResponse } from "@lib/wecount-api/responses/apiResponses";
import { CompanyFullResponse } from "@lib/wecount-api/responses/apiResponses";

export type Action =
  | LoadMoreLockedRequestedAction
  | LoadMoreLockedAction
  | EndReachedLockedAction
  | LoadMoreLockedErrorAction
  | LoadMoreUnlockedRequestedAction
  | LoadMoreUnlockedAction
  | EndReachedUnlockedAction
  | LoadMoreUnlockedErrorAction
  | LockRequestedAction
  | LockedAction
  | UnlockRequestedAction
  | UnlockedAction
  | LockConfirmationAskedAction
  | UnlockConfirmationAskedAction
  | LockConfirmationCancelledAction
  | UnlockConfirmationCancelledAction
  | SetReadOnlyModeRequestedAction
  | FindCompaniesByName
  | SetCompanies
  ;

export interface LoadMoreLockedRequestedAction {
  type: AdminCompanyListTypes.LOAD_MORE_LOCKED_REQUESTED;
  payload: {
    refresh: boolean;
  };
}
export interface LoadMoreLockedAction {
  type: AdminCompanyListTypes.LOAD_MORE_LOCKED;
  payload: {
    companies: CompanyFullResponse[];
  };
}
export interface EndReachedLockedAction {
  type: AdminCompanyListTypes.END_REACHED_LOCKED;
}
export interface LoadMoreLockedErrorAction {
  type: AdminCompanyListTypes.LOAD_MORE_LOCKED_ERROR;
}

export interface LoadMoreUnlockedRequestedAction {
  type: AdminCompanyListTypes.LOAD_MORE_UNLOCKED_REQUESTED;
  payload: {
    refresh: boolean;
  };
}
export interface LoadMoreUnlockedAction {
  type: AdminCompanyListTypes.LOAD_MORE_UNLOCKED;
  payload: {
    companies: CompanyFullResponse[];
  };
}
export interface EndReachedUnlockedAction {
  type: AdminCompanyListTypes.END_REACHED_UNLOCKED;
}
export interface LoadMoreUnlockedErrorAction {
  type: AdminCompanyListTypes.LOAD_MORE_UNLOCKED_ERROR;
}

export interface LockRequestedAction {
  type: AdminCompanyListTypes.LOCK_REQUESTED;
  payload: {
    companyId: number;
  };
}
export interface LockedAction {
  type: AdminCompanyListTypes.LOCKED;
  payload: {
    companyId: number;
  };
}
export interface UnlockRequestedAction {
  type: AdminCompanyListTypes.UNLOCK_REQUESTED;
  payload: {
    companyId: number;
  };
}
export interface UnlockedAction {
  type: AdminCompanyListTypes.UNLOCKED;
  payload: {
    companyId: number;
  };
}
export interface LockConfirmationAskedAction {
  type: AdminCompanyListTypes.LOCK_CONFIRMATION_ASKED;
  payload: {
    companyId: number;
  };
}
export interface UnlockConfirmationAskedAction {
  type: AdminCompanyListTypes.UNLOCK_CONFIRMATION_ASKED;
  payload: {
    companyId: number;
  };
}
export interface LockConfirmationCancelledAction {
  type: AdminCompanyListTypes.LOCK_CONFIRMATION_CANCELLED;
}
export interface UnlockConfirmationCancelledAction {
  type: AdminCompanyListTypes.UNLOCK_CONFIRMATION_CANCELLED;
}

export interface SetReadOnlyModeRequestedAction {
  type: AdminCompanyListTypes.SET_READ_ONLY_MODE_REQUESTED,
  payload: {
    companyId: number;
    readonlyMode: boolean;
  }
}

export interface FindCompaniesByName {
  type: AdminCompanyListTypes.FIND_COMPANIES_BY_NAME;
  payload: {
    name: string;
    locked: boolean;
  }
}

export interface SetCompanies {
  type: AdminCompanyListTypes.SET_COMPANIES;
  payload: {
    companies: CompanyFullResponse[];
    locked: boolean;
  }
}

export const requestLoadMoreLockedCompanies = ({
  refresh = false
}: {
  refresh: boolean
}): LoadMoreLockedRequestedAction => ({
  type: AdminCompanyListTypes.LOAD_MORE_LOCKED_REQUESTED,
  payload: {
    refresh
  },
});
export const loadMoreLockedCompanies = ({
  companies
}: {
  companies: CompanyFullResponse[];
}): LoadMoreLockedAction => ({
  type: AdminCompanyListTypes.LOAD_MORE_LOCKED,
  payload: {
    companies,
  }
});
export const setLoadMoreLockedError = (): LoadMoreLockedErrorAction => ({
  type: AdminCompanyListTypes.LOAD_MORE_LOCKED_ERROR,
});
export const setLockedEndReached = (): EndReachedLockedAction => ({
  type: AdminCompanyListTypes.END_REACHED_LOCKED,
});

export const requestLoadMoreUnlockedCompanies = ({
  refresh
}: {
  refresh: boolean
}): LoadMoreUnlockedRequestedAction => ({
  type: AdminCompanyListTypes.LOAD_MORE_UNLOCKED_REQUESTED,
  payload: {
    refresh
  },
});
export const loadMoreUnlockedCompanies = ({
  companies
}: {
  companies: CompanyFullResponse[];
}): LoadMoreUnlockedAction => ({
  type: AdminCompanyListTypes.LOAD_MORE_UNLOCKED,
  payload: {
    companies,
  }
});
export const setLoadMoreUnlockedError = (): LoadMoreUnlockedErrorAction => ({
  type: AdminCompanyListTypes.LOAD_MORE_UNLOCKED_ERROR,
});
export const setUnlockedEndReached = (): EndReachedUnlockedAction => ({
  type: AdminCompanyListTypes.END_REACHED_UNLOCKED,
});

export const requestLockCompany = ({
  companyId,
}: {
  companyId: number
}): LockRequestedAction => ({
  type: AdminCompanyListTypes.LOCK_REQUESTED,
  payload: {
    companyId,
  }
});
export const setCompanyLocked = ({
  companyId,
}: {
  companyId: number
}): LockedAction => ({
  type: AdminCompanyListTypes.LOCKED,
  payload: {
    companyId,
  }
});
export const requestUnlockCompany = ({
  companyId,
}: {
  companyId: number
}): UnlockRequestedAction => ({
  type: AdminCompanyListTypes.UNLOCK_REQUESTED,
  payload: {
    companyId,
  }
});
export const setCompanyUnlocked = ({
  companyId,
}: {
  companyId: number
}): UnlockedAction => ({
  type: AdminCompanyListTypes.UNLOCKED,
  payload: {
    companyId,
  }
});

export const askLockConfirmation = ({
  companyId,
}: {
  companyId: number
}): LockConfirmationAskedAction => ({
  type: AdminCompanyListTypes.LOCK_CONFIRMATION_ASKED,
  payload: {
    companyId,
  }
});
export const askUnlockConfirmation = ({
  companyId,
}: {
  companyId: number
}): UnlockConfirmationAskedAction => ({
  type: AdminCompanyListTypes.UNLOCK_CONFIRMATION_ASKED,
  payload: {
    companyId,
  }
});
export const cancelLockConfirmation = (): LockConfirmationCancelledAction => ({
  type: AdminCompanyListTypes.LOCK_CONFIRMATION_CANCELLED,
});
export const cancelUnlockConfirmation = (): UnlockConfirmationCancelledAction => ({
  type: AdminCompanyListTypes.UNLOCK_CONFIRMATION_CANCELLED,
});

export const setReadOnlyModeRequested = ({
  companyId,
  readonlyMode,
}: {
  companyId: number;
  readonlyMode: boolean;
}): SetReadOnlyModeRequestedAction => ({
  type: AdminCompanyListTypes.SET_READ_ONLY_MODE_REQUESTED,
  payload: {
    companyId,
    readonlyMode,
  },
});

export const findCompaniesByName = (
  payload: FindCompaniesByName["payload"]
): FindCompaniesByName => ({
  type: AdminCompanyListTypes.FIND_COMPANIES_BY_NAME,
  payload,
});

export const setCompanies = (
  payload: SetCompanies["payload"]
): SetCompanies => ({
  type: AdminCompanyListTypes.SET_COMPANIES,
  payload,
});
