import {
  ProfileTypes,
} from "@actions/profile/types";
import { Action } from "@actions/profile/profileActions";
import { PerimeterRole } from "@custom-types/wecount-api/auth";

interface Profile {
  id: number;
  createdAt: string;
  firstName: string;
  lastName: string;
}

interface Company {
  id: number;
  createdAt: string;
  name: string;
  readonlyMode: boolean;
  logoUrl: string | null;
};

export interface RoleWithinPerimeters {
  [perimeterId: number]: PerimeterRole
}

export interface ProfileState {
  profile?: Profile,
  company?: Company,
  roleWithinPerimeters?: RoleWithinPerimeters,
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: ProfileState = {
  profile: undefined,
  company: undefined,
  roleWithinPerimeters: undefined,
};

/**
 * Updates reducer state depending on action type
 * @param {Object} state - the reducer state
 * @param {Object} action - the fired action object
 * @param {string} action.type - the action type
 * @param {?Object} action.payload - additional action data
 * @return {Object} new reducer state
 */

const reducer = (state: ProfileState = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case ProfileTypes.SET_INFO: {
      const {
        profile,
        company,
        roleWithinPerimeters: roleWithinPerimetersList,
      } = action.payload;

      const roleWithinPerimeters = roleWithinPerimetersList.reduce(
        (acc, roleWithinPerimeter) => {
          acc[roleWithinPerimeter.perimeterId] = roleWithinPerimeter.role;
          return acc;
        },
        {} as RoleWithinPerimeters
      );

      return { ...state, profile, company, roleWithinPerimeters };
    }
    default:
      return state;
  }
};

export default reducer;
