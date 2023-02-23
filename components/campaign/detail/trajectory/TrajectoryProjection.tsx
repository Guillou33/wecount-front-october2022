import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@reducers/index";
import { CampaignInformation } from "@reducers/campaignReducer";
import { CategoryList } from "@reducers/core/categoryReducer";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { Scope } from "@custom-types/wecount-api/activity";
import styles from "@styles/campaign/detail/trajectory/trajectory.module.scss";
import useSetOnceActivityModelsVisibilities from "@hooks/core/reduxSetOnce/useSetOnceActivityModelVisibilities";
import CategoryView from "@components/campaign/detail/trajectory/CategoryPlan/CategoryView";
import { roundTwoDecimals, getXPercentOf } from "@lib/utils/calculator";
import useReductionInfoByScope from "@hooks/core/useReductionInfoByScope";
import { scopeLabels } from "@components/campaign/detail/trajectory/utils/scopeLabels";
import useAllEntriesInfoByScope from "@hooks/core/activityEntryInfo/useAllEntriesInfoByScope";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";
import ReductionBadge from "./helpers/ReductionBadge";
import useSetOnceCategoryProjectionsView from "@hooks/core/reduxSetOnce/useSetOnceCategoryProjectionsView";
import useReductionInfoByScopeSwitchDefinitionLevers from "@hooks/core/useReductionInfoByScopeSwitchDefinitionLevers";
import { getYearRange, getYearRangeErrorMessage } from "./utils/yearRanges";
import Tabs from "@components/helpers/ui/Tabs";
import { setCurrentScope } from "@actions/trajectory/currentTrajectory/currentTrajectoryAction";
import useNotExcludedEntriesInfoByScope from "@hooks/core/notExcludedActivityEntryInfo/useNotExcludedEntriesInfoByScope";
import { getTrajectoryOptionsforScope } from "./utils/trajectoryOptionsForScopes";
import selectCartographyForCampaign from "@selectors/cartography/selectCartographyForCampaign";
import { targetForReduction } from "./utils/targetForReduction";
import { t } from "i18next";
import { upperFirst } from "lodash";

type Tab = {
  value: any;
  label: string;
  badge?: string;
}

interface Props {
  trajectory: CampaignTrajectory;
  trajectorySettings: TrajectorySettings;
  availableTabs: Tab[];
}

const TrajectoryProjection = ({
  trajectory,
  trajectorySettings,
  availableTabs
}: Props) => {
  const dispatch = useDispatch();

  useSetOnceActivityModelsVisibilities();
  useSetOnceCategoryProjectionsView(trajectory.id);

  const campaignInfo = useSelector<RootState, CampaignInformation | undefined>(
    state => state.campaign.campaigns[trajectory.campaignId]?.information
  );

  const selectedScope = useSelector<RootState, Scope>(
    state => state.trajectory.currentTrajectory.currentScope
  );

  const { tCo2: selectedScopeTco2 } = useNotExcludedEntriesInfoByScope(
    trajectory.campaignId
  )[selectedScope];

  const categories = useSelector(
    (state: RootState) => selectCartographyForCampaign(state, trajectory.campaignId)
  );

  const reductionInfoTotal = useReductionInfoByScopeSwitchDefinitionLevers(trajectory.id)[
    selectedScope
  ];

  const currentCategories = categories[selectedScope];

  const yearRange = getYearRange(campaignInfo, trajectorySettings);
  const target = targetForReduction(yearRange ?? 0, trajectorySettings.scopeTargets[selectedScope].target ?? getTrajectoryOptionsforScope(selectedScope)[0].value);
  const targetTco2 = getXPercentOf(target, selectedScopeTco2);

  const scopeLabel = scopeLabels[selectedScope];

  return (
    <>
      <div className={styles.main}>
        <div className={cx(styles.topBar, styles.topBarProjection)}>
          {yearRange != null ? (
            <div className={cx(
              styles.targetReductionByYearContainer,
              styles.estimatedTotal
            )}>
              <div className={cx(styles.reductionText, styles.label)}>
                {upperFirst(t("trajectory.definition.reductionTarget"))} {t("global.other.for")} {trajectorySettings.targetYear} {scopeLabel.toLowerCase()} :
              </div>
              <ReductionBadge
                value={roundTwoDecimals(target)}
                alternativeValue={targetTco2}
              />
            </div>
          ) : (
            <div className={cx(styles.yearRangeError, "alert alert-danger")}>
              <i className="fa fa-exclamation-circle mr-1"></i>
              {upperFirst(t("global.define"))}{" "}
              <span className="font-weight-bold">
                {getYearRangeErrorMessage(campaignInfo, trajectorySettings)}
              </span>
            </div>
          )}
          <div
            className={cx(
              styles.targetReductionByYearContainer,
              styles.estimatedTotal
            )}
          >
            <div className={cx(styles.reductionText, styles.label)}>
              {upperFirst(t("trajectory.projection.projectionTotal"))} {scopeLabel.toLowerCase()} :
            </div>
            <ReductionBadge
              value={roundTwoDecimals(
                reductionInfoTotal.reductionPercentageOfScope
              )}
              alternativeValue={reductionInfoTotal.reductionTco2}
              scope={selectedScope}
              type="light"
            />
          </div>
        </div>
        <div className={cx(styles.topBar2)}>
          <div className={cx(styles.estimationLabel, styles.label)}>
            <div>{upperFirst(t("footprint.emission.emission.plural"))}</div>
          </div>
          <Tooltip
            content={`${upperFirst(t("trajectory.projection.toolTipProjection", {scope: scopeLabel}))}`}
            hideDelay={0}
          >
            <div className={cx(styles.estimationLabel, styles.label)}>
              <div>{upperFirst(t("trajectory.projection.projection"))}s</div>
            </div>
          </Tooltip>
        </div>
        <div className={styles.categoryPlanContainer}>
          {Object.values(currentCategories)
            .map(category => (
              <CategoryView
                key={category.id}
                trajectory={trajectory}
                categoryId={category.id}
                preferencesFetched
                scope={selectedScope}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default TrajectoryProjection;
