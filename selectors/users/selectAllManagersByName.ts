import { createSelector } from "reselect";

import { PerimeterRole } from "@custom-types/wecount-api/auth";
import {
  isGrantedPerimeterRole,
  isGrantedRole,
} from "@lib/core/rolesHierarchy/isGranted";
import { Role } from "@custom-types/wecount-api/auth";
import { getHashMap } from "@lib/utils/getNameHashMap";

import { RootState } from "@reducers/index";

const selectAllManagersByName = createSelector(
  [(state: RootState) => state.core.user.userList],
  users =>
    getHashMap(
      Object.values(users).filter(
        user =>
          isGrantedRole(user.roles, Role.ROLE_MANAGER) ||
          (user.roleWithinPerimeter != null &&
            isGrantedPerimeterRole(
              [user.roleWithinPerimeter],
              PerimeterRole.PERIMETER_MANAGER
            ))
      ),
      "email"
    )
);

export default selectAllManagersByName;
