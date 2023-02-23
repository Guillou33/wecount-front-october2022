import redirectToLogin from "@lib/wecount-api/redirectToLogin";

import { PerimeterRole } from "@custom-types/wecount-api/auth";

import useRoleWithinCurrentPerimeter from "@hooks/core/perimeterAccessControl/useRoleWithinCurrentPerimeter";
import useSetOnceAllPerimeters from "@hooks/core/reduxSetOnce/useSetOnceAllPerimeters";
import useSetOnceAuthUtils from "@hooks/core/useSetOnceAuthUtils";
import { isGrantedPerimeterRole } from "@lib/core/rolesHierarchy/isGranted";

interface Props {
  role: PerimeterRole;
  children: React.ReactNode;
}

const RequirePerimeterRole = ({ role, children }: Props) => {
  useSetOnceAuthUtils();
  useSetOnceAllPerimeters();

  const userRole = useRoleWithinCurrentPerimeter();
  const authorized = isGrantedPerimeterRole([userRole], role);

  if (
    !authorized &&
    userRole !== PerimeterRole.PERIMETER_WAITING_RESOLUTION &&
    typeof window !== "undefined"
  ) {
    redirectToLogin();
  }

  return authorized ? <>{children}</> : null;
};

export default RequirePerimeterRole;
