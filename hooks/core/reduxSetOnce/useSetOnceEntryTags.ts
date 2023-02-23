import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { RootState } from "@reducers/index";
import { CustomThunkDispatch } from "@custom-types/redux";

import { entryTagsFetchRequested } from "@actions/core/entryTag/entryTagActions";

import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";

function useSetOnceEntryTags() {
  const areEntryTagsFetched = useSelector<RootState, boolean>(
    state => state.core.entryTag.isFetched
  );
  const areEntryTagsFetching = useSelector<RootState, boolean>(
    state => state.core.entryTag.isFetching
  );
  const dispatch = useDispatch() as CustomThunkDispatch;
  const currentPerimeter = useCurrentPerimeter();

  useEffect(() => {
    if (
      !areEntryTagsFetched &&
      !areEntryTagsFetching &&
      currentPerimeter != null
    ) {
      dispatch(entryTagsFetchRequested({ perimeterId: currentPerimeter.id }));
    }
  }, [areEntryTagsFetched, areEntryTagsFetching, currentPerimeter]);
}

export default useSetOnceEntryTags;
