import { PerimeterRole, Role } from "@custom-types/wecount-api/auth";
import { User } from "@reducers/core/userReducer";
import { isGrantedRole } from "@lib/core/rolesHierarchy/isGranted";
import { upperFirst } from "lodash";
import { t } from "i18next";

const perimeterRoleNames: { [role in PerimeterRole]?: string } = {
  [PerimeterRole.PERIMETER_ADMIN]: upperFirst(t("user.role.title.admin")),
  [PerimeterRole.PERIMETER_MANAGER]: upperFirst(t("user.role.title.manager")),
  [PerimeterRole.PERIMETER_COLLABORATOR]: upperFirst(t("user.role.title.collaborator")),
  [PerimeterRole.PERIMETER_CONTRIBUTOR]: upperFirst(t("user.role.title.contributor")),
};

export const assignablePerimeterRoles = [
  PerimeterRole.PERIMETER_MANAGER,
  PerimeterRole.PERIMETER_COLLABORATOR,
  PerimeterRole.PERIMETER_CONTRIBUTOR,
];

export function getPerimeterRoleName(role: PerimeterRole): string {
  return perimeterRoleNames[role] ?? "";
}

export function getUserPerimeterRole(user: User): PerimeterRole {
  if (isGrantedRole(user.roles, Role.ROLE_MANAGER)) {
    return PerimeterRole.PERIMETER_ADMIN;
  }
  if (user.roleWithinPerimeter == null) {
    return PerimeterRole.PERIMETER_ANONYMOUS;
  }
  return user.roleWithinPerimeter;
}
