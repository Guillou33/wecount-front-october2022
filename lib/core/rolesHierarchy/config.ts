import { Role, PerimeterRole } from "@custom-types/wecount-api/auth";

export type AllRoles = Role | PerimeterRole;

export type RoleHierarchy<RoleType extends AllRoles> = {
  [role in RoleType]?: [RoleType];
};

export const perimeterRolesHierarchy: RoleHierarchy<PerimeterRole> = {
  [PerimeterRole.PERIMETER_ADMIN]: [PerimeterRole.PERIMETER_MANAGER],
  [PerimeterRole.PERIMETER_MANAGER]: [PerimeterRole.PERIMETER_COLLABORATOR],
  [PerimeterRole.PERIMETER_COLLABORATOR]: [PerimeterRole.PERIMETER_CONTRIBUTOR],
  [PerimeterRole.PERIMETER_CONTRIBUTOR]: [PerimeterRole.PERIMETER_ANONYMOUS],
};

export const rolesHierarchy: RoleHierarchy<Role> = {
  [Role.ROLE_ADMIN]: [Role.ROLE_CONSULTANT],
  [Role.ROLE_CONSULTANT]: [Role.ROLE_MANAGER],
  [Role.ROLE_MANAGER]: [Role.ROLE_USER],
  [Role.ROLE_USER]: [Role.ROLE_ANONYMOUS],
};
