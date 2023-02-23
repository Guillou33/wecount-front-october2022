import { useSelector } from "react-redux";
import { isEmpty } from "lodash";

import { RootState } from "@reducers/index";
import { RoleWithinPerimeters } from "@reducers/profileReducer";
import { Role } from "@custom-types/wecount-api/auth";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { isGrantedRole } from "@lib/core/rolesHierarchy/isGranted";

function useRoleWithinCurrentPerimeter(): PerimeterRole {
  const currentPerimeter = useCurrentPerimeter();

  const roleWithinPerimeters = useSelector<
    RootState,
    RoleWithinPerimeters | undefined
  >(state => state.profile.roleWithinPerimeters);

  const globalRoles = useSelector<RootState, Role[]>(state => state.auth.roles);
  if (isGrantedRole(globalRoles, Role.ROLE_MANAGER)) {
    return PerimeterRole.PERIMETER_ADMIN;
  }
  
  if (
    currentPerimeter != null &&
    roleWithinPerimeters != null &&
    !isEmpty(roleWithinPerimeters)
  ) {
    return roleWithinPerimeters[currentPerimeter.id];
  }

  return PerimeterRole.PERIMETER_WAITING_RESOLUTION;
}

export default useRoleWithinCurrentPerimeter;
