import { useSelector } from "react-redux";
import { useState } from "react";
import { merge } from "lodash/fp";
import { range, upperFirst } from "lodash";
import { EChartsOption } from "echarts";

import ReactEChart from "@components/helpers/echarts/ReactEChart";

import { RootState } from "@reducers/index";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";
import { Scope } from "@custom-types/wecount-api/activity";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { CampaignsYearSpan } from "@selectors/campaign/selectCampaignsYearSpan";
import { CampaignType } from "@custom-types/core/CampaignType";

import selectCampaignsInfoByCategory from "@selectors/activityEntryInfoByCampaigns/selectCampaignsInfoByCategory";
import useReductionInfoByCategoryForTrajectoryDashboardSwitchDefinitionLevers from "@hooks/core/useReductionInfoByCategoryForTrajectoryDashboardSwitchDefinitionLevers";
import selectCartography from "@selectors/cartography/selectCartography";
import { ActivityCategory } from "@reducers/core/categoryReducer";

import { defaultEndYear } from "../defaultEndYear";
import { arrayProjection } from "@lib/utils/arrayProjection";
import baseOptions, {
  defaultFontSize,
  getDualColorLegend,
} from "@components/helpers/echarts/baseOptions";
import getScopeName from "@lib/utils/getScopeName";
import { buildTrajectorySerie } from "./helpers/buildTrajectorySerie";
import { Color, getPalette } from "@lib/utils/hashColor";
import { emissionSerieBuilder } from "./helpers/emissionSerieBuilder";
import { projectionSerieBuilder } from "./helpers/projectionSerieBuilder";
import { getTrajectoryOptionsforScope } from "@components/campaign/detail/trajectory/utils/trajectoryOptionsForScopes";
import { t } from "i18next";

const RESULT_PERCENTAGE_THRESHOLD = 1;

interface Props {
  entriesByCampaign: EntriesByCampaign;
  trajectorySettings: TrajectorySettings;
  trajectoryOfReference: CampaignTrajectory;
  yearSpan: CampaignsYearSpan;
  scope: Scope;
  campaignTypes: Record<number, CampaignType>;
}

const HistoryScopeChart = ({
  entriesByCampaign,
  trajectorySettings,
  trajectoryOfReference,
  yearSpan,
  scope,
  campaignTypes,
}: Props) => {
  const campaignsInfoByCategory = useSelector((state: RootState) =>
    selectCampaignsInfoByCategory(state, entriesByCampaign)
  );
  const cartography = useSelector(selectCartography);
  const categoriesInScope = Object.values(cartography[scope]);
  const usedCategories = categoriesInScope.reduce((acc, category) => {
    const firstCampaignWithResult = Object.values(campaignsInfoByCategory).find(
      campaignInfo => {
        const categoryTco2 = campaignInfo[category.id]?.tCo2 ?? 0;
        return categoryTco2 > 0;
      }
    );
    const firstResultOfCategory =
      firstCampaignWithResult?.[category.id]?.tCo2 ?? 0;
    if (firstResultOfCategory > 0) {
      acc.push({ ...category, firstResultOfCategory });
    }
    return acc;
  }, [] as (ActivityCategory & { firstResultOfCategory: number })[]);

  const initialDisplayedCategories = usedCategories.reduce((acc, category) => {
    acc[category.name] = true;
    return acc;
  }, {} as Record<string, boolean>);

  const [displayedCategoryNames, setDisplayedCategoryNames] = useState(
    initialDisplayedCategories
  );

  const targetYear = trajectorySettings.targetYear;
  const endYear = Math.max(
    defaultEndYear,
    targetYear ?? -Infinity,
    yearSpan.end
  );

  const years = range(yearSpan.start, endYear + 1);

  const campaignIdsByDate = yearSpan.campaignIdsByYear;

  const reductionInfoByCategory =
    useReductionInfoByCategoryForTrajectoryDashboardSwitchDefinitionLevers(
      trajectoryOfReference.id
    );

  const campaignOfReferenceInfoByCategory =
    campaignsInfoByCategory[campaignIdsByDate[yearSpan.start]];

  usedCategories.sort((categoryA, categoryB) => {
    return categoryB.firstResultOfCategory - categoryA.firstResultOfCategory;
  });

  const displayedCategories = usedCategories.filter(
    category => displayedCategoryNames[category.name]
  );

  const tco2Totals = years.map(year => {
    return displayedCategories.reduce((total, category) => {
      const campaignId = campaignIdsByDate[year];
      const categoryResult =
        campaignsInfoByCategory[campaignId]?.[category.id]?.tCo2 ?? 0;
      return total + categoryResult;
    }, 0);
  });
  const greaterTotal = Math.max(...tco2Totals);

  const colorOfCategoriesForEmission = arrayProjection(
    usedCategories.map(category => category.id).reverse(),
    getPalette(Color.EMISSION_BLUE)
  );
  const colorOfCategoriesForSimulation = arrayProjection(
    usedCategories.map(category => category.id).reverse(),
    getPalette(Color.PROJECTION_PURPLE)
  );

  const emissionSeries = usedCategories.map(
    emissionSerieBuilder({
      years,
      campaignIdsByDate,
      campaignsInfoByCategory,
      colorOfCategoriesForEmission,
      colorOfCategoriesForSimulation,
      tco2Totals,
      campaignTypes,
    })
  );

  const projectionSeries =
    targetYear !== null && campaignIdsByDate[targetYear] == null
      ? usedCategories.map(
          projectionSerieBuilder({
            years,
            targetYear,
            campaignOfReferenceInfoByCategory,
            reductionInfoByCategory,
            colorOfCategories: colorOfCategoriesForSimulation,
            tco2Totals,
            displayedCategoryNames,
          })
        )
      : [];

  const scopeTarget =
    trajectorySettings.scopeTargets[scope]?.target ??
    getTrajectoryOptionsforScope(scope)[0].value;

  const trajectorySerie = buildTrajectorySerie({
    years,
    campaignOfReferenceTotal: tco2Totals[0] ?? 0,
    scopeTarget,
  });

  const series = [...emissionSeries, ...projectionSeries, trajectorySerie];

  const shownCategories = usedCategories.filter(category => {
    return years.some(year => {
      const campaignId = campaignIdsByDate[year];
      const categoryResult =
        campaignsInfoByCategory[campaignId]?.[category.id]?.tCo2 ?? 0;
      return (
        (categoryResult / greaterTotal) * 100 > RESULT_PERCENTAGE_THRESHOLD
      );
    });
  });

  const options: EChartsOption = {
    title: {
      text: `${upperFirst(
        t("dashboard.annualGlobalAnalysis")
      )} > ${getScopeName(scope)}`,
    },
    xAxis: {
      data: years,
    },
    legend: {
      textStyle: {
        fontSize: defaultFontSize,
      },
      bottom: 0,
      data: [
        ...shownCategories.map(category => ({
          name: category.name,
          itemStyle: {
            color: getDualColorLegend(
              colorOfCategoriesForEmission[category.id],
              colorOfCategoriesForSimulation[category.id]
            ),
          },
        })),
        upperFirst(t("trajectory.trajectory")),
      ],
    },
    series,
  };

  return (
    <ReactEChart
      option={merge(baseOptions, options)}
      replaceMerge="series"
      onEvents={[
        {
          eventName: "legendselectchanged",
          handler: ({ selected }: { selected: Record<string, boolean> }) => {
            setDisplayedCategoryNames(
              merge(initialDisplayedCategories, selected)
            );
          },
        },
      ]}
    />
  );
};

export default HistoryScopeChart;
