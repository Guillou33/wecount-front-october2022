import { Scope } from "@custom-types/wecount-api/activity";
import React from "react";
import cx from "classnames";
import styles from "@styles/campaign/detail/trajectory/trajectoryScopeCard.module.scss";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import { useDispatch, useSelector } from "react-redux";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
// import { trajectoryOptions } from "../helpers/trajectoryOptions";
import {
  Campaign as CampaignType,
  CampaignInformation,
} from "@reducers/campaignReducer";
import { requestSaveScopeTarget } from "@actions/trajectory/trajectorySettings/trajectorySettingsActions";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import {
  convertToTons,
  getXPercentOf,
  roundTwoDecimals,
} from "@lib/utils/calculator";
import ReductionBadge from "../helpers/ReductionBadge";
import { RootState } from "@reducers/index";
import useNotExcludedEntriesInfoByScope from "@hooks/core/notExcludedActivityEntryInfo/useNotExcludedEntriesInfoByScope";
import { scopeLabels } from "../utils/scopeLabels";
import { getYearRange } from "../utils/yearRanges";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import { getTrajectoryOptionsforScope } from "../utils/trajectoryOptionsForScopes";
import { targetForReduction } from "../utils/targetForReduction";
import {
  getEmissionNumbers,
  reformatConvertToTons,
} from "@lib/core/campaign/getEmissionNumbers";
import { upperFirst } from "lodash";
import { t } from "i18next";

type ScopeObject = {
  label: string;
  value: Scope;
};

interface Props {
  trajectory: CampaignTrajectory;
  trajectorySettings: TrajectorySettings;
  scope: ScopeObject;
  trajectoryOptions: { value: number; label: string }[];
}

const ScopeCard = ({
  trajectory,
  trajectorySettings,
  scope,
  trajectoryOptions,
}: Props) => {
  const dispatch = useDispatch();
  const withReadOnlyAccessControl = useReadOnlyAccessControl();

  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);

  const scopeLabel = scopeLabels[scope.value];

  const campaignInfo = useSelector<RootState, CampaignInformation | undefined>(
    state => state.campaign.campaigns[trajectory.campaignId]?.information
  );

  const updateScopeTarget = ({
    target,
    description,
    trajectorySettings,
    currentScope,
  }: {
    target?: number | null;
    description?: string | null;
    trajectorySettings: TrajectorySettings;
    currentScope: Scope;
  }) => {
    target = target
      ? target
      : trajectorySettings.scopeTargets[currentScope].target
      ? trajectorySettings.scopeTargets[currentScope].target
      : getTrajectoryOptionsforScope(currentScope)[0].value;
    description =
      description ?? trajectorySettings.scopeTargets[currentScope].description;
    if (trajectorySettings.id != null) {
      dispatch(
        requestSaveScopeTarget(
          trajectorySettings.id,
          currentScope,
          target,
          description
        )
      );
    }
  };

  const scopeTco2 = useNotExcludedEntriesInfoByScope(trajectory.campaignId)[
    scope.value
  ].tCo2;

  const yearRange = getYearRange(campaignInfo, trajectorySettings);
  const target = targetForReduction(
    yearRange ?? 0,
    trajectorySettings.scopeTargets[scope.value].target ??
      getTrajectoryOptionsforScope(scope.value)[0].value
  );
  const targetTco2 = getXPercentOf(target, scopeTco2);

  return (
    <div className={cx(styles.scopeCard)}>
      <div className={cx(styles.titleScopeContainer)}>
        <h1 className={cx(styles.titleScope)}>{scope.label.toUpperCase()}</h1>
      </div>
      <div className={cx(styles.scopeFieldsContainer)}>
        <div className={cx(styles.scopeField)}>
          <p className={cx(styles.scopeLabel)}>
            {upperFirst(t("trajectory.definition.trajectoryChoice"))}
          </p>
          <SelectOne
            className={styles.targetReductionByYear}
            selected={
              trajectorySettings.scopeTargets[scope.value].target ??
              trajectoryOptions[0].value
            }
            onOptionClick={withReadOnlyAccessControl((target: number) => {
              isManager &&
                updateScopeTarget({
                  target,
                  trajectorySettings,
                  currentScope: scope.value,
                });
            })}
          >
            {ctx => (
              <>
                {trajectoryOptions.map(({ value, label }) => (
                  <Option {...ctx} value={value} key={value}>
                    {label}
                  </Option>
                ))}
              </>
            )}
          </SelectOne>
        </div>
        <div className={cx(styles.scopeField, styles.scopeResult)}>
          <p className={cx(styles.scopeLabel)}>
            {upperFirst(t("footprint.emission.total"))}
          </p>
          <div className={styles.scopeTco2BadgeContainer}>
            <p className={styles.tco2Badge}>
              {reformatConvertToTons(scopeTco2)}{" "}
              {t("footprint.emission.tco2.tco2e")}{" "}
            </p>
          </div>
        </div>
        <div className={cx(styles.scopeField, styles.scopeResult)}>
          <p className={cx(styles.scopeLabel)}>
            {upperFirst(t("trajectory.definition.reductionTarget"))}{" "}
            {upperFirst(t("global.other.for"))} {trajectorySettings.targetYear}{" "}
            {scopeLabel.toLowerCase()}
          </p>
          <ReductionBadge
            value={roundTwoDecimals(target)}
            alternativeValue={targetTco2}
          />
        </div>
      </div>
    </div>
  );
};

export default ScopeCard;
