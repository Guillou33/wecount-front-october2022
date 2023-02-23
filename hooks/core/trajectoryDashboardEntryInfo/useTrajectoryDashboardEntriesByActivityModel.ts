import makeUseTrajectoryDashboardEntriesInfoBy from "@hooks/core/trajectoryDashboardEntryInfo/makeUseTrajectoryDashboardEntriesInfoBy";
import selectEntryInfoByActivityModel from "@selectors/activityEntryInfo/selectEntryInfoByActivityModel";

// const selectEntryInfoByActivityModel = makeSelectEntryInfoByActivityModel();

const useTrajectoryDashboardEntriesByActivityModel = makeUseTrajectoryDashboardEntriesInfoBy(
    selectEntryInfoByActivityModel
);

export default useTrajectoryDashboardEntriesByActivityModel;
