import makeUseTrajectoryDashboardEntriesInfoBy from "@hooks/core/trajectoryDashboardEntryInfo/makeUseTrajectoryDashboardEntriesInfoBy";
import { makeSelectEntryInfoByCategory } from "@selectors/activityEntryInfo/selectEntryInfoByCategory";

const selectEntryInfoByCategory = makeSelectEntryInfoByCategory();

const useTrajectoryDashboardEntriesByCategory = makeUseTrajectoryDashboardEntriesInfoBy(
    selectEntryInfoByCategory
);

export default useTrajectoryDashboardEntriesByCategory;
