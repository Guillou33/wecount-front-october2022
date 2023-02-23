
import { makeSelectEntryInfoTotal } from "@selectors/activityEntryInfo/selectEntryInfoTotal";
import makeUseTrajectoryDashboardEntriesInfoBy from "./makeUseTrajectoryDashboardEntriesInfoBy";

const selectEntryInfoTotal = makeSelectEntryInfoTotal();

const useTrajectoryDashboardEntriesInfoTotal = makeUseTrajectoryDashboardEntriesInfoBy(selectEntryInfoTotal);

export default useTrajectoryDashboardEntriesInfoTotal;
