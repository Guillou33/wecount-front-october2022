import { useSelector } from "react-redux";
import { merge } from "lodash/fp";
import { range, upperFirst } from "lodash";
import { EChartsOption, SeriesOption } from "echarts";
import { useState } from "react";
import { t } from "i18next";

import ReactEChart from "@components/helpers/echarts/ReactEChart";

import { RootState } from "@reducers/index";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";
import { Scope } from "@custom-types/wecount-api/activity";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { CampaignsYearSpan } from "@selectors/campaign/selectCampaignsYearSpan";
import { CampaignType } from "@custom-types/core/CampaignType";

import selectCampaignsInfoByScope from "@selectors/activityEntryInfoByCampaigns/selectCampaignsInfoByScope";
import useReductionInfoByScopeForTrajectoryDashboardSwitchDefinitionLevers from "@hooks/core/useReductionInfoByScopeForTrajectoryDashboardSwitchDefinitionLevers";

import { defaultEndYear } from "../defaultEndYear";
import baseOptions, {
  defaultFontSize,
  getDualColorLegend,
} from "@components/helpers/echarts/baseOptions";
import getScopeName from "@lib/utils/getScopeName";
import { getPalette, Color } from "@lib/utils/hashColor";
import { arrayProjection } from "@lib/utils/arrayProjection";
import { getSelectedScopes, ScopeSelection } from "./helpers/getSelectedScopes";
import { projectionSerieBuilder } from "./helpers/projectionSerieBuilder";
import { emissionSerieBuilder } from "./helpers/emissionSerieBuilder";
import { buildTrajectorySerie } from "./helpers/buildTrajectorySerie";

interface Props {
  entriesByCampaign: EntriesByCampaign;
  trajectorySettings: TrajectorySettings;
  trajectoryOfReference: CampaignTrajectory;
  yearSpan: CampaignsYearSpan;
  campaignTypes: Record<number, CampaignType>;
}

const HistoryTotalChart = ({
  entriesByCampaign,
  trajectorySettings,
  trajectoryOfReference,
  yearSpan,
  campaignTypes,
}: Props) => {
  const campaignsInfoByScope = useSelector((state: RootState) =>
    selectCampaignsInfoByScope(state, entriesByCampaign)
  );

  const [displayedScopes, setDisplayedScope] = useState<Scope[]>([
    Scope.UPSTREAM,
    Scope.CORE,
    Scope.DOWNSTREAM,
  ]);

  const targetYear = trajectorySettings.targetYear;
  const endYear = Math.max(
    defaultEndYear,
    targetYear ?? -Infinity,
    yearSpan.end
  );

  const years = range(yearSpan.start, endYear + 1);

  const campaignIdsByDate = yearSpan.campaignIdsByYear;

  const reductionInfoByScope =
    useReductionInfoByScopeForTrajectoryDashboardSwitchDefinitionLevers(
      trajectoryOfReference.id
    );

  const campaignOfReferenceTotalByScope =
    campaignsInfoByScope[campaignIdsByDate[yearSpan.start]];

  const tco2Totals = years.map(year => {
    const campaignId = campaignIdsByDate[year];
    const campaignTotalResult = displayedScopes.reduce((total, scope) => {
      return total + (campaignsInfoByScope[campaignId]?.[scope]?.tCo2 ?? 0);
    }, 0);
    return campaignTotalResult;
  });

  const colorOfScopesForEmission = arrayProjection(
    [Scope.DOWNSTREAM, Scope.CORE, Scope.UPSTREAM],
    getPalette(Color.EMISSION_BLUE)
  );
  const colorOfScopesForSimulation = arrayProjection(
    [Scope.DOWNSTREAM, Scope.CORE, Scope.UPSTREAM],
    getPalette(Color.PROJECTION_PURPLE)
  );

  const buildEmissionSerie = emissionSerieBuilder({
    years,
    campaignIdsByDate,
    campaignsInfoByScope,
    tco2Totals,
    colorOfScopesForEmission,
    colorOfScopesForSimulation,
    campaignTypes,
  });

  const emissionSeries: SeriesOption[] =
    displayedScopes.map(buildEmissionSerie);

  const projectionSeries =
    targetYear !== null && campaignIdsByDate[targetYear] == null
      ? displayedScopes.map(
          projectionSerieBuilder({
            targetYear,
            years,
            campaignOfReferenceTotalByScope,
            reductionInfoByScope,
            tco2Totals,
            colorOfScopes: colorOfScopesForSimulation,
          })
        )
      : [];

  const trajectorySerie = buildTrajectorySerie({
    years,
    campaignOfReferenceTotalByScope,
    scopes: displayedScopes,
    scopeTargets: trajectorySettings.scopeTargets,
  });

  const series = [...emissionSeries, ...projectionSeries, trajectorySerie];

  const options: EChartsOption = {
    title: {
      text: `${upperFirst(t("dashboard.annualGlobalAnalysis"))}`,
    },
    legend: {
      textStyle: {
        fontSize: defaultFontSize,
      },
      data: [
        ...[Scope.UPSTREAM, Scope.CORE, Scope.DOWNSTREAM].map(scope => ({
          name: getScopeName(scope),
          itemStyle: {
            color: getDualColorLegend(
              colorOfScopesForEmission[scope],
              colorOfScopesForSimulation[scope]
            ),
          },
        })),
        upperFirst(t("trajectory.trajectory")),
      ],
      bottom: 0,
    },
    xAxis: {
      data: years,
    },
    series,
  };

  return (
    <ReactEChart
      option={merge(baseOptions, options)}
      onEvents={[
        {
          eventName: "legendselectchanged",
          handler: ({ selected }: { selected: ScopeSelection }) => {
            const selectedScopes = getSelectedScopes(selected);
            setDisplayedScope(selectedScopes);
          },
        },
      ]}
    />
  );
};

export default HistoryTotalChart;
