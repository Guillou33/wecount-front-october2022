import { requestFetchActivityCategoryPreferences } from "@actions/userPreference/activityCategories/activityCategoriesAction";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { RootState } from "@reducers/index";
import { ActivityCategoryPreferencesState } from "@reducers/userPreference/activityCategoriesReducer";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function useSetOnceActivityCategoriesPreferences() {
  const dispatch = useDispatch();

  const activityCategoriesPreferences = useSelector<
    RootState,
    ActivityCategoryPreferencesState
  >(state => state.userPreference.activityCategories);

  const currentPerimeter = useCurrentPerimeter()
  useEffect(() => {
    if (isEmpty(activityCategoriesPreferences) && currentPerimeter != null) {
      dispatch(requestFetchActivityCategoryPreferences(currentPerimeter.id));
    }
  }, [activityCategoriesPreferences, currentPerimeter?.id]);
}

export default useSetOnceActivityCategoriesPreferences;
