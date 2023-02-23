import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { requestCurrentPerimeterSwitch } from "@actions/perimeter/perimeterActions";

const redirectionConfigurations = [
  { route: "campaigns/", redirectsTo: "campaigns" },
  { route: "dashboards/", redirectsTo: "dashboards" },
  { route: "trajectories/", redirectsTo: "trajectories" },
  { route: "perimeters", redirectsTo: "campaigns" },
];

function usePerimeterSwitcher() {
  const dispatch = useDispatch();
  const router = useRouter();

  return (perimeterId: number) => {
    dispatch(requestCurrentPerimeterSwitch(perimeterId));
    const currentPath = router.asPath;
    const redirectionRequiredMatch = redirectionConfigurations.find(
      redirectionConfig => currentPath.includes(redirectionConfig.route)
    );
    if (redirectionRequiredMatch != null) {
      router.push(
        `/loading-perimeter?redirectTo=${redirectionRequiredMatch.redirectsTo}`
      );
    }
  };
}

export default usePerimeterSwitcher;
