import { useSelector } from "react-redux";
import cx from "classnames";

import { RootState } from "@reducers/index";
import { IndicatorsById } from "@reducers/indicator/indicatorReducer";

import useCreateDefaultIndicators from "@hooks/core/reduxSetOnce/useCreateDefaultIndicators";
import useSetOnceCampaignIndicators from "@hooks/core/reduxSetOnce/useSetOnceCampaignIndicators";
import selectFilteredActivityEntriesForAnalysis from "@selectors/activityEntries/selectFilteredActivityEntriesForAnalysis";

import IndicatorTable from "@components/dashboard/campaign/sub/IndicatorTable";

import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";

import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  campaignId: number;
}

const IndicatorDashboards = ({ campaignId }: Props) => {
  useSetOnceCampaignIndicators(campaignId);
  useCreateDefaultIndicators(campaignId);

  const filteredEntries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForAnalysis(state, campaignId)
  );

  const indicators = useSelector<RootState, IndicatorsById | undefined>(
    state => state.indicator?.[campaignId]?.indicators
  );

  return (
    <>
      <div className={cx("alert alert-primary", styles.dashboardInfos)}>
        <p>
          {upperFirst(t("indicator.info.part1"))} <b>{t("indicator.info.part2")}</b> {t("indicator.info.part3")}{" "}
          <b>{t("indicator.info.part4")}</b>.
        </p>
        <p>
          {upperFirst(t("indicator.info.part5"))} <b>{t("indicator.indicators")}</b> {t("indicator.info.part6")}{" "}
          <b>{t("indicator.info.part7")}</b>.
        </p>
      </div>
      {indicators != null ? (
        <IndicatorTable
          indicators={indicators}
          campaignId={campaignId}
          entries={filteredEntries}
        />
      ) : (
        <div className="d-flex mt-4 align-items-center justify-content-center">
          <div className="spinner-border text-secondary mr-3"></div>
          <div>{upperFirst(t("global.data.loadingData"))}...</div>
        </div>
      )}
    </>
  );
};

export default IndicatorDashboards;
