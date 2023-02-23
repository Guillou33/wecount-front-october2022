import cx from "classnames";
import { useSelector } from "react-redux";
import { t } from "i18next";

import { RootState } from "@reducers/index";
import { Campaign } from "@reducers/campaignReducer";

import { convertToTons } from "@lib/utils/calculator";

import styles from "@styles/dashboard/campaign/dashboardViews/comparisonDashboards/sub/comparisonResults.module.scss";

interface Props {
  compareToCampaign: Campaign;
  compareToCampaignTotalTco2: number;
}

const ComparisonResults = ({
  compareToCampaign,
  compareToCampaignTotalTco2,
}: Props) => {
  const compareToCampaignFetched = useSelector((state: RootState) =>
    compareToCampaign.information?.id != null
      ? state.campaignEntries[compareToCampaign.information?.id]
      : undefined
  );
  return compareToCampaign?.information != null && compareToCampaignFetched ? (
    <p className={cx("title-3 text-right", styles.compareToResultWrapper)}>
      {compareToCampaign.information.name} :{" "}
      <span className={cx("title-2", styles.compareToResult)}>
        {convertToTons(compareToCampaignTotalTco2)}{" "}
        {t("footprint.emission.tco2.tco2e")}
      </span>
    </p>
  ) : (
    <div className={cx(styles.comparisonLoaderContainer)}>
      <div className="spinner-border spinner-border-sm mr-1"></div>
      {t("global.data.loadingData")}
    </div>
  );
};

export default ComparisonResults;
