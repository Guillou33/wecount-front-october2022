import { PerimeterRole } from "@custom-types/wecount-api/auth";

import useRoleWithinCurrentPerimeter from "@hooks/core/perimeterAccessControl/useRoleWithinCurrentPerimeter";
import { isGrantedPerimeterRole } from "@lib/core/rolesHierarchy/isGranted";

interface Props {
  role: PerimeterRole;
  children: React.ReactNode;
}

const IfHasPerimeterRole = ({
  role,
  children,
}: Props) => {

  const userRole = useRoleWithinCurrentPerimeter();
  const authorized = isGrantedPerimeterRole([userRole], role);

  return authorized ? <>{children}</> : null;
};

export default IfHasPerimeterRole;
