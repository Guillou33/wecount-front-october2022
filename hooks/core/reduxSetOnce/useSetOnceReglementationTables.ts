import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";

import { reglementationTablesFetchRequested } from "@actions/reglementationTables/reglementationTablesActions";

function useSetOnceReglementationTables() {
  const dispatch = useDispatch();

  const isFetched = useSelector<RootState, boolean>(
    state => state.reglementationTables.isFetched
  );
  const isFetching = useSelector<RootState, boolean>(
    state => state.reglementationTables.isFetching
  );

  useEffect(() => {
    if (!isFetched && !isFetching) {
      dispatch(reglementationTablesFetchRequested());
    }
  }, [isFetched, isFetching]);
}

export default useSetOnceReglementationTables;
