import useRoleWithinCurrentPerimeter from "@hooks/core/perimeterAccessControl/useRoleWithinCurrentPerimeter";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import { isGrantedPerimeterRole } from "@lib/core/rolesHierarchy/isGranted";

function useUserHasPerimeterRole(roleToCheck: PerimeterRole): boolean {
  const currentRole = useRoleWithinCurrentPerimeter();
  return isGrantedPerimeterRole([currentRole], roleToCheck);
}

export default useUserHasPerimeterRole;
