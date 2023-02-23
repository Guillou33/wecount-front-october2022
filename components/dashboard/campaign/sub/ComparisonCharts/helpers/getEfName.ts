import upperFirst from "lodash/upperFirst";
import { t } from "i18next";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

function getEfName(entry: ActivityEntryExtended | undefined): string {
  if (entry == null) {
    return upperFirst(t("dashboard.entryComparisonChart.noHistoryData"));
  }
  return (
    entry.emissionFactor?.name ??
    upperFirst(t("footprint.emission.manual")) ??
    ""
  );
}

export default getEfName;
