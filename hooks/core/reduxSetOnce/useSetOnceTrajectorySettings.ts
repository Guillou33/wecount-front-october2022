import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { RootState } from "@reducers/index";

import { requestLoadTrajectorySettings } from "@actions/trajectory/trajectorySettings/trajectorySettingsActions";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";

function useReduxSetOnceTrajectorySettings() {
  const dispatch = useDispatch();

  const currentPerimeter = useCurrentPerimeter();

  const trajectorySettingsFetched = useSelector<RootState, boolean>(
    state => state.trajectory.trajectorySettings.isFetched
  );

  useEffect(() => {
    if (!trajectorySettingsFetched && currentPerimeter != null) {
      dispatch(requestLoadTrajectorySettings(currentPerimeter.id));
    }
  }, [trajectorySettingsFetched, currentPerimeter]);
}

export default useReduxSetOnceTrajectorySettings;
