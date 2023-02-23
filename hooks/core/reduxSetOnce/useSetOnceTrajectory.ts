import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@reducers/index";
import { requestTrajectory } from "@actions/trajectory/campaigntrajectories/campaignTrajectoriesAction";

function useSetOnceTrajectory(currentTrajectoryId: number | null) {
  const dispatch = useDispatch();

  const trajectoryFetched = useSelector<RootState, boolean>(state =>
    currentTrajectoryId != null
      ? state.trajectory.campaignTrajectories[currentTrajectoryId] != null
      : false
  );

  useEffect(() => {
    if (!trajectoryFetched && currentTrajectoryId != null) {
      dispatch(requestTrajectory(currentTrajectoryId));
    }
  }, [trajectoryFetched, currentTrajectoryId]);
}

export default useSetOnceTrajectory;
