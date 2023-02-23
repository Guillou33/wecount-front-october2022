import cx from "classnames";
import { Scope } from "@custom-types/wecount-api/activity";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";
import { Campaign as CampaignType } from "@reducers/campaignReducer";
import React from "react";
import { scopeLabels } from "./utils/scopeLabels";
import styles from "@styles/campaign/detail/trajectory/trajectory.module.scss";
import { GhostContainer } from "@components/helpers/ui/selects/selectionContainers";
import { YearPicker } from "@components/helpers/ui/selects";
import { useDispatch } from "react-redux";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
import { requestSaveTargetYear } from "@actions/trajectory/trajectorySettings/trajectorySettingsActions";
import ScopeCard from "./scopes/ScopeCard";
import ScopeOverview from "./scopes/ScopeOverview";
import CampaignsDropdown from "../CampaignsDropdown";
import MacroView from "./macro/MacroView";
import useReductionInfoByScopeSwitchDefinitionLevers from "@hooks/core/useReductionInfoByScopeSwitchDefinitionLevers";
import useSetOnceCategoryProjectionsView from "@hooks/core/reduxSetOnce/useSetOnceCategoryProjectionsView";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import moment from "moment";
import ReductionTableView from "./macro/ReductionTableView";
import useNotExcludedEntriesInfoByScope from "@hooks/core/notExcludedActivityEntryInfo/useNotExcludedEntriesInfoByScope";
import { getTrajectoryOptionsforScope } from "./utils/trajectoryOptionsForScopes";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  trajectory: CampaignTrajectory;
  trajectorySettings: TrajectorySettings;
  campaign: CampaignType;
}

const TrajectoryDefinition = ({
  trajectory,
  trajectorySettings,
  campaign,
}: Props) => {
  useSetOnceCategoryProjectionsView(trajectory.id);

  const dispatch = useDispatch();
  const withReadOnlyAccessControl = useReadOnlyAccessControl();

  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);

  const availableScopes = Object.values(Scope).map(scope => ({
    label: scopeLabels[scope],
    value: scope,
  }));

  const referenceYear =
    campaign?.information?.year ?? parseInt(moment().format("YYYY"));

  const scopesCard = availableScopes.map((scope, index) => {
    const trajectoryOptionsforScope = getTrajectoryOptionsforScope(scope.value);

    return (
      <div key={index} className={cx(styles.definitionContainer)}>
        <ScopeCard
          trajectory={trajectory}
          trajectorySettings={trajectorySettings}
          scope={scope}
          trajectoryOptions={trajectoryOptionsforScope}
        />
        <ScopeOverview
          trajectory={trajectory}
          targetYear={trajectorySettings.targetYear}
          campaign={campaign}
          scope={scope}
        />
      </div>
    );
  });

  return (
    <div className={styles.main} style={{ marginTop: 20 }}>
      <div className={cx("alert", styles.introMessage)}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div className={cx(styles.helpInfo)}>
            <i className="fa fa-question"></i>
          </div>
          <p style={{ marginBottom: 0 }}>
            {upperFirst(t("trajectory.definition.helpinfo.part1"))}{" "}
            <b>{t("trajectory.trajectory")}</b>{" "}
            {t("trajectory.definition.helpinfo.part2")}.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <p>
            {upperFirst(t("trajectory.definition.helpinfo.part3"))}{" "}
            <b>Well Below 2°C</b>, {t("trajectory.definition.helpinfo.part4")}{" "}
            <b>25%</b>. {upperFirst(t("trajectory.definition.helpinfo.part5"))}{" "}
            <b>{t("trajectory.definition.helpinfo.part6")}</b>{" "}
            {t("trajectory.definition.helpinfo.part7")}{" "}
            <b>{t("trajectory.definition.helpinfo.part8")}</b>.
            {/* Pour en savoir plus,{" "}
                    <b>consultez les différentes aides présentes sur la page.</b> */}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <p>
            {upperFirst(t("trajectory.definition.more.part1"))}{" "}
            <a
              className={styles.linkTrajectoryMessage}
              href="https://www.notion.so/wecount/Trajectoires-1c31e9097f4a4187a7f7b8c77d00e5da"
              target="_blank"
            >
              <b>{t("trajectory.definition.more.part2")}</b>
            </a>
            .
          </p>
        </div>
      </div>
      <div className={cx(styles.topBar, styles.topBarDefinition)}>
        <div className={cx(styles.campaignReferenceSelection)}>
          <p className={cx(styles.campaignReference)}>
            {upperFirst(t("campaign.reference"))}
          </p>
          <CampaignsDropdown
            campaignName={campaign?.information?.name ?? " "}
            basePath={"trajectories"}
          />
        </div>
        <YearPicker
          className={styles.yearSelector}
          selected={trajectorySettings.targetYear}
          onOptionClick={withReadOnlyAccessControl(targetYear => {
            if (trajectorySettings.id != null && isManager) {
              dispatch(
                requestSaveTargetYear(trajectorySettings.id, targetYear)
              );
            }
          })}
          renderSelectionContainer={ctx => (
            <GhostContainer {...ctx}>
              <div className={styles.selectedYearField}>
                <img
                  className={styles.iconTargetYear}
                  src="/icons/icon-target-color-primary-2.svg"
                  alt={t("global.common.target")}
                />
                {upperFirst(t("campaign.targetYear"))} :{" "}
                <span className={cx(styles.selectedYear, styles.clickable)}>
                  {trajectorySettings.targetYear ?? `${t("global.choose")}...`}
                </span>
              </div>
            </GhostContainer>
          )}
        />
      </div>
      {scopesCard}
      <div className={cx(styles.reductionTableView)}>
        <ReductionTableView
          referenceYear={referenceYear}
          targetYear={trajectorySettings.targetYear ?? referenceYear}
          trajectory={trajectory}
          trajectorySettings={trajectorySettings}
        />
      </div>
      <div className={cx(styles.macroView)}>
        <MacroView currentTrajectory={trajectory} />
      </div>
    </div>
  );
};

export default TrajectoryDefinition;
