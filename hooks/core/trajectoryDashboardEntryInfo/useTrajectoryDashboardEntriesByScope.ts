
import { makeSelectEntryInfoByScope } from "@selectors/activityEntryInfo/selectEntryInfoByScope";
import makeUseTrajectoryDashboardEntriesInfoBy from "./makeUseTrajectoryDashboardEntriesInfoBy";

const selectEntryInfoByScope = makeSelectEntryInfoByScope();

const useTrajectoryDashboardEntriesByScope = makeUseTrajectoryDashboardEntriesInfoBy(
    selectEntryInfoByScope
);

export default useTrajectoryDashboardEntriesByScope;
