import React from "react";
import CounterBadge from "@components/core/CounterBadge";
import _ from "lodash";
import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@reducers/index";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import useActivitiesByModelId from "@hooks/core/useActivitiesByModelId";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import styles from "@styles/campaign/detail/trajectory/activityModel.module.scss";
import { UnitModes } from "@reducers/campaignReducer";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import getEntryModelInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";
import useNotExcludedEntriesInfoTotal from "@hooks/core/notExcludedActivityEntryInfo/useNotExcludedInfoTotal";
import selectActivityEntriesForTrajectory from "@selectors/activityEntries/selectActivityEntriesForTrajectory";
import { ReductionField } from "../helpers/ReductionFields";
import { Scope } from "@custom-types/wecount-api/activity";

interface Props {
  id: number;
  nbrActionPlans: number;
  reductionPercentageOfScope: number;
  reductionTco2: number;
  scope: Scope;
}

const ActivityModel = ({
  id,
  nbrActionPlans,
  reductionPercentageOfScope,
  reductionTco2,
  scope
}: Props) => {
  const dispatch = useDispatch();
  const isPerimeterManager = useUserHasPerimeterRole(
    PerimeterRole.PERIMETER_MANAGER
  );

  const campaignId = useSelector<RootState, number>(
    state => state.campaign.currentCampaign!
  );

  const entryInfoTotal = useNotExcludedEntriesInfoTotal(campaignId);

  const unitMode = useSelector<RootState, UnitModes>(
    state => state.campaign.campaigns[campaignId]?.unitMode ?? UnitModes.RAW
  );

  const activityModels = useActivityModelInfo();
  const activityModel = activityModels[id];

  const activitiesMapped = useActivitiesByModelId(campaignId);
  const activities = activitiesMapped[id] ?? [];

  const allEntries = useSelector((state: RootState) =>
    selectActivityEntriesForTrajectory(state, campaignId)
  );
  const entryInfoForActivityModel =
    getEntryModelInfoByActivityModel(allEntries)[id];

  return (
    <div
      className={cx(styles.activityModelContainer)}
    >
      <div
        className={cx(styles.activityModel, {
          [styles.noEdit]: !isPerimeterManager && activities.length === 0,
        })}
      >
        <div className={styles.leftPart}>
          <p className={styles.activityModelName}>
            {activityModel.name.toLocaleUpperCase()}
            {!activityModel.description ? null : (
              <Tooltip placement="top" content={activityModel.description}>
                <i
                  className={cx(
                    "fas fa-info-circle",
                    styles.tooltipDescription
                  )}
                ></i>
              </Tooltip>
            )}
            {nbrActionPlans > 0 ? (
              <span className={styles.activityNumber}>
                &nbsp;({nbrActionPlans})
              </span>
            ) : null}
          </p>
        </div>
        <div className={styles.rightPart}>
          {/* Ternary condition => does not show "0" */}
          {entryInfoForActivityModel?.tCo2 !== undefined ? (
            <CounterBadge
              className={styles.counterBadge}
              value={entryInfoForActivityModel.tCo2}
              lightMode={true}
              fontSize={"0.75rem"}
              type={unitMode === UnitModes.PERCENT ? "percent" : "raw"}
              totalValue={entryInfoTotal.tCo2}
            />
          ) : (
            <div className={styles.counterBadge}></div>
          )}
          <ReductionField
            className={styles.reductionText}
            value={reductionPercentageOfScope}
            alternativeValue={reductionTco2}
            scope={scope}
            type="light"
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityModel;
