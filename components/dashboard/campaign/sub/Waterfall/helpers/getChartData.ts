import {
  WaterfallDataName,
  WaterfallData,
  waterfallDataNames,
} from "@hooks/core/waterfall/helpers/waterfallData";

export type ChartData = {
  key: WaterfallDataName;
  value: number;
};

function getChartData(waterFallData: WaterfallData): ChartData[] {
  return waterfallDataNames.flatMap(key => {
    if (waterFallData[key] == null || waterFallData[key] === 0) {
      return [];
    }
    return [
      {
        key,
        value: waterFallData[key],
      },
    ];
  });
}

export default getChartData;
