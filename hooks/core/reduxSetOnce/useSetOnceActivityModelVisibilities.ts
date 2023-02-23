import { loadActivityModelVisibilities } from "@actions/userPreference/activityModels/activityModelsActions";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { RootState } from "@reducers/index";
import { VisibleActivityModels } from "@reducers/userPreference/activityModelsReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function useSetOnceActivityModelVisibilities() {
  const dispatch = useDispatch();
  const visibleActivityModel = useSelector<
    RootState,
    VisibleActivityModels | null
  >(state => state.userPreference.activityModels.visibleActivityModels);

  const currentPerimeter = useCurrentPerimeter();

  useEffect(() => {
    if (visibleActivityModel == null && currentPerimeter != null) {
      dispatch(loadActivityModelVisibilities(currentPerimeter.id));
    }
  }, [visibleActivityModel, currentPerimeter]);
}

export default useSetOnceActivityModelVisibilities;
