import { useSelector, useDispatch } from "react-redux";
import _, { upperFirst } from "lodash";

import { RootState } from "@reducers/index";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";
import { ActivityModelInfo } from "@hooks/core/useActivityModelInfo";
import { Scope } from "@custom-types/wecount-api/activity";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import { viewByCategory } from "@actions/chartNavigation/chartNavigationActions";

import selectEntryInfoByActivityModel from "@selectors/activityEntryInfo/selectEntryInfoByActivityModel";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import { EChartsOption } from "echarts";
import ReactEChart from "@components/helpers/echarts/ReactEChart";
import { wecountFormat } from "@lib/core/campaign/getEmissionNumbers";
import { t } from "i18next";
import { arrayProjection } from "@lib/utils/arrayProjection";
import { getPalette, Color } from "@lib/utils/hashColor";
import mapObject from "@lib/utils/mapObject";
import { convertToTons } from "@lib/utils/calculator";
import { merge } from "lodash/fp";
import baseOptions2 from "./helpers/baseOptions2";

type RelevantActivityModelInfo = {
  tCo2: number;
  categoryId: number;
  categoryName: string;
  id: number;
  name: string;
  scope: Scope;
};

type CategoryGroup = {
  [key: number]: CategoryCount;
};

type CategoryCount = {
  tCo2: number;
  categoryName: string;
  lastActivityModel: number;
  datasetPosition: number;
  categoryId: number;
};

function getInitialCategoryCount(index: number, name: string): CategoryCount {
  return {
    tCo2: 0,
    categoryName: name,
    lastActivityModel: 0,
    datasetPosition: index,
    categoryId: 0,
  };
}

function extractActivityModelInfo(activityModelInfo: ActivityModelInfo) {
  return ([activityModelId, entryInfo]: [
    string,
    EntryInfo
  ]): RelevantActivityModelInfo => {
    const activityModel = activityModelInfo[Number(activityModelId)];
    const { tCo2 } = entryInfo;
    return {
      tCo2,
      id: activityModel.id,
      name: activityModel.name,
      categoryName: activityModel.category.name,
      categoryId: activityModel.category.id,
      scope: activityModel.category.scope,
    };
  };
}

interface Props {
  entries: ActivityEntryExtended[];
  scope: Scope;
}

const CategoriesDashboard = ({ entries, scope }: Props) => {
  const dispatch = useDispatch();
  const activityModelInfo = useActivityModelInfo();

  const entryInfoByActivityModel = useSelector((state: RootState) =>
    selectEntryInfoByActivityModel(state, entries)
  );

  const activities = Object.entries(entryInfoByActivityModel)
    .map(extractActivityModelInfo(activityModelInfo))
    .filter((activity) => activity.scope === scope);

  const activityCountByCategory: CategoryGroup = activities.reduce(
    (acc: CategoryGroup, activityModelInfo: RelevantActivityModelInfo) => {
      if (acc[activityModelInfo.categoryId] == null) {
        acc[activityModelInfo.categoryId] = getInitialCategoryCount(
          Object.keys(acc).length,
          activityModelInfo.categoryName
        );
      }
      const categoryCount = acc[activityModelInfo.categoryId];
      categoryCount.tCo2 += activityModelInfo.tCo2;
      categoryCount.lastActivityModel = activityModelInfo.id;
      categoryCount.categoryId = activityModelInfo.categoryId;

      return acc;
    }, {});



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

  const groupByCategoryID = GroupBy(activities, (v) => v.categoryId);

  const sortedTCO2ByCategory = Object.values(groupByCategoryID).map((item) =>
    item.sort((a, b) => b.tCo2 - a.tCo2));

  const totalOfTCO2ByBar = mapObject(groupByCategoryID, (x) =>
    x.reduce((total, next) => {
      return total + next.tCo2
    }, 0)
  );


  const categoryColorsMap = mapObject(groupByCategoryID, (x) =>
    arrayProjection(
      x.map((x: { id: number }) => x.id),
      [...getPalette(Color.EMISSION_BLUE)].reverse()
    )
  );

  const Series = sortedTCO2ByCategory.flatMap((item): any => {
    return item.map((item, index, list) => {

      const data = Array(Object.keys(activityCountByCategory).length).fill('');
      data[activityCountByCategory[item.categoryId].datasetPosition] = item.tCo2 / 1000


      return {
        data: data,
        name: item.name,
        groupId: item.categoryId,
        id: item.id,
        type: "bar",
        stack: "total",
        itemStyle: {
          color: categoryColorsMap[item.categoryId][item.id],
        },
        label: {
          position: "top",
          show: index == list.length - 1 ? true : false,
          formatter: () => `${convertToTons(totalOfTCO2ByBar[item.categoryId]).toString()} t`,
        },
        emphasis: {
          disabled: true
        }
      };
    });
  });

  const options: EChartsOption = {
    tooltip: {
      trigger: 'item',
      valueFormatter: (value: any) =>
        `${wecountFormat(Number(value))} ${t(
          "footprint.emission.tco2.tco2e"
        )}`,
    },
    grid: {
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: Object.values(activityCountByCategory).map(
          (item) => item.categoryName
        ),
        axisLabel: {
          rotate: 30,
        },
        axisTick: {
          length: 6,
          lineStyle: {
            type: "dashed",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        nameLocation: "middle",
        name: "Équivalents tonnes CO2",
        nameGap: 50,
      },
    ],

    series: Series,
  };




  const clicked = (param: any) => {
    //Here we get some some data to compare with the graphic
    //param.data and param.seriesIndex comes from the graphic and 
    //we compare our data to the data of the graphic 
    const comparisonData = sortedTCO2ByCategory.flatMap(x => x.map(item => {
      return {
        catId: item.categoryId,
        tc: item.tCo2 / 1000,
      }
    }))
    const index = param.seriesIndex;

    if (param.data == comparisonData[index].tc) {
      dispatch(viewByCategory(comparisonData[index].catId))
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "auto",
        paddingBottom: "60px",
        overflow: "hidden",
      }}
    >
      <ReactEChart
        option={merge(baseOptions2, options)}
        onEvents={[{ eventName: "click", handler: clicked }]}
        replaceMerge="series"
        notMerge={true}
      />
    </div>
  );
};

export default CategoriesDashboard;