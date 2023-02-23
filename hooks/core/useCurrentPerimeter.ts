import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { PerimetersById } from "@reducers/perimeter/perimeterReducer";

function useCurrentPerimeter() {
  const currentPerimeterId = useSelector<RootState, number | null>(
    state => state.perimeter.currentPerimeter
  );
  const perimeters = useSelector<RootState, PerimetersById>(
    state => state.perimeter.perimeters
  );

  if (currentPerimeterId == null) {
    return null;
  }

  const currentPerimeter = perimeters[currentPerimeterId];

  return currentPerimeter ?? null;
}

export default useCurrentPerimeter;
