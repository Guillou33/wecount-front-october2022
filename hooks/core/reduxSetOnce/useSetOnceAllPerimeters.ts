import { loadAllPerimeters } from "@actions/perimeter/perimeterActions";
import { RootState } from "@reducers/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function useSetOnceAllPerimeters() {
  const dispatch = useDispatch();
  const perimetersFetched = useSelector<RootState, boolean>(
    state => state.perimeter.perimetersFetched
  );
  const isFetchingAllPerimeters = useSelector<RootState, boolean>(
    state => state.perimeter.isFetchingAllPerimeters
  );

  useEffect(() => {
    if (!perimetersFetched && !isFetchingAllPerimeters) {
      dispatch(loadAllPerimeters());
    }
  }, [perimetersFetched, isFetchingAllPerimeters]);
}

export default useSetOnceAllPerimeters;
