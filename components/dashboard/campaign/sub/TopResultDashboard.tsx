import { HorizontalBar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";

import { RootState } from "@reducers/index";
import { ActionPlanDataChunk } from "./helpers/actionPlanDashboardConfig";
import { ActivityModelInfo } from "@hooks/core/useActivityModelInfo";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";

import {
  topEmissionsDashboardOptions,
  topEmissionsDashboardInteractiveOptions,
} from "./helpers/topResultDashboardConfig";
import { colorSelectorBuilder, Color } from "@lib/utils/hashColor";
import { convertToTons, percentageCalculator } from "@lib/utils/calculator";

import { startEdit } from "@actions/activity/edit/editActions";
import { setCurrentCampaign } from "@actions/campaign/campaignActions";

import selectEntryInfoByActivityModel from "@selectors/activityEntryInfo/selectEntryInfoByActivityModel";
import selectEntryInfoTotal from "@selectors/activityEntryInfo/selectEntryInfoTotal";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import { GraphicEventType } from "@custom-types/core/AnalyticEvents";
import { sendResultGraphic } from "@actions/analytics/analyticsActions";

interface DataPositions {
  [key: number]: number;
}

interface Props {
  selectedCampaign: number;
  entries: ActivityEntryExtended[];
  interactiveMode?: boolean;
}

interface ActivityModelData {
  id: number;
  name: string;
  totalTco2: number;
  category: string;
}

interface ActivityDataChunk extends ActionPlanDataChunk {
  activityModelId: number;
}

function getDataPositions(datas: { id: number }[]): DataPositions {
  const positions: DataPositions = {};
  for (const [index, data] of Object.entries(datas)) {
    positions[data.id] = Number(index);
  }
  return positions;
}

const subcategoryDataExtractor =
  (activityModelInfo: ActivityModelInfo) =>
    ([activityModelId, entryInfo]: [string, EntryInfo]): ActivityModelData => ({
      id: Number(activityModelId),
      name: activityModelInfo[Number(activityModelId)].name,
      totalTco2: entryInfo.tCo2,
      category: activityModelInfo[Number(activityModelId)].category.name,
    });

const byDecreasingEmissions = (a: ActivityModelData, b: ActivityModelData) =>
  b.totalTco2 - a.totalTco2;

const isActivityInCutActivityModels =
  (activityModelsPositions: DataPositions) =>
    (entry: ActivityEntryExtended): boolean =>
      activityModelsPositions[entry.activityModelId] != null &&
      entry.resultTco2 != null &&
      entry.resultTco2 > 0;

const dataChunkBuilder = (
  entryInfoByActivityModel: Record<number, EntryInfo>,
  activityModelsPositions: DataPositions,
  lastActivityByActivityModelId: { [key: number]: number },
  totalTco2: number,
  dataLength: number,
  selectColor: (value: number) => string
) => {
  const getPercentOfTotal = percentageCalculator(totalTco2);

  return (entry: ActivityEntryExtended): ActivityDataChunk => {
    const atPosition = activityModelsPositions[entry.activityModelId];
    const data = Array(dataLength).fill(0);

    const result = entry.resultTco2;
    const percentForTooltip = getPercentOfTotal(result).toString();

    data[atPosition] = convertToTons(result);

    return {
      backgroundColor: selectColor(result),
      label: "",
      data,
      custumTooltipMetadata: {
        percentTotal: percentForTooltip,
        rawValue: convertToTons(result),
      },
      customLabelMetadata: {
        displayLabel:
          lastActivityByActivityModelId[entry.activityModelId] ===
          Number(entry.entryKey),
        tCo2: entryInfoByActivityModel[entry.activityModelId].tCo2,
      },
      activityModelId: entry.activityModelId,
      datalabels: {
        color: "blue",
      },
    };
  };
};

const TopResultDashboard = ({
  selectedCampaign,
  entries,
  interactiveMode = false,
}: Props) => {
  const dispatch = useDispatch();

  const activityModelInfo = useActivityModelInfo();

  const entryInfoByActivityModel = useSelector((state: RootState) =>
    selectEntryInfoByActivityModel(state, entries)
  );
  const { tCo2: resultTco2Total } = useSelector((state: RootState) =>
    selectEntryInfoTotal(state, entries)
  );

  const sortedActivityModels = !_.isEmpty(activityModelInfo)
    ? Object.entries(entryInfoByActivityModel)
      .map(subcategoryDataExtractor(activityModelInfo))
      .sort(byDecreasingEmissions)
      .filter(activity => activity.totalTco2 > 0)
    : [];

  const labels = sortedActivityModels.map(({ name, category }) => {
    if (category.length > 25) {
      return [category, name];
    }
    return `${category} - ${name}`;
  });

  const activityModelsPositions = getDataPositions(sortedActivityModels);

  const entriesCutDownToMaximum = entries.filter(
    isActivityInCutActivityModels(activityModelsPositions)
  );

  const activitiesResultsTco2 = entriesCutDownToMaximum.map(
    entry => entry.resultTco2
  );
  const minEmission = Math.min(...activitiesResultsTco2);
  const maxEmission = Math.max(...activitiesResultsTco2);

  const selectColor = colorSelectorBuilder(
    minEmission,
    maxEmission,
    Color.BLUE,
  );

  const lastActivityByActivityModelId = entriesCutDownToMaximum.reduce(
    (acc: { [key: number]: number }, entry) => {
      acc[entry.activityModelId] = Number(entry.entryKey);
      return acc;
    },
    {}
  );

  const emissions = entriesCutDownToMaximum.map(
    dataChunkBuilder(
      entryInfoByActivityModel,
      activityModelsPositions,
      lastActivityByActivityModelId,
      resultTco2Total,
      labels.length,
      selectColor
    )
  );

  const chartRef = useRef<any>();

  useEffect(() => {
    if (chartRef.current != null) {
      chartRef.current.chartInstance.resize();
    }
  });

  return (
    <HorizontalBar
      onElementsClick={() => dispatch(sendResultGraphic({
        eventName: GraphicEventType.PUSH_VIEW_TOP_RESULT,
        campaignId: selectedCampaign
      }))}
      ref={chartRef}
      plugins={[ChartDataLabels]}
      data={{
        labels,
        datasets: emissions,
      }}
      options={
        interactiveMode
          ? topEmissionsDashboardInteractiveOptions
          : topEmissionsDashboardOptions
      }
      datasetKeyProvider={_.uniqueId}
      getElementAtEvent={e => {
        if (interactiveMode && e[0] != null) {
          const { activityModelId } =
            e[0]._chart.config.data.datasets[e[0]._datasetIndex];
          dispatch(setCurrentCampaign({ campaignId: selectedCampaign }));
          dispatch(startEdit({ activityModelId }));
        }
      }}
    />
  );
};

export default TopResultDashboard;
