import React from "react";
import cx from 'classnames';
import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { convertToTons, getXPercentOf, percentageCalculator } from "@lib/utils/calculator";
import { scopeLabels } from "../utils/scopeLabels";
import { Scope } from "@custom-types/wecount-api/activity";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";
import useNotExcludedEntriesInfoByScope from "@hooks/core/notExcludedActivityEntryInfo/useNotExcludedEntriesInfoByScope";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import useReductionInfoByScopeSwitchDefinitionLevers from "@hooks/core/useReductionInfoByScopeSwitchDefinitionLevers";
import {
    BarDataChunk,
    DataChunk,
    reductionTotalConfig,
    scopeConfigReference,
    scopeConfigTarget
} from "@components/dashboard/campaign/sub/helpers/reductionTotalConfig";
import { uniqueId, upperFirst } from "lodash";
import { getTrajectoryOptionsforScope } from "../utils/trajectoryOptionsForScopes";
import { t } from "i18next";

interface Props {
    referenceYear: number;
    targetYear: number;
    trajectory: CampaignTrajectory;
    trajectorySettings: TrajectorySettings;
}

const ReductionTableView = ({
    referenceYear,
    targetYear,
    trajectory,
    trajectorySettings
}: Props) => {
    const trajectoryValues = useNotExcludedEntriesInfoByScope(trajectory.campaignId);
    const reductionInfo = useReductionInfoByScopeSwitchDefinitionLevers(trajectory.id);

    let datasets: DataChunk[] = [];

    let labels: number[] = [];
    for (let i = referenceYear!; i <= targetYear!; i++) {
        labels.push(i);
    }

    const availableScopes = Object.values(Scope).map(scope => ({
        label: scopeLabels[scope],
        value: scope,
    }));

    const getPercentOfTotalReference = percentageCalculator(availableScopes.reduce((acc, cur) => {
        return acc + convertToTons(trajectoryValues[cur.value].tCo2);
    }, 0));

    const getPercentOfTotalTarget = percentageCalculator(availableScopes.reduce((acc, cur) => {
        return acc + convertToTons(trajectoryValues[cur.value].tCo2 + reductionInfo[cur.value].reductionTco2);
    }, 0));

    const bars = availableScopes.map(scope => {
        const totalTco2 = trajectoryValues[scope.value].tCo2;
        const totalReduction = trajectoryValues[scope.value].tCo2 + (reductionInfo[scope.value].reductionTco2);

        const rawData = labels.map(year => {
            const total =
                year === referenceYear ? convertToTons(totalTco2) :
                    year === targetYear ? convertToTons(totalReduction) : 0;
            return total;
        });

        const emissions = labels.map(year => {
            const total =
                year === referenceYear ? convertToTons(availableScopes.reduce((acc, cur) => {
                    return acc + trajectoryValues[cur.value].tCo2;
                }, 0)) :
                    year === targetYear ? convertToTons(availableScopes.reduce((acc, cur) => {
                        return acc + (trajectoryValues[cur.value].tCo2 + reductionInfo[cur.value].reductionTco2);
                    }, 0)) : 0;
            return total;
        });

        const bgColors = labels.map(year => {
            const bgColor =
                year === referenceYear ? scopeConfigReference[scope.value].color :
                    year === targetYear ? scopeConfigTarget[scope.value].color : "transparent";
            return bgColor;
        });

        return {
            label: scope.label,
            backgroundColor: bgColors,
            data: rawData,
            custumTooltipMetadata: {
                rawValue: rawData,
                percentTotal: rawData.map((value, index) => {
                    return index === 0 ? getPercentOfTotalReference(value) : getPercentOfTotalTarget(value);
                })
            },
            tco2Totals: emissions
        }
    });

    const lineData = new Array(labels.length);
    lineData[0] = convertToTons(availableScopes.reduce((acc, cur) => {
        return acc + trajectoryValues[cur.value].tCo2;
    }, 0));
    lineData[labels.length - 1] = convertToTons(availableScopes.reduce((acc, cur) => {
        let trajectoryOptionsforScope = getTrajectoryOptionsforScope(cur.value);
        const target = getTargetTco2(
            referenceYear,
            targetYear,
            trajectorySettings.scopeTargets[cur.value].target ?? trajectoryOptionsforScope[0].value,
            trajectoryValues[cur.value].tCo2
        );
        return acc + target;
    }, 0));

    datasets.push({
        type: "line",
        label: upperFirst(t("trajectory.definition.globalTrajectory")),
        borderColor: "#b395e0",
        borderWidth: 2,
        fill: false,
        data: lineData,
    },
        ...bars
    );

    return (
        <div className={styles.categoriesDashboardContainer}>
            <div className={styles.titleContainer}>
                <div className={styles.comparisonTitleWrapper}>
                    <p className={"title-2 color-1"}>{upperFirst(t("trajectory.definition.globalTrajectory"))}</p>
                </div>
            </div>
            <div className={cx(styles.overviewTableContainer, "mt-4")}>
                <Bar
                    plugins={[ChartDataLabels]}
                    data={{
                        labels,
                        datasets,
                    }}
                    options={reductionTotalConfig}
                    datasetKeyProvider={uniqueId}
                />
            </div>
        </div>
    );
}

export default ReductionTableView;

function getTargetTco2(
    referenceYear: number,
    targetYear: number,
    yearlyReduction: number,
    campaignTco2: number
): number {
    const yearRange = targetYear - referenceYear;
    const target = yearRange * yearlyReduction;

    return campaignTco2 - getXPercentOf(target, campaignTco2);
}