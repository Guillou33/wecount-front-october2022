import {
  RoleHierarchy,
  AllRoles,
  perimeterRolesHierarchy,
  rolesHierarchy,
} from "./config";

function configureIsGranted<RoleType extends AllRoles>(
  config: RoleHierarchy<RoleType>
) {
  // recursively follow the role hierarchy and returns true if any sourceRoles is above targetRole
  return function isGranted(
    sourceRoles: RoleType[],
    targetRole: RoleType
  ): boolean {
    return sourceRoles.some(sourceRole => {
      if (sourceRole === targetRole) {
        return true;
      }
      return isGranted(config[sourceRole] ?? [], targetRole);
    });
  };
}

export const isGrantedPerimeterRole = configureIsGranted(
  perimeterRolesHierarchy
);
export const isGrantedRole = configureIsGranted(rolesHierarchy);
