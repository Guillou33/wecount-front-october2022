import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import _, { upperFirst } from "lodash";

import { RootState } from "@reducers/index";
import { CategoryInfo } from "@hooks/core/useCategoryInfo";
import { Scope } from "@custom-types/wecount-api/activity";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";

import { comparisonDashboardOptions } from "../helpers/comparisonDashboardConfig";
import { convertToTons, percentageCalculator } from "@lib/utils/calculator";
import { getSomeBlue, getSomeOrange } from "@lib/utils/hashColor";

import selectEntryInfoByCategory, {
  makeSelectEntryInfoByCategory,
} from "@selectors/activityEntryInfo/selectEntryInfoByCategory";
import { t } from "i18next";


const selectEntryInfoByCategoryForComparison = makeSelectEntryInfoByCategory();

type RelevantActivityInfo = {
  tCo2: number;
  categoryId: number;
  category: string;
  scope: Scope;
};

type ScopeGroup = {
  [key in Scope]: ScopeCount;
};

type ScopeCount = {
  tCo2: number;
  targetTco2: number;
  lastcategory: number | null;
};

const getInitialScopeGroup = (): ScopeGroup => ({
  [Scope.CORE]: getInitialScopeCount(),
  [Scope.DOWNSTREAM]: getInitialScopeCount(),
  [Scope.UPSTREAM]: getInitialScopeCount(),
});
const getInitialScopeCount = (): ScopeCount => ({
  tCo2: 0,
  targetTco2: 0,
  lastcategory: null,
});

const extractEntryInfo =
  (categoryInfo: CategoryInfo) =>
  ([categoryId, entryInfo]: [string, EntryInfo]): RelevantActivityInfo => {
    const category = categoryInfo[Number(categoryId)];
    const tCo2 = entryInfo.tCo2;
    return {
      tCo2,
      categoryId: category.id,
      scope: category.scope,
      category: category.name,
    };
  };

const datasetsBuilder = (
  resultTco2Total: number,
  activityCountByScope: ScopeGroup,
  buildFor: "mainCampaign" | "comparisonCampaign"
) => {
  const getPercentOfTotal = percentageCalculator(resultTco2Total);
  const buildingForMainCampaign = buildFor === "mainCampaign";
  const getSomeColor = buildingForMainCampaign ? getSomeBlue : getSomeOrange;
  return (activityInfo: RelevantActivityInfo) => {
    const result = convertToTons(activityInfo.tCo2);
    const percentForTooltip = getPercentOfTotal(activityInfo.tCo2).toString();

    const scopeCount = activityCountByScope[activityInfo.scope];
    return {
      label: activityInfo.category,
      backgroundColor: getSomeColor(activityInfo.category),
      data: [
        activityInfo.scope !== Scope.UPSTREAM ? 0 : result,
        activityInfo.scope !== Scope.CORE ? 0 : result,
        activityInfo.scope !== Scope.DOWNSTREAM ? 0 : result,
      ],
      custumTooltipMetadata: {
        percentTotal: percentForTooltip,
        rawValue: result,
      },
      customLabelMetadata: {
        tCo2: scopeCount.tCo2,
        targetTco2: scopeCount.targetTco2,
        displayLabel: scopeCount.lastcategory === activityInfo.categoryId,
      },
      stack: buildFor,
      datalabels: {
        color: buildingForMainCampaign ? "blue" : "#d35400",
      },
    };
  };
};

const scopeCounter = (
  acc: ScopeGroup,
  activity: RelevantActivityInfo
): ScopeGroup => {
  const scopeCount = acc[activity.scope];
  scopeCount.tCo2 += activity.tCo2;
  scopeCount.lastcategory = activity.categoryId;

  return acc;
};

interface Props {
  categoryInfo: CategoryInfo;
  resultTco2Total: number;
  campaignToCompareId: number;
  campaignToCompareResultTco2: number;
  mainCampaignEntries: ActivityEntryExtended[];
  compareToCAmpaignEntries: ActivityEntryExtended[];
}

const CampaignComparison = ({
  resultTco2Total,
  categoryInfo,
  campaignToCompareId,
  campaignToCompareResultTco2,
  mainCampaignEntries,
  compareToCAmpaignEntries,
}: Props) => {

  const entryInfoByCategory = useSelector((state: RootState) =>
    selectEntryInfoByCategory(state, mainCampaignEntries)
  );
  const entryInfoByCategoryToCompare = useSelector((state: RootState) =>
    selectEntryInfoByCategoryForComparison(state, compareToCAmpaignEntries)
  );

  const entries = Object.entries(entryInfoByCategory)
    .map(extractEntryInfo(categoryInfo))
    .filter(entryInfo => entryInfo.tCo2 > 0);

  const activityCountByScope: ScopeGroup = entries.reduce(
    scopeCounter,
    getInitialScopeGroup()
  );

  const entriesToCompare = Object.entries(entryInfoByCategoryToCompare)
    .map(extractEntryInfo(categoryInfo))
    .filter(entryInfo => entryInfo.tCo2 > 0);

  const activityToCompareCountByScope: ScopeGroup = entriesToCompare.reduce(
    scopeCounter,
    getInitialScopeGroup()
  );

  const mainCampaignDatasetBuilder = datasetsBuilder(
    resultTco2Total,
    activityCountByScope,
    "mainCampaign"
  );
  const comparisonCampaignDatasetBuilder = datasetsBuilder(
    campaignToCompareResultTco2,
    activityToCompareCountByScope,
    "comparisonCampaign"
  );
  const emissionDatasets = entries.map(mainCampaignDatasetBuilder);
  const comparisonCampaignDatasets = entriesToCompare.map(
    comparisonCampaignDatasetBuilder
  );
  return (
    <Bar
      plugins={[ChartDataLabels]}
      data={{
        labels: [upperFirst(t("footprint.scope.upstream")), upperFirst(t("footprint.scope.core")), upperFirst(t("footprint.scope.downstream"))],
        datasets: [...emissionDatasets, ...comparisonCampaignDatasets],
      }}
      options={comparisonDashboardOptions}
      datasetKeyProvider={() => _.uniqueId()}
    />
  );
};

export default CampaignComparison;
