
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import { RootState } from "@reducers/index";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import { Color, getPalette } from "@lib/utils/hashColor";
import { convertToTons } from "@lib/utils/calculator";
import { t } from "i18next";

import {
      ActivityModelInfo,
      ActivityModelWithCategory,
} from "@hooks/core/useActivityModelInfo";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import selectEntryInfoTotal from "@selectors/activityEntryInfo/selectEntryInfoTotal";

import { BarSeriesOption, EChartsOption } from "echarts";
import ReactEChart from "@components/helpers/echarts/ReactEChart";
import { wecountFormat } from "@lib/core/campaign/getEmissionNumbers";
import mapObject from "@lib/utils/mapObject";
import { arrayProjection } from "@lib/utils/arrayProjection";
import { merge } from "lodash/fp";
import baseOptions2 from "./helpers/baseOptions2";
import { startEdit } from "@actions/activity/edit/editActions";


interface DataPositions {
      [key: number]: {
            activityModelName: string;
            position: number;
            tco2Total: number;
      };
}

function buildActivityModelPositions(
      activityModels: ActivityModelInfo,
      entries: ActivityEntryExtended[]
): DataPositions {

      const positions: DataPositions = {};
      for (const entry of entries) {
            const activityModel = activityModels[entry.activityModelId];
            if (positions[entry.activityModelId] == null) {
                  positions[entry.activityModelId] = {
                        activityModelName: activityModel.name,
                        position: Object.keys(positions).length,
                        tco2Total: 0,
                  };
            }
            positions[entry.activityModelId].tco2Total += entry.resultTco2;
      }
      return positions;
}

interface Props {
      selectedCategory: number;
      entries: ActivityEntryExtended[];
}

const ActivityCategoryDashboard = ({
      selectedCategory,
      entries,
}: Props) => {
      const dispatch = useDispatch();
      const activityModelInfo = useActivityModelInfo();

      const { tCo2: resultTco2Total } = useSelector((state: RootState) =>
            selectEntryInfoTotal(state, entries)
      );

      const entriesForSelectedCategory = entries.filter(
            entry =>
                  activityModelInfo[entry.activityModelId].category.id === selectedCategory
      );

      const activityModels = Object.values(activityModelInfo).filter(
            (activityModel): activityModel is ActivityModelWithCategory =>
                  activityModel.category.id === selectedCategory
      );

      const activityModelPositions = buildActivityModelPositions(
            activityModelInfo,
            entriesForSelectedCategory
      );

      function GroupBy<T, U extends string | number>(
            list: T[],
            fn: (item: T) => U
      ): Record<U, T[]> {
            return list.reduce((acc, item) => {
                  const key = fn(item);
                  if (acc[key] == null) {
                        acc[key] = [];
                  }
                  acc[key].push(item);
                  return acc;
            }, {} as Record<U, T[]>);
      }

      const groupByActvModID = GroupBy(entriesForSelectedCategory, x => x.activityModelId)


      const sortedTCO2ByCategort = Object.values(groupByActvModID).map((item) =>
            item.sort((a, b) => b.resultTco2 - a.resultTco2)
      );

      const totalOfTCO2ByBar = mapObject(groupByActvModID, (x) =>
            x.reduce((total, next) => {
                  return total + next.resultTco2
            }, 0)
      );

      const labelColorsMap = mapObject(groupByActvModID, x =>
            arrayProjection(x.map((x: { id: any; }) => x.id),
                  [...getPalette(Color.EMISSION_BLUE)].reverse()
            ))


      const Series = sortedTCO2ByCategort.flatMap((x) => {
            return x.map((item, index, list): BarSeriesOption => {

                  const result = convertToTons(item.resultTco2);
                  const data = Array(activityModels.length).fill("-");
                  data[activityModelPositions[item.activityModelId].position] = result

                  return {
                        data: data,
                        type: "bar",
                        stack: "total",
                        label: {
                              position: "top",
                              show: index == list.length - 1 ? true : false,
                              formatter: () =>
                                    `${convertToTons(totalOfTCO2ByBar[item.activityModelId]).toString()} t`,
                        },
                        emphasis: {
                              focus: 'series'
                        },
                        itemStyle: {
                              color: labelColorsMap[item.activityModelId][item.id!]
                        },

                  }
            })
      });


      const option: EChartsOption = {
            tooltip: {
                  valueFormatter: (value: any) =>
                        `${wecountFormat(Number(value))} ${t(
                              "footprint.emission.tco2.tco2e"
                        )}`,
            },
            //the color doesnt brighten when cursor passes
            emphasis: {
                  disabled: true
            },
            xAxis: [
                  {
                        type: 'category',
                        data: Object.values(activityModelPositions).map(item =>

                              item.activityModelName,
                        ),
                  }
            ],
            yAxis: [
                  {
                        type: 'value',
                        nameLocation: "middle",
                        name: "Équivalents tonnes CO2",
                        nameGap: 50
                  }
            ],
            series: Series,
      }


      const clicked = (param: any) => {
            const comparisonData = sortedTCO2ByCategort.flatMap(x => x.map(item => {
                  return {
                        tc: convertToTons(item.resultTco2),
                        activityModelId: item.activityModelId
                  }
            }))
            const activityModelId: any | {} = comparisonData.reduce((obj, item) => ({ ...obj, activityModelId: item.activityModelId }), {});
            const index = param.seriesIndex;

            if (param.data == comparisonData[index].tc) {
                  dispatch(startEdit(activityModelId));
            }
      }

      return (
            <div style={{
                  position: "relative",
                  height: "100vh",
                  width: 'auto',
                  paddingBottom: '60px',
                  overflow: "hidden"
            }}>
                  <ReactEChart
                        onEvents={[{ eventName: 'click', handler: clicked }]}
                        option={merge(baseOptions2, option)}
                        replaceMerge="series"
                        notMerge={true}
                  />
            </div>
      );
};

export default ActivityCategoryDashboard;

